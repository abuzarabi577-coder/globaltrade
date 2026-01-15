// controller/withdraw.controller.js
import WithdrawRequest from "../DBModels/WithdrawRequest.js";
import User from "../DBModels/UserProfile.js";

const MIN_WITHDRAW = 50;

const mapUserNetworkToPayram = (userNetwork) => {
  const n = String(userNetwork || "").toLowerCase();
  if (n.includes("erc") || n.includes("eth")) return { blockchainCurrency: "ETH", network: "ERC20" };
  return { blockchainCurrency: "ETH", network: "ERC20" };
};

export async function createWithdrawRequest(req, res) {
  try {
    const userId = req.userId || req.user?._id;
    const amountUSD = Number(req.body.amount);

    if (!Number.isFinite(amountUSD) || amountUSD <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }
    if (amountUSD < MIN_WITHDRAW) {
      return res.status(400).json({ success: false, message: `Minimum withdraw is ${MIN_WITHDRAW} USDT` });
    }

    // ✅ include Iswithdraw + Freeze in select
    const user = await User.findById(userId).select("walletAddress network totalEarnings Iswithdraw Freeze");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // ✅ optional: block if account frozen
    if (user.Freeze === true) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_FROZEN",
        message: "Account is frozen. Please contact support.",
      });
    }

    // ✅ MAIN: withdraw locked
    if (user.Iswithdraw === false) {
      return res.status(403).json({
        success: false,
        code: "WITHDRAW_LOCKED",
        message: "Withdraw is locked. Activate a new plan, then withdraw will be active.",
      });
    }

    if (!user.walletAddress) {
      return res.status(400).json({ success: false, message: "Wallet address not set in profile" });
    }

    const available = Number(user.totalEarnings || 0);
    if (available < amountUSD) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    const { blockchainCurrency, network } = mapUserNetworkToPayram(user.network);

    const wr = await WithdrawRequest.create({
      userId,
      amount: amountUSD,
      asset: "USDT",
      blockchainCurrency,
      network,
      toAddress: user.walletAddress,
      status: "pending",
    });

    return res.json({ success: true, message: "Withdraw request submitted", request: wr });
  } catch (e) {
    //console.error("createWithdrawRequest error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
}

export async function myWithdrawRequests(req, res) {
  const userId = req.userId || req.user?._id;
  const list = await WithdrawRequest.find({ userId }).sort({ createdAt: -1 }).lean();
  return res.json({ success: true, list });
}
