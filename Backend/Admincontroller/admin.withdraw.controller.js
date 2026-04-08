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

    // Atomic lock
    const wr = await WithdrawRequest.findOneAndUpdate(
  { _id: id, status: "pending" },   // ✅ only update if still pending
  { status: "processing" },          // lock request
  { new: true }
);
    if (!wr) {
      return res.status(400).json({
        success: false,
        message: "Already processed or not found",
      });
    }

    const user = await User.findById(wr.userId);
    if (!user) {
      wr.status = "failed";
      await wr.save();
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.walletAddress || !user.network) {
      wr.status = "failed";
      await wr.save();
      return res.status(400).json({ success: false, message: "Wallet/network missing" });
    }

    const amount = Number(wr.amountUSD);

    if (Number(user.totalEarnings) < amount) {
      wr.status = "failed";
      await wr.save();
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    const payoutPayload = {
      email: String(user.email).trim().toLowerCase(),
      blockChainCode: "ETH",
      currencyCode: "USDT",
      amount,
      toAddress: user.walletAddress,
      customerID: String(user._id),
    };

    const payoutResp = await createPayramWithdrawal(payoutPayload);

    wr.status = payoutResp?.status || "pending";
    wr.payramPayoutId = payoutResp?.id || null;
    wr.payramSnapshot = payoutResp;
    await wr.save();

    if (payoutResp?.status === "processed") {
      user.totalEarnings -= amount;
      user.WithdrwalAmt = (user.WithdrwalAmt || 0) + amount;
      await user.save();
    }

    return res.json({
      success: true,
      message: "Withdraw sent",
      withdraw: wr,
    });

  } catch (e) {
    console.error("CRASH:", e);
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