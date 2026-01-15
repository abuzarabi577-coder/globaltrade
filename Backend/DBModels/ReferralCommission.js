import mongoose from "mongoose";

const referralCommissionSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD UTC
    type: { type: String, enum: ["roi_profit_share"], required: true },

    sourceUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // jiska ROI aya
    uplineUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // jisko share mila

    level: { type: Number, required: true, min: 1, max: 10 },
    pct: { type: Number, required: true }, // 8,5,...
    baseAmount: { type: Number, required: true }, // ROI amount of source
    amount: { type: Number, required: true }, // commission = baseAmount*pct/100
  },
  { timestamps: true }
);

// ✅ block double credit same day for same pair
referralCommissionSchema.index(
  { date: 1, type: 1, sourceUserId: 1, uplineUserId: 1, level: 1 },
  { unique: true }
);

const ReferralCommission = mongoose.model("ReferralCommission", referralCommissionSchema);
export default ReferralCommission;
