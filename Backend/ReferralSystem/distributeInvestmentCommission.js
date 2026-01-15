// ReferralSystem/distributeInvestmentCommission.js
import ReferralLink from "../DBModels/ReferralLink.js";
import InvestmentCommission from "../DBModels/InvestmentCommission.js";
import User from "../DBModels/UserProfile.js";
import { INVEST_LEVELS } from "../constants/referralLevels.js";
import { checkAndClosePlanCap } from "../services/planCap.service.js";

const pctByLevel = new Map(INVEST_LEVELS.map((x) => [x.level, x.pct]));
const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

export const distributeInvestmentCommission = async ({ investmentId, sourceUserId, investAmount }) => {
  if (!investAmount || investAmount <= 0) return { ok: true, skipped: "no_amount" };

  // uplines for this user
  const links = await ReferralLink.find({ referredUserId: sourceUserId, level: { $lte: 10 } })
    .select("referrerId level")
    .lean();

  if (!links.length) return { ok: true, skipped: "no_upline" };

  let paid = 0;
  let totalDistributed = 0;

  for (const link of links) {
    const level = Number(link.level);
    const pct = pctByLevel.get(level) || 0;
    if (!pct) continue;

    const upline = await User.findById(link.referrerId).select("_id level");
    if (!upline) continue;

    // ✅ eligibility gate: upline.level must be >= distance
    if ((upline.level || 0) < level) continue;

    const commission = round2((investAmount * pct) / 100);
    if (commission <= 0) continue;

    try {
      await InvestmentCommission.create({
        investmentId,
        sourceUserId,
        uplineUserId: upline._id,
        level,
        pct,
        baseAmount: investAmount,
        amount: commission,
      });

      await User.updateOne(
        { _id: upline._id },
        { $inc: { "earnings.referralCommission": commission, totalEarnings: commission } }
      );
await checkAndClosePlanCap(upline._id);

      paid++;
      totalDistributed = round2(totalDistributed + commission);
    } catch (e) {
      if (e?.code !== 11000) throw e; // duplicate ignore
    }
  }

  return { ok: true, paid, totalDistributed };
};
