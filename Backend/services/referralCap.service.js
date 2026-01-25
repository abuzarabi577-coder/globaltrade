// services/referralCap.service.js

export const NO_PLAN_REFERRAL_CAP = 400;

export function applyNoPlanReferralCap({ user, commission }) {
  const hasActivePlan =user?.isActivePlan === true || (Array.isArray(user?.activePlan) && user.activePlan.length > 0);

  // ✅ plan active hai to cap nahi
  if (hasActivePlan) return { allowed: commission, reason: "plan_active" };

  const current = Number(user?.totalEarnings || 0);
  const remaining = NO_PLAN_REFERRAL_CAP - current;

  if (remaining <= 0) return { allowed: 0, reason: "cap_reached" };

  // ✅ partial credit allowed
  return { allowed: Math.min(Number(commission || 0), remaining), reason: "capped" };
}