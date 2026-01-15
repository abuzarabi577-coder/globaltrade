import mongoose from "mongoose";
import ReferralLink from "../../DBModels/ReferralLink.js";
import ReferralCommission from "../../DBModels/ReferralCommission.js";
import { PROFIT_SHARE_LEVELS } from "../../constants/referralLevels.js";

export const getReferralStats = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const links = await ReferralLink.find({ referrerId: userId }).lean();
    const totalReferrals = links.length;

    const commissions = await ReferralCommission.find({ uplineUserId: userId, type: "roi_profit_share" }).lean();
    const totalEarnings = commissions.reduce((s, c) => s + (c.amount || 0), 0);

    const byLevel = await Promise.all(
      PROFIT_SHARE_LEVELS.map(async (lvl) => {
        const count = links.filter(x => x.level === lvl.level).length;
        const levelEarnings = commissions
          .filter(c => c.level === lvl.level)
          .reduce((s, c) => s + (c.amount || 0), 0);

        return { level: lvl.level, percentage: lvl.pct, count, earnings: levelEarnings };
      })
    );

    return res.json({ success: true, totalReferrals, totalEarnings, referralsByLevel: byLevel });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
