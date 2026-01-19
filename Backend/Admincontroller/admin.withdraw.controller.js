import WithdrawRequest from "../DBModels/WithdrawRequest.js";
import User from "../DBModels/UserProfile.js";
import { createPayramWithdrawal } from "../services/payramPayout.service.js";

// ✅ Admin fetch withdraw list
export async function adminFetchWithdraws(req, res) {
  try {
    const status = req.query.status; // pending | processing | pending-approval | completed | rejected | failed...
    const q = status ? { status } : {};

    const list = await WithdrawRequest.find(q)
      .sort({ createdAt: -1 })
      .populate("userId", "name email walletAddress network totalEarnings")
      .lean();

    return res.json({ success: true, list });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ✅ Approve + send payout to PayRam
export async function adminApproveWithdraw(req, res) {
  try {
    const { id } = req.params;

    // 1) Load request
    const wr = await WithdrawRequest.findById(id);
    if (!wr) return res.status(404).json({ success: false, message: "Withdraw not found" });

    if (wr.status !== "pending") {
      return res.status(400).json({ success: false, message: `Already processed: ${wr.status}` });
    }

    // 2) Load user
    const user = await User.findById(wr.userId); 
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.walletAddress || !user.network) {
      return res.status(400).json({ success: false, message: "User wallet/network not set" });
    }

    const amount = Number(wr.amountUSD);

    // 3) Balance check
    if (Number(user.totalEarnings) < amount) {
      return res.status(400).json({ success: false, message: "Insufficient user balance" });
    }

    // 4) LOCK the request
    wr.status = "processing";
    await wr.save();

    // 5) PayRam Payload (Docs ke mutabiq fix kiya)
 // PayRam ko "ERC20" nahi, "ETH" chahiye
const payoutPayload = {
  email: String(user.email).trim().toLowerCase(),
  blockChainCode: user.network === "ERC20" ? "ETH" : (user.network === "TRC20" ? "TRX" : user.network), 
  currencyCode: "USDT",
  amount: String(amount),
  toAddress: user.walletAddress,
  customerID: String(user._id),
};

    const payoutResp = await createPayramWithdrawal(payoutPayload);

    // 6) Save PayRam response & Update Status
    wr.status = payoutResp?.status || "pending";
    wr.payramPayoutId = payoutResp?.id || null;
    wr.payramSnapshot = payoutResp;
    await wr.save();

    // 7) Deduct user balance & Update Stats
    if (payoutResp.status=== 'processed') {
      user.totalEarnings -= wr.amount;
      
      // Safety check: Agar field exist nahi karti to initialize karein
   
      user.WithdrwalAmt += amount;
      await user.save(); // ✅ Fixed syntax
    }

    return res.json({
      success: true,
      message: "Withdraw sent ",
      withdraw: wr,
      payram: payoutResp,
    });

  } catch (e) {
    console.error("CRASH ERROR:", e.message);
    // Request reset so admin can try again
    // try {
    //   await WithdrawRequest.findByIdAndUpdate(req.params.id, { $set: { status: "failed" } });
    // } catch (_) {}

    return res.status(500).json({ success: false, message: e.message });
  }
}

// ✅ Reject withdraw
export async function adminRejectWithdraw(req, res) {
  try {
    const adminId = req.userId || req.user?._id;
    const { id } = req.params;
    const { note } = req.body;

    const wr = await WithdrawRequest.findById(id);
    if (!wr) return res.status(404).json({ success: false, message: "Withdraw not found" });

    if (wr.status !== "pending") {
      return res.status(400).json({ success: false, message: `Already processed: ${wr.status}` });
    }

    wr.status = "rejected";
    wr.adminId = adminId;
    wr.adminNote = note || "";
    await wr.save();

    return res.json({ success: true, message: "Withdraw rejected", withdraw: wr });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}
