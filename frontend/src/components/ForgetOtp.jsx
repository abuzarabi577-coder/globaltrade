import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaKey, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

export default function ForgetOtp() {
  const navigate = useNavigate();
  const { alert, showAlert, verifyForgotOtp, authLoading, requestForgotOtp } =
    useAuth();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // resend cooldown
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("forgotEmail") || "";
    setEmail(saved);
  }, []);

  // cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const cleanEmail = useMemo(
    () => String(email || "").trim().toLowerCase(),
    [email]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanOtp = String(otp || "").trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      showAlert("error", "Valid email is required");
      return;
    }

    if (!/^\d{6}$/.test(cleanOtp)) {
      showAlert("error", "OTP must be 6 digits");
      return;
    }

    await verifyForgotOtp(cleanEmail, cleanOtp);
  };

  const handleResend = async () => {
    if (!cleanEmail || !cleanEmail.includes("@")) {
      showAlert("error", "Valid email is required");
      return;
    }
    if (cooldown > 0) return;

    const ok = await requestForgotOtp(cleanEmail);
    if (ok) {
      setCooldown(30); // 30s cooldown
      setOtp(""); // optional: clear OTP input
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => showAlert({ isOpen: false, type: "", message: "" })}
      />

      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-[#020617]/95 backdrop-blur-3xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <button
              type="button"
              onClick={() => navigate("/forget")}
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
            >
              <FaArrowLeft /> Back
            </button>

            <div className="text-xs text-gray-500">1C Trader</div>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <FaKey className="w-7 h-7 text-gray-900" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Verify OTP</h1>
            <p className="text-gray-400 text-sm">
              Enter the 6-digit OTP sent to your email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-medium text-gray-300 mb-1 flex items-center gap-2">
                <FaEnvelope className="w-4 h-4" />
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 h-12 outline-none"
                placeholder="email@domain.com"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                (Email auto-filled from previous step)
              </p>
            </div>

            {/* OTP */}
            <div>
              <label className="text-xs font-medium text-gray-300 mb-1 flex items-center gap-2">
                <FaKey className="w-4 h-4" />
                OTP (6 digits)
              </label>
              <input
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 h-12 outline-none tracking-widest text-center font-black"
                placeholder="••••••"
              />
            </div>

            {/* Resend row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleResend}
                disabled={authLoading || cooldown > 0}
                className="h-11 px-4 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 font-bold hover:bg-yellow-500/15 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
              </button>

             
            </div>

            <motion.button
              type="submit"
              disabled={authLoading}
              whileHover={{ scale: 1.02 }}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-black uppercase border border-yellow-500 shadow-lg hover:shadow-yellow-500/40 disabled:opacity-50"
            >
              {authLoading ? "Verifying..." : "Verify OTP"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
