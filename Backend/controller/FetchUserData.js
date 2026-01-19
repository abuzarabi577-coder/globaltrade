// controller/authMeController.js
export const FetchUserData = async (req, res) => {
  try {
    const user = req.user; // ✅ from authMiddleware

    // ✅ Today tasks count (optional)
    const getDayKey = (d = new Date()) => d.toISOString().slice(0, 10);
    const todayKey = getDayKey();
const group = user?.dailyTasksCompleted?.find(x => x?.date === todayKey);

    const todayTasksCompleted = Array.isArray(group?.taskIds)
      ? group.taskIds.length
      : 0;
// //console.log(user);


    // if old schema was flat array [{taskId, completedAt}] then comment above and use filter:
    // const today = new Date(); today.setHours(0,0,0,0);
    // todayTasksCompleted = (user.dailyTasksCompleted || []).filter(t=>{
    //   const d = new Date(t.completedAt); d.setHours(0,0,0,0);
    //   return d.getTime() === today.getTime();
    // }).length;

    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        network:user.network,
        totalEarnings: user.totalEarnings ?? 0,
        TotalPoints: user.TotalPoints ?? 0,
        todayTasksCompleted,
        referralCode: user.referralCode,
        Referal:user.Referal,
         activePlan: user.activePlan ?? [],

      isActivePlan: !!user.isActivePlan,
isActive: !!user.isActive,
Referal:user.Referal ?? [],
createdAt: user.createdAt,
level:user.level,
earnings:user.earnings,
WithdrwalAmt:user.WithdrwalAmt
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
