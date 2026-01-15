import User from "../DBModels/UserProfile.js";
import { recalculateLeaderboardRanks } from "./leaderboard.service.js";

export const adminRecalculateLeaderboard = async (req, res) => {
  try {
    const result = await recalculateLeaderboardRanks();
    return res.json({ success: true, message: "Leaderboard recalculated", ...result });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ✅ Public/Logged in view leaderboard (top users)
export const getLeaderboard = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 50), 100);

    const users = await User.find({ isActive: true })
      .select("name email level totalEarnings rank referralCode Join")
      .sort({ "rank.position": 1 }) // rank already computed
      .limit(limit);

    return res.json({ success: true, users });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
