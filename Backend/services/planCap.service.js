import User from "../DBModels/UserProfile.js";

export const checkAndClosePlanCap = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return { ok: false, message: "User not found" };

  if (!user.isActivePlan) return { ok: true, skipped: "no_active_plan" };

  const lastEntry = user.activePlan?.[user.activePlan.length - 1];
  const plan = lastEntry?.plan;
  if (!plan) return { ok: true, skipped: "no_plan" };
  if (plan.isClosed) return { ok: true, skipped: "already_closed" };

  const principal = Number(plan.amount || 0);
  if (!Number.isFinite(principal) || principal <= 0) return { ok: false, message: "Invalid principal" };

  // ✅ dynamic multiplier (agar user ne kabhi refer kiya hai => 4x, else 3x)
  const multiplier = (user.Referal && user.Referal.length > 0) ? 4 : 3;

  const capProfit = principal * (multiplier - 1);

  // ✅ IMPORTANT: total earnings delta since plan start
  const startTotal = Number(plan.startTotalEarnings || 0);
  const earnedSinceStart = Number(user.totalEarnings || 0) - startTotal;

  if (earnedSinceStart >= capProfit) {
    plan.isClosed = true;
    plan.closedAt = new Date();
    user.isActivePlan = false;

    // ✅ ROI withdraw off (referral/team still allowed by type)
    user.Iswithdraw = false;

    await user.save();
    return { ok: true, closed: true, multiplier, capProfit, earnedSinceStart };
  }

  return { ok: true, closed: false, multiplier, capProfit, earnedSinceStart };
};
