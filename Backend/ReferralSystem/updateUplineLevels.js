// ReferralSystem/updateUplineLevels.js
import User from "../DBModels/UserProfile.js";

export const updateUplineLevelsByDepth = async ({ directReferrerId }) => {
  let current = await User.findById(directReferrerId).select("_id referredBy");

  for (let distance = 1; distance <= 10; distance++) {
    if (!current?._id) break;

    await User.updateOne(
      { _id: current._id },
      { $max: { level: distance } }
    );

    if (!current.referredBy) break;
    current = await User.findById(current.referredBy).select("_id referredBy");
  }
};
