// DBModels/InvestmentCommission.js
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    investmentId: { type: mongoose.Schema.Types.ObjectId, required: true }, // plan entry _id
    sourceUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uplineUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    level: { type: Number, required: true },
    pct: { type: Number, required: true },
    baseAmount: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

schema.index({ investmentId: 1, uplineUserId: 1, level: 1 }, { unique: true });

export default mongoose.model("InvestmentCommission", schema);
