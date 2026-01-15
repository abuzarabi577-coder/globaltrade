import { fetchPayramTickers } from "../services/payram.service.js";

export async function getPayramTickers(req, res) {
  try {
    const tickers = await fetchPayramTickers();

    // Normalize (different APIs sometimes use different key casing)
    const normalized = (Array.isArray(tickers) ? tickers : tickers?.data || []).map(t => ({
      symbol: t.symbol || t.asset || t.ticker || null,
      blockchainCode: (t.blockchainCode || t.blockchain_code || t.blockchain || "").toUpperCase(),
      network: t.network || t.chain || null,
      raw: t,
    }));

    // Extract unique blockchain codes
    const codes = [...new Set(normalized.map(x => x.blockchainCode).filter(Boolean))];

    return res.json({
      success: true,
      blockchainCodes: codes,
      count: normalized.length,
      tickers: normalized,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}
