import User from "../DBModels/UserProfile.js";

const badgeTitle = (title) => {
  // normalize just in case
  const t = String(title || "").toUpperCase();
  if (["PLATINUM", "GOLD", "SILVER", "BRONZE"].includes(t)) return t;
  return "BRONZE";
};

// ✅ Public: Top rankers (safe fields only)
export const getPublicTopRankers = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 10), 50);

    const users = await User.find({ isActive: true })
      .select("name level totalEarnings rank.position rank.title") // ✅ NO email/referralCode
      .sort({ "rank.position": 1 })
      .limit(limit)
      .lean();

    // ✅ If ranks not calculated yet, fallback sorting
    const cleaned = (users || []).map((u, idx) => ({
      _id: u._id,
      name: u.name || "—",
      level: Number(u.level || 0),
      totalEarnings: Number(u.totalEarnings || 0),
      rank: {
        position: Number(u.rank?.position || idx + 1),
        title: badgeTitle(u.rank?.title),
      },
    }));

    return res.json({ success: true, users: cleaned });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};