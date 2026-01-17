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
    // PayRam GET request bhejta hai, isliye hum params/query check karenge
    const referenceId = 
      req.query?.reference_id || 
      req.body?.reference_id || 
      req.query?.referenceId


    if (!referenceId) {
      return res.json({ success: true, message: "No referenceId found" });
    }

    const invoice = await InvestmentInvoice.findOne({ referenceId });
    if (!invoice) return res.json({ success: true, message: "Invoice not found" });

    // Verify from PayRam directly (Best practice)
    const statusResp = await getPayramPaymentStatus(referenceId);

    // ✅ DOCS FIX: PayRam uses 'FILLED' for successful payments
    const paymentState = statusResp?.paymentState || statusResp?.status;
    
    const isConfirmed = 
      paymentState === "FILLED" || 
      paymentState === "OVER_FILLED";

    if (isConfirmed && invoice.status !== "confirmed") {
      invoice.status = "confirmed";
      invoice.confirmedAt = new Date();
      invoice.payramSnapshot = { ...invoice.payramSnapshot, statusResp };
      await invoice.save();

      // Plan activate karein
      await activatePlanFromInvoice(invoice);
    }

    return res.json({ success: true });
  } catch (e) {
    return res.json({ success: true, error: e.message });
  }
}
// ✅ Polling endpoint for UI button: "I have paid"
// ✅ Polling fix for "I have paid" button
// ✅ Polling endpoint: User manually clicks "I have paid"
export async function checkInvoiceStatus(req, res) {
  try {
    const userId = req.userId || req.user?._id;
    const { referenceId } = req.params;

    // 1. Database se invoice nikalein aur ensure karein ke ye isi user ki hai
    const invoice = await InvestmentInvoice.findOne({ referenceId, userId });
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found or unauthorized" });
    }

    // Agar invoice already confirmed hai, toh dobara API call karne ki zaroorat nahi
    if (invoice.status === "confirmed") {
      return res.json({
        success: true,
        status: "confirmed",
        message: "Plan is already active"
      });
    }

    // 2. PayRam API se live status check karein
    const statusResp = await getPayramPaymentStatus(referenceId);
    
    // PayRam docs ke mutabiq paymentState check karein
    const paymentState = statusResp?.paymentState || statusResp?.status;

    // 3. Agar payment FILLED hai toh plan activate karein
    const isConfirmed = paymentState === "FILLED" || paymentState === "OVER_FILLED";

    if (isConfirmed) {
      invoice.status = "confirmed";
      invoice.confirmedAt = new Date();
      invoice.payramSnapshot = { ...invoice.payramSnapshot, pollingUpdate: statusResp };
      
      await invoice.save();
      
      // ✅ Plan activation trigger
      await activatePlanFromInvoice(invoice);

      return res.json({
        success: true,
        status: "confirmed",
        payramStatus: paymentState,
        message: "Payment verified and plan activated!"
      });
    }

    // 4. Agar abhi tak payment nahi mili
    return res.json({
      success: true,
      status: invoice.status, // will be 'pending'
      payramStatus: paymentState,
      message: "Payment not detected yet. Please wait for blockchain confirmations."
    });

  } catch (e) {
    console.error("❌ Polling Error:", e.message);
    return res.status(500).json({ success: false, message: "Internal server error during status check" });
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