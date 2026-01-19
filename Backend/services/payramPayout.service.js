import axios from "axios";
import https from "https";

// Inko function ke bahar rakhein aur default value lazmi den
const BASE = (process.env.PAYRAM_BASE_URL || "https://pay.1cglobal.ch:8443").replace(/\/$/, "");
const KEY = process.env.PAYRAM_API_KEY;

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

async function payramRequest(method, path, body) {
  try {
    // ⚠️ Check karein ke KEY mojood hai ya nahi
    if (!KEY) throw new Error("PayRam API Key is missing in .env");

    const res = await axios({
      method,
      url: `${BASE}${path}`, // Cleaned URL use karein
      data: body,
      headers: {
        "API-Key": KEY,
        "Content-Type": "application/json",
      },
      timeout: 20000,
      httpsAgent,
    });
    return res.data;
  } catch (err) {
    // Agar server (PayRam) error deta hai toh uska message extract karein
    const errorMsg = err.response?.data?.message || err.response?.data?.error?.message || err.message;
    console.log("❌ PayRam Error Detail:", err.response?.data || err.message);
    throw new Error(errorMsg);
  }
}

// ✅ 1. Create Payout
export async function createPayramWithdrawal(payload) {
  return payramRequest("POST", "/api/v1/withdrawal/merchant", payload);
}

// ✅ 2. Get Status (Jo ID aapne puchi thi)
// PayRam ki numeric ID yahan pass hogi
export async function getPayramWithdrawalStatus(payramId) {
  return payramRequest("GET", `/api/v1/withdrawal/${payramId}/merchant`);
}