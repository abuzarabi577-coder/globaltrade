// controller/tasks/completeDailyTasks.js
import User from "../DBModels/UserProfile.js";
import { creditDailyProfitAfterTasks } from "../ProfitController/creditDailyProfit.js";
import { getDayKeyUTC } from "../utils/dayKey.js";
import { distributeRoiProfitShare } from "../ReferralSystem/distributeRoiProfitShare.js";

const completeDailyTasks = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { taskIds } = req.body;

    const todayKey = getDayKeyUTC();

    const cleaned = Array.isArray(taskIds)
      ? [...new Set(taskIds.map(String).filter((id) => id && id !== "undefined"))]
      : [];

    if (cleaned.length !== 5) {
      return res.status(400).json({
        success: false,
        message: "Exactly 5 UNIQUE task required",
        received: taskIds,
      });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const todayEntry = (user.dailyTasksCompleted || []).find((d) => d.date === todayKey);
    if (todayEntry) {
      return res.status(400).json({
        success: false,
        message: "Today tasks already saved",
        date: todayKey,
        taskIds: todayEntry.taskIds,
      });
    }

    // save tasks
    user.dailyTasksCompleted.push({ date: todayKey, taskIds: cleaned });
    user.dailyTasksCompleted = user.dailyTasksCompleted.slice(-30);
    user.TotalPoints = Number(user.TotalPoints || 0) + 100;

    await user.save();

    // ✅ credit ROI profit (only if plan active, only once/day)
    const profitResult = await creditDailyProfitAfterTasks(user._id);

    // ✅ distribute upline profit share only if credited
    if (profitResult?.ok && profitResult?.credited && Number(profitResult.credited) > 0) {
      await distributeRoiProfitShare({
        dateKey: todayKey,
        sourceUserId: user._id,
        roiAmount: Number(profitResult.credited),
      });
    }

    return res.json({
      success: true,
      message: "Daily tasks saved successfully",
      date: todayKey,
      taskIds: cleaned,
      pointsAdded: 100,
      profit: profitResult,
    });
  } catch (error) {
    //console.error("ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default completeDailyTasks;
