import express from "express";
import mongoose from "mongoose";
import User from "../DBModels/UserProfile.js";

const router = express.Router();

// TODO: replace with your real admin auth middleware
const requireAdmin = (req, res, next) => {
  // Example:
  // if (!req.user || req.user.role !== "admin") return res.status(403).json({ success:false, message:"Forbidden" });
  next();
};

// GET /api/admin/users?search=
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const q = {};

    if (search) {
      q.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(q)
      .select("name email level totalEarnings isActive Join")
      .sort({ createdAt: -1 })
      .limit(200);

    return res.json({ success: true, users });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/admin/users/:id
router.get("/users/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const user = await User.findById(id)
      .select(
        "name email level totalEarnings earnings walletAddress network referralCode referredBy referredByCode isActive Join activePlan Referal dailyTasksCompleted"
      )
      .lean();

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.json({ success: true, user });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

export default router;
