import WithdrawRequest from "../DBModels/WithdrawRequest.js";
import User from "../DBModels/UserProfile.js";

const MIN_WITHDRAW = 20;
const WITHDRAW_FEE_PERCENT = 10; // 10% Fee

const mapUserNetworkToPayram = (userNetwork) => {
  const n = String(userNetwork || "").toLowerCase();
  if (n.includes("erc") || n.includes("eth")) return { blockchainCurrency: "ETH", network: "ERC20" };
  if (n.includes("trc") || n.includes("tron")) return { blockchainCurrency: "TRX", network: "TRC20" };
  return { blockchainCurrency: "ETH", network: "ERC20" };
};

// ✅ Day-of-month in given timezone (global support)
const getUserDayInTZ = (tz) => {
  const safeTz = tz && typeof tz === "string" ? tz : "UTC";
  const dayStr = new Intl.DateTimeFormat("en-US", {
    timeZone: safeTz,
    day: "2-digit",
  }).format(new Date());
  return Number(dayStr); // 1..31
};

// ✅ Optional: next allowed date in same timezone (for user message)
const getNextAllowedISO = (tz) => {
  const safeTz = tz && typeof tz === "string" ? tz : "UTC";

  // Get Y/M/D in user's timezone reliably
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: safeTz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type) => parts.find((p) => p.type === type)?.value;
  const y = Number(get("year"));
  const m = Number(get("month")); // 01-12
  const d = Number(get("day"));

  // Next allowed day: if day < 1 => 1, else if < 15 => 15 else => 1 of next month
  let ny = y;
  let nm = m;
  let nd;

  if (d < 1) nd = 1;
  else if (d < 15) nd = 15;
  else {
    nd = 1;
    nm = m + 1;
    if (nm === 13) {
      nm = 1;
      ny = y + 1;
    }
  }

  // Return ISO-like string (date only) to show in UI; timezone conversion not critical
  const mm = String(nm).padStart(2, "0");
  const dd = String(nd).padStart(2, "0");
  return `${ny}-${mm}-${dd}`;
};

export async function createWithdrawRequest(req, res) {
  try {
    // ✅ Withdraw only on 1st & 15th (User timezone)
    const userTz = req.headers["x-user-tz"] || req.headers["x-timezone"] || "UTC";

    let dayInUserTz;
    try {
      dayInUserTz = getUserDayInTZ(userTz);
    } catch {
      dayInUserTz = getUserDayInTZ("UTC");
    }

    if (dayInUserTz !== 1 && dayInUserTz !== 15) {
      return res.status(400).json({
        success: false,
        code: "WITHDRAW_DATE_RESTRICTED",
        message: "Withdraw requests are only allowed on 1st and 15th of each month.",
        allowedDays: [1, 15],
        timezoneUsed: String(userTz || "UTC"),
        nextAllowedDate: getNextAllowedISO(userTz), // optional helpful
      });
    }

    const userId = req.userId || req.user?._id;
    const amountUSD = Number(req.body.amount);
    console.log("amountUSD", amountUSD);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized (missing user)" });
    }

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

    // 🔥 FEE CALCULATION
    const feeAmount = (amountUSD * WITHDRAW_FEE_PERCENT) / 100;
    const amountAfterFee = amountUSD - feeAmount;

    const { blockchainCurrency, network } = mapUserNetworkToPayram(user.network);

    const wr = await WithdrawRequest.create({
      userId,
      amount: amountUSD,        // Full requested amount
      amountUSD: amountAfterFee, // Net amount after fee (your schema naming)
      asset: "USDT",
      blockchainCurrency,
      network,
      toAddress: user.walletAddress,
      status: "pending",
    });

    return res.json({
      success: true,
      message: `Withdraw request of $${amountUSD} submitted. You will receive $${amountAfterFee} after 10% fee.`,
      request: wr,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message || "Server error" });
  }
}

export async function myWithdrawRequests(req, res) {
  try {
    const userId = req.userId || req.user?._id;
    const list = await WithdrawRequest.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, list });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message || "Server error" });
  }
}