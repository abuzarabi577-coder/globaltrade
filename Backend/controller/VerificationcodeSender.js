// controller/VerificationcodeSender.js
import User from "../DBModels/UserProfile.js";
import { sendEmail } from "../utils/sendEmail.js";

const generateVerificationCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const VerifyCodeSender = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId required!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    if (user.isVerified) {
      return res.status(409).json({ success: false, message: "Email already verified!" });
    }

    const verificationCode = generateVerificationCode();

    // ✅ store expiry as Date (schema type Date hai)
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 2 * 60 * 1000);
    await user.save();

    const subject = "Your Verification Code • Expires in 2 Minutes";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f59e0b; font-size: 24px;">Verification Code</h2>
        <p>Hello <strong>${user.name || "User"}</strong>,</p>
        <p style="font-size: 18px;">Your verification code is:</p>
        <div style="background: #fef3c7; padding: 20px; border-radius: 12px; border-left: 5px solid #f59e0b; margin: 20px 0; text-align: center;">
          <h1 style="font-size: 36px; color: #92400e; margin: 0; font-weight: 900; letter-spacing: 4px;">${verificationCode}</h1>
        </div>
        <p><strong>This code expires in 2 minutes.</strong></p>
        <hr style="border: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 14px; color: #6b7280;">Need help? Contact support@1cglobal.ch</p>
        <p>Best regards,<br/>1C Trader Team</p>
      </div>
    `;

    const emailRes = await sendEmail({
      to: user.email,
      subject,
      html,
    });

    if (!emailRes.success) {
      return res.status(500).json({
        success: false,
        message: emailRes.error || "Failed to send verification code!",
      });
    }

    return res.json({
      success: true,
      message: `Code sent to ${user.email}! Expires in 2 minutes.`,
      userId: user._id,
    });
  } catch (error) {
    //console.error("VerifyCodeSender error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to send verification code!",
    });
  }
};

export default VerifyCodeSender;
