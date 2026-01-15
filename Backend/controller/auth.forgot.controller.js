import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js"; // apna nodemailer util (neeche diya)
import User from "../DBModels/UserProfile.js";
import bcrypt from "bcryptjs";

export const requestResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      // security: email exist na bhi ho to same response
      return res.json({ success: true, message: "If this email exists, OTP has been sent." });
    }

    // ✅ 6 digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // ✅ store in DB (hash me store)
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetOtp = otpHash;
    user.resetOtpExpires = new Date(Date.now() + 2 * 60 * 1000); // 10 min
    await user.save();

    // ✅ send email
    await sendEmail({
      to: user.email,
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; color:#111;">
          <h2 style="margin:0 0 10px;">Password Reset OTP</h2>
          <p style="margin:0 0 12px;">Use this OTP to reset your password:</p>
          <div style="font-size:28px;font-weight:800;letter-spacing:3px;padding:12px 16px;background:#f59e0b;color:#111;display:inline-block;border-radius:10px;">
            ${otp}
          </div>
          <p style="margin:12px 0 0;color:#555;">This OTP will expire in 2 minutes.</p>
        </div>
      `,
    });

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    //console.error("requestResetOtp error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanOtp = String(otp || "").trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }
    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({ success: false, message: "OTP must be 6 digits" });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user || !user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date(user.resetOtpExpires).getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const otpHash = crypto.createHash("sha256").update(cleanOtp).digest("hex");
    if (otpHash !== user.resetOtp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // ✅ create reset token (client ko bhejna)
    const rawToken = crypto.randomBytes(24).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetToken = tokenHash;
    user.resetTokenExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 min

    // optional: OTP fields clear
    user.resetOtp = null;
    user.resetOtpExpires = null;

    await user.save();

    return res.json({
      success: true,
      message: "OTP verified. You can reset your password now.",
      resetToken: rawToken, // ✅ raw token front ko
    });
  } catch (err) {
    //console.error("verifyResetOtp error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }}

  
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;

    const cleanEmail = String(email || "").trim().toLowerCase();
    const pass = String(newPassword || "");
    const token = String(resetToken || "").trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }
    if (!token) {
      return res.status(400).json({ success: false, message: "Reset token missing" });
    }
    if (!pass || pass.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user || !user.resetToken || !user.resetTokenExpires) {
      return res.status(400).json({ success: false, message: "Reset session expired. Request OTP again." });
    }

    if (new Date(user.resetTokenExpires).getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: "Reset session expired. Request OTP again." });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    if (tokenHash !== user.resetToken) {
      return res.status(400).json({ success: false, message: "Invalid reset token" });
    }

    const hashed = await bcrypt.hash(pass, 10);
    user.password = hashed;

    // ✅ clear tokens
    user.resetToken = null;
    user.resetTokenExpires = null;

    await user.save();

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    //console.error("resetPassword error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};