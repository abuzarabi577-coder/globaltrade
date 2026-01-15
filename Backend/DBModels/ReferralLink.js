import mongoose from "mongoose";

const referralLinkSchema = new mongoose.Schema(
  {
    referrerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // upline
    referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // downline
    level: { type: Number, required: true, min: 1, max: 10 }, // 1..10
    createdAtDay: { type: String, required: true }, // YYYY-MM-DD (UTC)
  },
  { timestamps: true }
);

// ✅ prevent duplicates
referralLinkSchema.index(
  { referrerId: 1, referredUserId: 1, level: 1 },
  { unique: true }
);

const ReferralLink = mongoose.model("ReferralLink", referralLinkSchema);
export default ReferralLink;
