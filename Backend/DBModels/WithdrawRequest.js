import mongoose from "mongoose";

const withdrawRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    amount: { type: Number, required: true },

    asset: { type: String, default: "USDT" },
    network: { type: String, default: "ERC20" },     // display
    blockchainCurrency: { type: String, default: "ETH" }, // PayRam code
    toAddress: { type: String, required: true },

    status: {
      type: String,
 enum: [
    "pending",
    "processing",

    // ✅ PayRam statuses (add)
    "pending-approval",
    "completed",

    // your internal
    "approved",
    "paid",

    "rejected",
    "failed",
  ],      default: "pending",
      index: true,
    },

    // admin fields
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    adminNote: { type: String, default: "" },

    // payout trace
    payramWithdrawalId: { type: Number, default: null, index: true },
    payramSnapshot: { type: Object, default: {} },

    // payout result
    payramPayoutId: { type: String, default: "" },
    payramTxHash: { type: String, default: "" },
    payramSnapshot: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("WithdrawRequest", withdrawRequestSchema);
