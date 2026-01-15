import InvestmentInvoice from "../DBModels/InvestmentInvoice.js";
import User from "../DBModels/UserProfile.js";
import { getDailyROIPctByPlan } from "../ProfitController/planRoi.js";
import {createPayramPayment,assignDepositAddress,getPayramPaymentStatus,} from "../services/payram.service.js";
import { activatePlanFromInvoice } from "./InvestmentPlanSaveController.js";

// ✅ Create invoice for investment
export async function createInvestmentInvoice(req, res) {
  try {
    const userId = req.userId || req.user?._id;
    const userEmail = req.user?.email;

    if (!userId || !userEmail) {
      return res.status(401).json({ success: false, message: "Unauthorized (missing user)" });
    }

    const { name, amount } = req.body;
    const amountUSD = Number(amount);
//console.log('amountUSD',amountUSD);


    if (!name || !Number.isFinite(amountUSD) || amountUSD <= 0) {
      return res.status(400).json({ success: false, message: "Invalid plan data" });
    }
    const dailyROIPct = getDailyROIPctByPlan(amountUSD);
 // ✅ 1) Reload fresh user state (avoid stale req.user)
    const user = await User.findById(userId).select("isActivePlan activePlan");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // ✅ 2) Block if plan already active (your main requirement)
    const hasOpenPlan = (user.activePlan || []).some((p) => p?.plan?.isClosed === false);
    if (user.isActivePlan || hasOpenPlan) {
      return res.status(409).json({
        success: false,
        message: "Your plan is already active. You cannot create a new invoice.",
      });
    }

    // ✅ 3) If there is already a pending invoice, don't create new one
    const pending = await InvestmentInvoice.findOne({
      userId,
      status: "pending",
    }).sort({ createdAt: -1 });

    if (pending) {
      return res.json({
        success: true,
        message: "Pending invoice already exists",
        invoice: {
          referenceId: pending.referenceId,
          address: pending.depositAddress,
          amountUSD: pending.plan.amountUSD,
          asset: pending.asset,
          network: "TRC20",
          status: pending.status,
        },
      });
    }
    // ✅ PayRam create payment (use amountUSD key!)
    const payment = await createPayramPayment({
      customerEmail: userEmail,
      customerID: String(userId),
      amountUSD, // ✅ IMPORTANT
    });

    const referenceId = payment?.reference_id || payment?.referenceId;
    if (!referenceId) {
      return res.status(500).json({ success: false, message: "PayRam did not return reference_id", payment });
    }

    // ✅ TRC20 (changed from ETH due to API limitation)
  const deposit = await assignDepositAddress({
  referenceId,
  blockchainCode: "ETH",
  currencyCode: "USDT",
});

    const address = deposit?.Address || deposit?.address || "";

    const invoice = await InvestmentInvoice.create({
      userId,
      plan: { name, amountUSD,dailyROIPct }, // ✅ IMPORTANT (schema uses amountUSD)
      referenceId,
      blockchainCurrency: "ETH",
      asset: "USDT",
      depositAddress: address,
      status: "pending",
      payramSnapshot: { payment, deposit },
    });

    return res.json({
      success: true,
      invoice: {
        referenceId: invoice.referenceId,
        address: invoice.depositAddress,
        amountUSD: invoice.plan.amountUSD, // ✅ now exists
        asset: invoice.asset,
        network: "ERC20",
        status: invoice.status,
      },
    });
  } catch (e) {
    //console.error("❌ createInvestmentInvoice error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ✅ Webhook: Always verify by calling PayRam status endpoint (best practice)
export async function webhookPayram(req, res) {
  try {
     // Optional: protect endpoint by a shared secret header you set in PayRam (if available)
    // Example:
    // const sig = req.headers["x-payram-secret"];
    // if (process.env.PAYRAM_WEBHOOK_SECRET && sig !== process.env.PAYRAM_WEBHOOK_SECRET) {
    //   return res.status(401).json({ success: false, message: "Unauthorized webhook" });
    // }
    // We don't know exact payload shape from docs, so handle multiple possibilities:
    const referenceId =
      req.body?.reference_id ||
      req.body?.referenceId ||
      req.body?.data?.reference_id ||
      req.body?.data?.referenceId;

    if (!referenceId) {
      // still ack to avoid retries storm
      return res.json({ success: true, received: true });
    }

    const invoice = await InvestmentInvoice.findOne({ referenceId });
    if (!invoice) return res.json({ success: true, received: true });

    // Verify from PayRam directly
    const statusResp = await getPayramPaymentStatus(referenceId);

    // You must map status depending on PayRam response.
    // We'll treat "Complete/Confirmed/Paid" as confirmed.
   const rawStatus = String(statusResp?.status || statusResp?.data?.status || "").toLowerCase();
const isConfirmed =
  rawStatus.includes("complete") ||
  rawStatus.includes("confirm") ||
  rawStatus.includes("paid") ||
  rawStatus.includes("success") ||
  rawStatus.includes("done") ||
  rawStatus.includes("finish");

 if (isConfirmed && invoice.status !== "confirmed") {
  invoice.status = "confirmed";
  invoice.confirmedAt = new Date();
  invoice.payramSnapshot = { ...invoice.payramSnapshot, statusResp };
  await invoice.save();
//console.log("WEBHOOK HIT:", req.body);
//console.log("referenceId:", referenceId);
//console.log("PayRam statusResp:", statusResp);

  // ✅ add this
  await activatePlanFromInvoice(invoice);
}



    return res.json({ success: true });
 } catch (e) {
  //console.error("❌ webhookPayram error:", e);
  return res.json({ success: true, error: e.message });
}

}

// ✅ Polling endpoint for UI button: "I have paid"
export async function checkInvoiceStatus(req, res) {
  try {
    const userId = req.userId || req.user?._id
    const { referenceId } = req.params;

    const invoice = await InvestmentInvoice.findOne({ referenceId, userId });
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    const statusResp = await getPayramPaymentStatus(referenceId);
  const rawStatus = String(statusResp?.status || statusResp?.data?.status || "").toLowerCase();
const isConfirmed =
  rawStatus.includes("complete") ||
  rawStatus.includes("confirm") ||
  rawStatus.includes("paid") ||
  rawStatus.includes("success") ||
  rawStatus.includes("done") ||
  rawStatus.includes("finish");

    if (isConfirmed && invoice.status !== "confirme") {
      invoice.status = "confirmed";
      invoice.confirmedAt = new Date();
      invoice.payramSnapshot = { ...invoice.payramSnapshot, statusResp };
      await invoice.save();
    }

    return res.json({
      success: true,
      status: invoice.status,
      payramStatus: statusResp?.status || statusResp?.data?.status || null,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}
export async function getLatestInvoice(req, res) {
  try {
    const userId = req.userId || req.user?._id;

    const inv = await InvestmentInvoice.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!inv) return res.json({ success: true, invoice: null });

    return res.json({
      success: true,
      invoice: {
        referenceId: inv.referenceId,
        address: inv.depositAddress,
        amountUSD: inv.plan.amountUSD,
        asset: inv.asset,
        network: inv.blockchainCurrency === "ETH" ? "ERC20" : inv.blockchainCurrency,
        status: inv.status,
        createdAt: inv.createdAt,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}