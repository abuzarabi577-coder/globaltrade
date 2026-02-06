// ✅ Manual Activate by invoiceId (NO SECRET / NO AUTH)
import User from "../DBModels/UserProfile.js";
import InvestmentInvoice from "../DBModels/InvestmentInvoice.js";
import { activatePlanFromInvoice } from "./InvestmentPlanSaveController.js";

export async function manualActivateInvoice(req, res) {
  try {

    const { invoiceId } = req.body;

    if (!invoiceId) {
      return res.status(400).json({ success: false, message: "invoiceId is required" });
    }

    // 1) Invoice load
    const invoice = await InvestmentInvoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    // 2) Must be confirmed (aap chaho to auto-confirm kar sakte ho)
    if (invoice.status !== "confirmed") {
      // ✅ auto confirm (optional)
      invoice.status = "confirmed";
      invoice.confirmedAt = new Date();
      invoice.updatedAt = new Date();
      await invoice.save();
    }

    // 3) Activate plan
    const result = await activatePlanFromInvoice(invoice);

    return res.json({
      success: true,
      message: result?.activated ? "Plan activated" : "Already activated",
      activated: !!result?.activated,
      userId: String(invoice.userId),
      referenceId: invoice.referenceId,
    });
  } catch (e) {
    console.error("❌ manualActivateInvoice:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
}