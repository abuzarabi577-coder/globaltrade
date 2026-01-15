import User from "../DBModels/UserProfile.js";
import { checkAndClosePlanCap } from "../services/planCap.service.js";
import { getDailyROIPctByPlan } from "./planRoi.js";

const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);

export const creditDailyProfitAfterTasks = async (userId) => {
  const today = dayKey();

  const user = await User.findById(userId);
  if (!user) return { ok: false, message: "User not found" };

  if (!user.isActivePlan) return { ok: false, message: "Plan not active" };

  const lastEntry = user.activePlan?.[user.activePlan.length - 1];
  const plan = lastEntry?.plan;

  if (!plan) return { ok: false, message: "No plan found" };
  if (plan.isClosed) return { ok: false, message: "Plan already closed" };

  // ✅ tasks check
  const todayTasks = (user.dailyTasksCompleted || []).find((x) => x.date === today);
  if (!todayTasks || !Array.isArray(todayTasks.taskIds) || todayTasks.taskIds.length !== 5) {
    return { ok: false, message: "Tasks not completed today" };
  }

  // ✅ no double credit
  const alreadyCredited = (plan.credits || []).some((c) => c.date === today);
  if (alreadyCredited) return { ok: false, message: "Already credited today" };

  const principal = Number(plan.amount || 0);
  if (!Number.isFinite(principal) || principal <= 0) {
    return { ok: false, message: "Invalid plan principal" };
  }

  // ✅ multiplier rule (dynamic)
  const multiplier = (user.Referal && user.Referal.length > 0) ? 4 : 3;

  // ✅ cap profit (3x => profit=2x principal, 4x => profit=3x principal)
  const capProfit = principal * (multiplier - 1);

  // ✅ VERY IMPORTANT: include referral/team earnings in cap reach
  const startTotal = Number(plan.startTotalEarnings || 0);
  const earnedSinceStart = Number(user.totalEarnings || 0) - startTotal;

  const remaining = capProfit - earnedSinceStart;

  // ✅ if already reached via referral/team etc
  if (remaining <= 0) {
    plan.isClosed = true;
    plan.closedAt = new Date();
    user.isActivePlan = false;

    // ✅ withdraw false for plan/roi side
    user.Iswithdraw = false;

    await user.save();
    return { ok: true, message: "Plan closed (cap reached)", closed: true, via: "earnings" };
  }

  // ✅ daily ROI pct by amount tier
  const dailyROIPct = getDailyROIPctByPlan(principal);
  if (!dailyROIPct) return { ok: false, message: "ROI not configured" };

  const rawDailyProfit = principal * (dailyROIPct / 100);

  // ✅ do not exceed cap remaining (because referral may consume cap)
  const credit = Math.min(rawDailyProfit, remaining);

  // update plan
  plan.totalProfit = Number(plan.totalProfit || 0) + credit;
  plan.credits = Array.isArray(plan.credits) ? plan.credits : [];
  plan.credits.push({ date: today, amount: credit, roiPct: dailyROIPct });

  // update user totals
  user.totalEarnings = Number(user.totalEarnings || 0) + credit;
  user.earnings = user.earnings || {};
  user.earnings.roi = Number(user.earnings.roi || 0) + credit;

  // ✅ close if cap reached after today credit (again based on totalEarnings delta)
  const newEarnedSinceStart = Number(user.totalEarnings || 0) - startTotal;
  if (newEarnedSinceStart >= capProfit) {
    plan.isClosed = true;
    plan.closedAt = new Date();
    user.isActivePlan = false;
    user.Iswithdraw = false;
  }

  await user.save();
await checkAndClosePlanCap(user._id);

  return {
    ok: true,
    credited: +credit.toFixed(6),
    dailyROIPct,
    multiplier,
    earnedSinceStart: +newEarnedSinceStart.toFixed(6),
    capProfit: +capProfit.toFixed(6),
    remainingAfter: +Math.max(0, capProfit - newEarnedSinceStart).toFixed(6),
    closed: plan.isClosed,
  };
};
