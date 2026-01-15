// controller/admin.controller.js (same file where DefaultCreateAdmin/adminLogin etc exist)
import bcrypt from "bcryptjs";
import Admin from "../DBModels/Admin.js";

// ✅ Update admin credentials (CLI or authorized route)
export const updateAdminCredentials = async (req, res) => {
  try {
    const newUsername = String(req.body.username || "")
    const newPassword = String(req.body.password || "");

    if (!newUsername && !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Provide username and/or password",
      });
    }

    if (newUsername && newUsername.length < 3) {
      return res.status(400).json({ success: false, message: "Username too short" });
    }

    if (newPassword && newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    // ✅ pick the admin to update:
    // If you have only one admin, easiest is: find first admin
    const admin = await Admin.findOne({});
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found. Create default admin first." });
    }

    // ✅ Update username if provided (ensure unique)
    if (newUsername && newUsername !== admin.username) {
      const exists = await Admin.findOne({ username: newUsername }).lean();
      if (exists) {
        return res.status(409).json({ success: false, message: "Username already exists" });
      }
      admin.username = newUsername;
    }

    // ✅ Update password if provided
    if (newPassword) {
      admin.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await admin.save();

    return res.json({
      success: true,
      message: "Admin credentials updated successfully",
      admin: { username: admin.username },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
