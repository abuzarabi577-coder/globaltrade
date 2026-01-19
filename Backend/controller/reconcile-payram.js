
import InvestmentInvoice from "../DBModels/InvestmentInvoice.js";
import { getPayramPaymentStatus } from "../services/payram.service.js";
import { activatePlanFromInvoice } from "../controller/InvestmentPlanSaveController.js";

const referenceId = process.argv[2];
if (!referenceId) {
  console.log("Usage: node scripts/reconcile-payram.js <referenceId>");
  process.exit(1);
}


const normalizeState = (resp) => {
  const state = String(
    resp?.paymentState ||
    resp?.data?.paymentState ||
    resp?.payment_state ||
    resp?.data?.payment_state ||
    resp?.status ||
    resp?.data?.status ||
    ""
  ).toUpperCase();
  return state;
};

const isPaidState = (state) => ["FILLED", "OVER_FILLED"].includes(state);

(async () => {
  try {
    
    const invoice = await InvestmentInvoice.findOne({ referenceId });
    if (!invoice) {
      console.log("❌ Invoice not found:", referenceId);
      process.exit(1);
    }

    const statusResp = await getPayramPaymentStatus(referenceId);
    const state = normalizeState(statusResp);

    console.log("PayRam state:", state);

    if (!isPaidState(state)) {
      console.log("❌ Not paid yet. State:", state);
      process.exit(0);
    }

    if (invoice.status !== "confirmed") {
      invoice.status = "confirmed";
      invoice.confirmedAt = new Date();
      invoice.payramSnapshot = { ...invoice.payramSnapshot, statusResp };
      await invoice.save();
      console.log("✅ Invoice marked confirmed");
    } else {
      console.log("ℹ️ Invoice already confirmed");
    }

    await activatePlanFromInvoice(invoice);
    console.log("✅ Plan activated from invoice");

    process.exit(0);
  } catch (e) {
    console.error("❌ reconcile error:", e.message);
    process.exit(1);
  }
})();
