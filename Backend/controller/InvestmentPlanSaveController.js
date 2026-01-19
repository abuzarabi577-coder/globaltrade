import User from "../DBModels/UserProfile.js";
import { distributeInvestmentCommission } from "../ReferralSystem/distributeInvestmentCommission.js";

const getDayKeyUTC = () => new Date().toISOString().slice(0, 10);

// const PLAN_CONFIG = {
//   plan1: { dailyROIPct: 0.67, min: 100, max: 4999 },
//   plan2: { dailyROIPct: 0.83, min: 5000, max: 24999 },
//   plan3: { dailyROIPct: 0.9, min: 25000, max: 100000 },
// };

export async function activatePlanFromInvoice(invoiceDoc) {
  const userId = invoiceDoc.userId;
const name = String(invoiceDoc.plan.name).toLowerCase().trim();
  const amountUSD = Number(invoiceDoc.plan?.amountUSD);
  const dailyROIPct = Number(invoiceDoc.plan?.dailyROIPct);

  // if (!cfg) throw new Error("Invalid plan name in invoice");

  // // amount strict check (important)
  // if (!Number.isFinite(amountUSD) || amountUSD < cfg.min || amountUSD > cfg.max) {
  //   throw new Error("Invoice amount does not match plan config");
  // }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // ✅ idempotent: same invoice reference should not activate twice
  // We store referenceId inside activePlan.plan meta
  const alreadyActivated = user.activePlan?.some(
    (p) => p?.plan?.referenceId === invoiceDoc.referenceId
  );
  if (alreadyActivated) return { user, activated: false };

  user.isActivePlan = true;

  user.activePlan.push({
    date: getDayKeyUTC(),
    plan: {
      name  ,          // keep key
      amount: amountUSD,             // principal
      dailyROIPct: dailyROIPct,  // ✅ correct ROI
      totalProfit: 0,
      credits: [],
      isClosed: false,
      closedAt: null,


      // ✅ snapshots for correct cap logic
      startTotalEarnings: Number(user.totalEarnings || 0),
      // multiplierAtStart: multiplier,
      // ✅ store invoice trace
      referenceId: invoiceDoc.referenceId,
      network: invoiceDoc.blockchainCurrency, // ETH / TRX / BASE
      asset: invoiceDoc.asset || "USDT",
    },
  });
user.Iswithdraw = true;

  await user.save();

  const investmentEntry = user.activePlan[user.activePlan.length - 1];

  // ✅ distribute commissions
  await distributeInvestmentCommission({
    investmentId: investmentEntry._id,
    sourceUserId: user._id,
    investAmount: amountUSD,
  });

  return { user, activated: true };
}
