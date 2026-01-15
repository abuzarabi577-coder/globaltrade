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
    // const adminId = req.userId || req.user?._id;
    const { id } = req.params;

    // 1) Load request
    const wr = await WithdrawRequest.findById(id);
    if (!wr) return res.status(404).json({ success: false, message: "Withdraw not found" });

    if (wr.status !== "pending") {
      return res.status(400).json({ success: false, message: `Already processed: ${wr.status}` });
    }

    // 2) Load user (wallet + network profile se)
    const user=  await User.findById(wr.userId).select("email walletAddress network totalEarnings");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.walletAddress || !user.network) {
      return res.status(400).json({ success: false, message: "User wallet/network not set" });
    }

    const amount = Number(wr.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid withdraw amount" });
    }

    // 3) Optional balance check
    if (Number(user.totalEarnings) < amount) {
      return res.status(400).json({ success: false, message: "Insufficient user balance" });
    }

    // 4) LOCK the request
    wr.status = "processing";
    // wr.adminId = adminId;
    await wr.save();

    // 5) Call PayRam payout API (docs keys EXACT!)
    const payoutPayload = {
  email: String(user.email).trim().toLowerCase(),
        blockChainCode: String(user.network).toUpperCase(), // ETH/TRX/BASE
      currencyCode: "USDT",
      amount: String(amount), // docs: "100000" (string ok)
      toAddress: user.walletAddress,
      customerID: String(user._id),
      // optional:
      // mobileNumber: "",
      // residentialAddress: "",
    };

    const payoutResp = await createPayramWithdrawal(payoutPayload);

    // 6) Save PayRam response
    wr.status = payoutResp?.status || "pending-approval";
    wr.payramPayoutId = payoutResp?.id || null;
    wr.payramSnapshot = payoutResp;
    await wr.save();

    // 7) Deduct user balance ONLY if payout accepted by PayRam (id exists)
    // (Best practice: deduct immediately after PayRam creates payout request)
    if (wr.payramPayoutId) {
      await User.updateOne({ _id: wr.userId }, { $inc: { totalEarnings: -amount } });
    }
user.WithdrwalAmt += wr.amount
user.save
    return res.json({
      success: true,
      message: "Withdraw sent to PayRam",
      withdraw: wr,
      payram: payoutResp,
    });
  } catch (e) {
    //console.error("adminApproveWithdraw error:", e);

    // If PayRam failed after setting "processing", mark it failed so admin can retry
    try {
      const { id } = req.params;
      await WithdrawRequest.findByIdAndUpdate(id, { $set: { status: "failed" } });
    } catch (_) {}

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
