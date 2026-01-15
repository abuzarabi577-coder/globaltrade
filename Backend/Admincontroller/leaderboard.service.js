import User from "../DBModels/UserProfile.js";

const calcScore = (level, earnings) => {
  // ✅ Level ko strong weight do (priority)
  // Example formula:
  // level * 1,000,000 + earnings
  // so level difference always outranks earnings.
  const lv = Number(level || 0);
  const earn = Number(earnings || 0);
  return lv * 1000000 + earn;
};

const getTierByStats = (level, earnings) => {
  const lv = Number(level || 0);
  const earn = Number(earnings || 0);

  if (lv >= 8) return "PLATINUM";
  if (lv >= 5) return "GOLD";
  if (lv >= 2) return "SILVER";
  return "BRONZE"; // ✅ level 0 & earning 0 will always be bronze
};


export const recalculateLeaderboardRanks = async () => {
  // ✅ Get all active users only (optional)
  const users = await User.find({ isActive: true })
    .select("_id level totalEarnings createdAt")
    .sort({ level: -1, totalEarnings: -1, createdAt: 1 });

  if (!users.length) return { updated: 0, total: 0 };

  const bulk = [];
  let position = 1;

  for (const u of users) {
    const score = calcScore(u.level, u.totalEarnings);
const title = getTierByStats(u.level, u.totalEarnings);

    bulk.push({
      updateOne: {
        filter: { _id: u._id },
        update: {
          $set: {
            "rank.title": title,
            "rank.score": score,
            "rank.position": position,
            "rank.updatedAt": new Date(),
          },
        },
      },
    });

    position++;
  }

  if (bulk.length) await User.bulkWrite(bulk);
  return { updated: bulk.length, total: users.length };
};
