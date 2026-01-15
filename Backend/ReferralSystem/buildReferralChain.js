// ReferralSystem/buildReferralChain.js
import ReferralLink from "../DBModels/ReferralLink.js";
import { getDayKeyUTC } from "../utils/dayKey.js";
import User from "../DBModels/UserProfile.js";

export const buildReferralChain = async ({ newUserId, ReferralCode }) => {
  const code = String(ReferralCode || "").trim();
  if (!code) return { ok: true, skipped: true };

  const direct = await User.findOne({ referralCode: code }).select("_id referredBy referralCode");
  if (!direct) return { ok: false, message: "Invalid referral code" };

  if (String(direct._id) === String(newUserId)) {
    return { ok: false, message: "Self referral not allowed" };
  }

  const todayKey = getDayKeyUTC();

  // set direct upline
  await User.updateOne(
    { _id: newUserId },
    { $set: { referredBy: direct._id, referredByCode: code } }
  );

  // build upline links
  let currentUplineId = direct._id;

  for (let level = 1; level <= 10; level++) {
    if (!currentUplineId) break;

    await ReferralLink.updateOne(
      { referrerId: currentUplineId, referredUserId: newUserId, level },
      {
        $setOnInsert: {
          referrerId: currentUplineId,
          referredUserId: newUserId,
          level,
          createdAtDay: todayKey,
        },
      },
      { upsert: true }
    );

    const upline = await User.findById(currentUplineId).select("referredBy");
    if (!upline?.referredBy) break;

    currentUplineId = upline.referredBy;
  }

  return { ok: true, directReferrerId: direct._id };
};
