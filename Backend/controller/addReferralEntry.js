// controller/referral/addReferralEntry.js
import User from '../DBModels/UserProfile.js';

export const addReferralEntry = async ({ referralCode, newUserId }) => {
  if (!referralCode) return { ok: true, skipped: true };

  // find referrer by referralCode
  const referrer = await User.findOne({ referralCode: String(referralCode).trim() });
  if (!referrer) return { ok: false, message: "Invalid referral code" };

  // prevent self referral (just in case)
  if (String(referrer._id) === String(newUserId)) {
    return { ok: false, message: "Self referral not allowed" };
  }

  // prevent duplicate same user in referral list
  const already = (referrer.Referal || []).some(
    (x) => String(x.userId) === String(newUserId)
  );
  if (already) return { ok: true, skipped: true };

  const userNumber = (referrer.Referal?.length || 0) + 1;

  referrer.Referal.push({
    userNumber,
    userId: newUserId,
    joinedAt: new Date(),
  });

  await referrer.save();
  return { ok: true };
};
