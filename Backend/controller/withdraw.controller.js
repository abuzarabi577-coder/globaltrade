import WithdrawRequest from "../DBModels/WithdrawRequest.js";
import User from "../DBModels/UserProfile.js";

const MIN_WITHDRAW = 20;
const WITHDRAW_FEE_PERCENT = 10; // 10% Fee

const mapUserNetworkToPayram = (userNetwork) => {
  const n = String(userNetwork || "").toLowerCase();
  // PayRam usually needs ETH for ERC20 or TRX for TRC20
  if (n.includes("erc") || n.includes("eth")) return { blockchainCurrency: "ETH", network: "ERC20" };
  if (n.includes("trc") || n.includes("tron")) return { blockchainCurrency: "TRX", network: "TRC20" };
  return { blockchainCurrency: "ETH", network: "ERC20" };
};

export async function createWithdrawRequest(req, res) {
  try {
    const userId = req.userId || req.user?._id;
    const amountUSD = Number(req.body.amount); // Original amount from frontend (e.g. 100)
console.log('amountUSD',amountUSD);

    if (!Number.isFinite(amountUSD) || amountUSD <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }
    if (amountUSD < MIN_WITHDRAW) {
      return res.status(400).json({ success: false, message: `Minimum withdraw is ${MIN_WITHDRAW} USDT` });
    }

    const user = await User.findById(userId).select("walletAddress network totalEarnings Iswithdraw Freeze");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.Freeze === true) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_FROZEN",
        message: "Account is frozen. Please contact support.",
      });
    }

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

    // 🔥 FEE CALCULATION LOGIC
    const feeAmount = (amountUSD * WITHDRAW_FEE_PERCENT) / 100;
    const amountAfterFee = amountUSD - feeAmount; // Ye wo amount hai jo user ko milegi

    const { blockchainCurrency, network } = mapUserNetworkToPayram(user.network);

    const wr = await WithdrawRequest.create({
      userId,
      amount: amountUSD,           // Full Amount (e.g., 100) - For balance check
  amountUSD: amountAfterFee,   // Original amount (e.g. 100) - For balance deduction record
      asset: "USDT",
      blockchainCurrency,
      network,
      toAddress: user.walletAddress,
      status: "pending",
    });

    return res.json({ 
      success: true, 
      message: `Withdraw request of $${amountUSD} submitted. You will receive $${amountAfterFee} after 10% fee.`, 
      request: wr 
    });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

export async function myWithdrawRequests(req, res) {
  const userId = req.userId || req.user?._id;
  const list = await WithdrawRequest.find({ userId }).sort({ createdAt: -1 }).lean();
  return res.json({ success: true, list });
}