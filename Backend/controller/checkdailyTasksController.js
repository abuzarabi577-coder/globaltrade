import User from '../DBModels/UserProfile.js';

const getDayKey = (d = new Date()) => d.toISOString().slice(0, 10);

export const checkDailyTasks = async (req, res) => {
  try {
    const userId = req.user._id; 

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const todayKey = getDayKey();
    const todayEntry = user.dailyTasksCompleted?.find(d => d.date === todayKey);

    const ids = todayEntry?.taskIds || [];

    return res.json({
      success: true,
      date: todayKey,
      syncedToday: ids.length === 5,
      todayCount: ids.length,
      taskIds: ids
    });

  } catch (error) {
    //console.error("💥 checkDailyTasks error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
