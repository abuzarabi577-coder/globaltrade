import WithdrawRequest from "../DBModels/WithdrawRequest.js";

export const getMyWithdrawHistory = async (req, res) => {
  try {
    const userId = req.userId; // from authMiddleware

    const list = await WithdrawRequest.find({ userId })
      .sort({ createdAt: -1 })
      .select("_id amount asset network toAddress status createdAt");

    return res.json({ success: true, list });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
