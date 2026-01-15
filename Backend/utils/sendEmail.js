// utils/sendEmail.js
import nodemailer from "nodemailer";

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true", // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },// ✅ FIX: self-signed certificate (DEV)
    tls: {
      rejectUnauthorized: process.env.SMTP_ALLOW_SELF_SIGNED !== "true",
    },
  });

  return cachedTransporter;
}

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = getTransporter();

    // ✅ Optional: verify only in dev
    if (process.env.NODE_ENV !== "production") {
      await transporter.verify();
    }

    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "1C Global Trader Company"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    //console.log("📧 Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    //console.error("❌ Email send failed:", error);
    return { success: false, error: error?.message || "Email failed" };
  }
};
