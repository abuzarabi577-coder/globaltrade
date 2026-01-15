import cron from "node-cron";
import { recalculateLeaderboardRanks } from "./leaderboard.service.js";

export const startLeaderboardJob = () => {
  // ✅ Every 10 minutes
  cron.schedule("*/1 * * * *", async () => {
    try {
      await recalculateLeaderboardRanks();
      //console.log("[LeaderboardJob] ranks updated");
    } catch (e) {
      //console.error("[LeaderboardJob] error:", e.message);
    }
  });
};
