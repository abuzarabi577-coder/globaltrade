import mongoose from "mongoose";

const investmentInvoiceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: {
      name: { type: String, required: true },
      amountUSD: { type: Number, required: true },
      dailyROIPct: { type: Number, default: 0 },
    },

    // PayRam
    provider: { type: String, default: "PAYRAM" },
    referenceId: { type: String, required: true, unique: true, index: true },
    blockchainCurrency: { type: String, default: "ETH" }, 
        
    asset: { type: String, default: "USDT" },
    depositAddress: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "confirmed", "failed", "expired"],
      default: "pending",
      index: true,
    },

    // optional: for audits
    payramSnapshot: { type: Object, default: {} },
    confirmedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("InvestmentInvoice", investmentInvoiceSchema);
