import axios from "axios";
import https from "https";

const PAYRAM_BASE_URL = (process.env.PAYRAM_BASE_URL || "https://pay.1cglobal.ch:8443").replace(/\/$/, "");
const PAYRAM_API_KEY = process.env.PAYRAM_API_KEY;

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

function assertEnv() {
  if (!PAYRAM_API_KEY) throw new Error("PAYRAM_API_KEY missing");
  if (!PAYRAM_BASE_URL) throw new Error("PAYRAM_BASE_URL missing");
}

async function payramRequest(method, path, body) {
  assertEnv();
  try {
    const res = await axios({
      method,
      url: `${PAYRAM_BASE_URL}${path}`,
      data: body,
      headers: {
        "API-Key": PAYRAM_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 20000,
      httpsAgent,
    });
    return res.data;
  } catch (err) {
    const status = err?.response?.status;
    const data = err?.response?.data;
    //console.error("❌ PayRam Payout Failed:", { status, data });
    throw new Error(
      data?.error?.message ||
      data?.message ||
      (typeof data === "string" ? data : JSON.stringify(data)) ||
      `Payram error ${status || ""}: ${err.message}`
    );
  }
}

// ✅ Create payout request (Merchant)
export async function createPayramWithdrawal(payload) {
  // payload must match docs exactly
  return payramRequest("POST", "/api/v1/withdrawal/merchant", payload);
}
