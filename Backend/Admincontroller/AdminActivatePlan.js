import mongoose from "mongoose";
import User from "../DBModels/UserProfile.js";

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

/**
 * POST /api/admin/manual-activate-plan
 * body: { userId OR email, planName, amountUSD, dailyROIPct, network?, asset? }
 */
export async function manualActivatePlan(req, res) {
  try {
    const { userId, email, planName, amountUSD, dailyROIPct, network, asset } = req.body;

    if (!userId && !email) {
      return res.status(400).json({ success: false, message: "userId or email is required" });
    }

    const amt = Number(amountUSD);
    const roiPct = Number(dailyROIPct);

    if (!planName || String(planName).trim().length < 2) {
      return res.status(400).json({ success: false, message: "planName is required" });
    }
    if (!Number.isFinite(amt) || amt <= 0) {
      return res.status(400).json({ success: false, message: "amountUSD must be > 0" });
    }
    if (!Number.isFinite(roiPct) || roiPct <= 0) {
      return res.status(400).json({ success: false, message: "dailyROIPct must be > 0" });
    }

    const query = userId
      ? { _id: new mongoose.Types.ObjectId(userId) }
      : { email: String(email).trim().toLowerCase() };

    const user = await User.findOne(query);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // ✅ If already active, you can block or allow new entry (your choice)
    // Here: allow new activation but closes old plan if needed
    // If you want strict block:
    // if (user.isActivePlan) return res.status(400).json({ success:false, message:"User already has an active plan" });

    const dailyRoiAmount = round2((amt * roiPct) / 100);

    // ✅ plan object (same structure you already use)
    const planObj = {
      name: String(planName).trim(),
      amount: amt,
      dailyROIPct: roiPct,
      totalProfit: 0,
      credits: [],
      isClosed: false,
      closedAt: null,

      referenceId: "MANUAL",
      network: network || user.network || "",
      asset: asset || "USDT",
      startTotalEarnings: Number(user.totalEarnings || 0), // ✅ snapshot
    };

    const entry = {
      date: new Date().toISOString().slice(0, 10),
      plan: planObj,
    };

    user.activePlan = Array.isArray(user.activePlan) ? user.activePlan : [];
    user.activePlan.push(entry);

    user.isActivePlan = true;
    user.Iswithdraw = true; // withdraw open after activation (your rule)
    user.startTotalEarnings = Number(user.totalEarnings || 0);
    user.multiplierAtStart = (user.Referal && user.Referal.length > 0) ? 4 : 3;

    await user.save();

    return res.json({
      success: true,
      message: "Plan manually activated",
      userId: String(user._id),
      plan: {
        name: planObj.name,
        amountUSD: amt,
        dailyROIPct: roiPct,
        dailyRoiAmount,
      },
    });
  } catch (e) {
    console.error("❌ manualActivatePlan:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
}