import axios from "axios";
import https from "https";

const PAYRAM_BASE_URL = (process.env.PAYRAM_BASE_URL || "https://pay.1cglobal.ch:8443").replace(/\/$/, "");
const PAYRAM_API_KEY = process.env.PAYRAM_API_KEY;

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

function assertPayramEnv() {
  if (!PAYRAM_API_KEY) throw new Error("PAYRAM_API_KEY missing in env");
  if (!PAYRAM_BASE_URL) throw new Error("PAYRAM_BASE_URL missing in env");
}

async function payramRequest(method, path, body) {
  assertPayramEnv();

  try {
    const res = await axios({
      method,
      url: `${PAYRAM_BASE_URL}${path}`,
      data: body,
      headers: {
        "Content-Type": "application/json",
        "API-Key": PAYRAM_API_KEY,
      },
      timeout: 20000,
      httpsAgent,
    });

    return res.data;
  } catch (err) {
    const status = err?.response?.status;
    const data = err?.response?.data;

    //console.error("❌ PayRam Request Failed:", {
    //   url: `${PAYRAM_BASE_URL}${path}`,
    //   method,
    //   body,
    //   status,
    //   data,
    // });

   throw new Error(
  data?.error?.message ||
  data?.message ||
  (typeof data === "string" ? data : JSON.stringify(data)) ||
  `Payram error ${status || ""}: ${err.message}`
);

  }
}

// ✅ Docs: customerEmail + customerID + amountInUSD required
export function createPayramPayment({ customerEmail, customerID, amountUSD }) {
  return payramRequest("POST", `/api/v1/payment`, {
    customerEmail,
    customerID,
    amountInUSD: Number(amountUSD),
  });
}

// ✅ Docs: body must be { blockchain_code: "TRX" }
export function assignDepositAddress({ referenceId, blockchainCode = "ETH", currencyCode = "USDT" }) {
  return payramRequest(
    "POST",
    `/api/v1/deposit-address/reference/${encodeURIComponent(referenceId)}`,
    {
      blockchain_code: blockchainCode,  // ✅ snake_case only
      currency_code: currencyCode,      // ✅ snake_case only
    }
  );
}



export function getPayramPaymentStatus(referenceId) {
  return payramRequest("GET", `/api/v1/payment/reference/${encodeURIComponent(referenceId)}`);
}
export function fetchPayramTickers() {
  return payramRequest("GET", "/api/v1/ticker");
}
