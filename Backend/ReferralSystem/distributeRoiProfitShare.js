// ReferralSystem/distributeRoiProfitShare.js
import ReferralLink from "../DBModels/ReferralLink.js";
import ReferralCommission from "../DBModels/ReferralCommission.js";
import User from "../DBModels/UserProfile.js";
import { PROFIT_SHARE_LEVELS } from "../constants/referralLevels.js";
import { round2 } from "../utils/dayKey.js";
import { checkAndClosePlanCap } from "../services/planCap.service.js";

const pctByLevel = new Map(PROFIT_SHARE_LEVELS.map((x) => [x.level, x.pct]));

export const distributeRoiProfitShare = async ({ dateKey, sourceUserId, roiAmount }) => {
  if (!roiAmount || roiAmount <= 0) return { ok: true, skipped: "no_roi" };

  // ✅ correct: uplines of source user
  const links = await ReferralLink.find({ referredUserId: sourceUserId, level: { $lte: 10 } })
    .select("referrerId level")
    .lean();

  if (!links.length) return { ok: true, skipped: "no_upline" };

  let totalDistributed = 0;
  let paid = 0;

  for (const link of links) {
    const level = Number(link.level);
    const pct = pctByLevel.get(level);
    if (!pct) continue;

    const upline = await User.findById(link.referrerId).select("_id level");
    if (!upline) continue;

    // ✅ eligibility gate
    if ((upline.level || 0) < level) continue;

    const commission = round2((roiAmount * pct) / 100);
    if (commission <= 0) continue;

    try {
      await ReferralCommission.create({
        date: dateKey,
        type: "roi_profit_share",
        sourceUserId,
        uplineUserId: upline._id,
        level,
        pct,
        baseAmount: roiAmount,
        amount: commission,
      });

      await User.updateOne(
        { _id: upline._id },
        { $inc: { "earnings.teamProfitShare": commission, totalEarnings: commission } }
      );
await checkAndClosePlanCap(upline._id);

      totalDistributed = round2(totalDistributed + commission);
      paid++;
    } catch (e) {
      if (e?.code !== 11000) throw e; // duplicate ignore
    }
  }

  return { ok: true, paid, totalDistributed };
};
