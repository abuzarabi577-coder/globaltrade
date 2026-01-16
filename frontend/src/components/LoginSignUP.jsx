import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaCoins,
  FaEye,
  FaEyeSlash,
  FaUsers,
  FaWallet,
  FaNetworkWired,
  FaFileContract,
  FaTimes,
} from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import Alert from "./Alert";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const {
    formData,
    mode,
    setMode,
    setFormData,
    handleSubmitRegister,
    alert,
    showAlert,
    RegisterUser,
    handleSubmitLogin,
  } = useAuth();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    if (mode !== "signup") return;

    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) {
      setFormData((prev) => ({
        ...prev,
        ReferralCode: refFromUrl.trim(),
      }));
    }
  }, [mode, searchParams, setFormData]);

  // ✅ Close modal on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setTermsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "signup") {
      if (formData.password !== formData.confirmPassword) {
        showAlert("error", "Passwords do not match!");
        return;
      }
      if (formData.password.length < 8) {
        showAlert("error", "Password must be at least 8 characters!");
        return;
      }
      if (!formData.termsAccepted) {
        showAlert("error", "Please accept terms & conditions!");
        return;
      }
      handleSubmitRegister(e);
      return;
    }

    // login
    if (!formData.email || !formData.password) {
      showAlert("error", "Please enter email and password!");
      return;
    }
    if (formData.password.length < 8) {
      showAlert("error", "Password must be at least 8 characters!");
      return;
    }
    handleSubmitLogin(e);
  };

  const togglePassword = (passwordType) => {
    if (passwordType === "password") {
      setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
    } else {
      setFormData((prev) => ({
        ...prev,
        showConfirmPassword: !prev.showConfirmPassword,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(75,85,99,0.4)_1px,transparent_1px),linear-gradient(rgba(75,85,99,0.4)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Alert */}
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => showAlert({ isOpen: false, type: "", message: "" })}
      />

      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: FORM */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#020617]/95 backdrop-blur-3xl border border-gray-800/50 rounded-3xl p-8 w-full max-w-lg shadow-2xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                <FaCoins className="w-8 h-8 text-gray-900" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2">
                Invest & Earn
              </h1>
              <p className="text-gray-400 text-sm">
                Access daily returns platform
              </p>
            </div>

            {/* Toggle */}
            <div className="flex bg-white/5 rounded-2xl p-1 mb-6 border border-white/10">
              <motion.button
                type="button"
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm ${
                  mode === "login"
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 shadow-lg shadow-yellow-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setMode("login")}
                whileHover={{ scale: 1.02 }}
              >
                Login
              </motion.button>
              <motion.button
                type="button"
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm ${
                  mode === "signup"
                    ? "bg-white/20 text-white shadow-lg border border-white/30"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setMode("signup")}
                whileHover={{ scale: 1.02 }}
              >
                Sign Up
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Login Fields */}
              {mode === "login" && (
                <>
                  <div>
                    <label className="text-xs font-medium text-gray-300 mb-1 flex items-center gap-2">
                      <FaEnvelope className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 h-12 outline-none"
                      placeholder="Enter email or phone"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-300 mb-1 flex items-center gap-2">
                      <FaLock className="w-4 h-4" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={formData.showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 pr-10 text-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 h-12 outline-none"
                        placeholder="Enter password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("password")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {formData.showPassword ? (
                          <FaEyeSlash className="w-4 h-4" />
                        ) : (
                          <FaEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <button
                        type="button"
                        onClick={() => navigate("/forget-password")}
                        className="text-xs font-semibold text-yellow-400 hover:text-yellow-300 transition"
                      >
                        Forgot Password?
                      </button>

                      <span className="text-xs text-gray-500">
                        Reset via email
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Signup Fields */}
              {mode === "signup" && (
                <>
                  <div>
                    <label className="text-xs font-medium text-gray-300 mb-1 flex items-center gap-2">
                      <FaUser className="w-4 h-4" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 h-12 outline-none"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-300 mb-1 flex items-center gap-2">
                      <FaEnvelope className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 h-12 outline-none"
                      placeholder="email@domain.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-300 mb-1 flex items-center gap-2">
                      <FaWallet className="w-4 h-4" />
                      Wallet Address (Should be real wallet Address)
                    </label>
                    <input
                      type="text"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 h-12 outline-none"
                      placeholder="0x742d35..."
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-300 mb-1 flex items-center gap-2">
                      <FaNetworkWired className="w-4 h-4" />
                      Network
                    </label>
                    <select
                      name="network"
                      value={formData.network}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 text-sm bg-[#020617]/95 border border-white/20 rounded-xl text-white focus:border-yellow-400 h-12 outline-none"
                    >
                      <option className="bg-[#020617] text-white">ERC20</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-300 mb-1 flex items-center gap-2">
                      <FaLock className="w-4 h-4" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={formData.showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 pr-10 text-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 h-12 outline-none"
                        placeholder="Minimum 8 characters"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("password")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {formData.showPassword ? (
                          <FaEyeSlash className="w-4 h-4" />
                        ) : (
                          <FaEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-300 mb-1 flex items-center gap-2">
                      <FaLock className="w-4 h-4" />
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={formData.showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 pr-10 text-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 h-12 outline-none"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("confirm")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {formData.showConfirmPassword ? (
                          <FaEyeSlash className="w-4 h-4" />
                        ) : (
                          <FaEye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-300 mb-1 flex items-center gap-2">
                      <FaUsers className="w-4 h-4" />
                      Referral Code (Optional)
                    </label>

                    <input
                      type="text"
                      name="ReferralCode"
                      value={formData.ReferralCode || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 h-12 outline-none"
                      placeholder="Enter referral code (optional)"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      If you don’t have a referral code, leave this empty and
                      create your account normally.
                    </p>
                  </div>

                  {/* ✅ Terms checkbox + clickable modal */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleCheckboxChange}
                      className="mt-1 w-4 h-4 rounded text-yellow-500 bg-white/5 border-white/20 focus:ring-yellow-400"
                      required
                    />
                    <div className="text-xs text-gray-400 leading-tight">
                      I agree to{" "}
                      <button
                        type="button"
                        onClick={() => setTermsOpen(true)}
                        className="text-yellow-400 font-semibold hover:text-yellow-300 underline underline-offset-4"
                      >
                        Terms & Conditions
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        onClick={() => setTermsOpen(true)}
                        className="text-yellow-400 font-semibold hover:text-yellow-300 underline underline-offset-4"
                      >
                        Privacy Policy
                      </button>
                    </div>
                  </div>
                </>
              )}

              <motion.button
                type="submit"
                className={`w-full px-6 font-bold uppercase rounded-2xl border border-yellow-500 shadow-lg text-gray-900 transition-all ${
                  mode === "login"
                    ? "py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:shadow-yellow-500/50 h-14"
                    : "py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:shadow-yellow-400/50 h-12"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                {mode === "signup" ? "Create Account" : "Sign In"}
              </motion.button>
            </form>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <div className="relative bg-gradient-to-br from-yellow-500/5 to-gray-900/50 border border-yellow-500/20 rounded-3xl p-8 shadow-2xl backdrop-blur-xl max-h-[500px] overflow-hidden">
              <img
                src={mode === "login" ? "image/loginimage.avif" : "image/signupimage.jpg"}
                alt="Dashboard"
                className="w-full h-[450px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute top-6 left-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
                {mode === "login" ? "SECURE LOGIN" : "START EARNING"}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ✅ TERMS MODAL */}
      <AnimatePresence>
        {termsOpen && (
          <>
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close terms backdrop"
              onClick={() => setTermsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-10"
              onClick={() => setTermsOpen(false)}
            >
              <div
                className="w-full max-w-2xl bg-[#050a14]/95 border border-gray-800/60 rounded-3xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="px-5 sm:px-6 py-4 border-b border-gray-800/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                      <FaFileContract className="text-yellow-300" />
                    </div>
                    <div>
                      <div className="text-white font-black">Terms & Conditions</div>
                      <div className="text-xs text-gray-500">1C Trader Platform</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTermsOpen(false)}
                    className="w-11 h-11 rounded-2xl bg-black/40 border border-gray-800/70 flex items-center justify-center text-gray-200 hover:border-yellow-500/40 hover:text-yellow-300 transition"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4 text-sm text-gray-300 leading-relaxed">
                  <p className="text-gray-400">
                    By creating an account and using 1C Trader (“Platform”), you agree to the following terms.
                    Please read carefully.
                  </p>

                  <div className="space-y-2">
                    <h3 className="text-white font-black">1) Account & Verification</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-300">
                      <li>You must provide accurate information (name, email, and wallet address).</li>
                      <li>You are responsible for keeping your login credentials secure.</li>
                      <li>We may suspend accounts showing suspicious activity or misuse.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-white font-black">2) Earnings & Profit Credits</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>ROI/earnings shown are estimates and depend on plan rules and task completion.</li>
                      <li>Daily tasks may be required to unlock profit credit for that day.</li>
                      <li>Referral commissions are based on network levels and defined percentages.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-white font-black">3) Deposits, Withdrawals & Wallets</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>All deposits are made directly by users to the provided wallet address.</li>
                      <li>Users must provide correct TxID when required.</li>
                      <li>Withdrawals are processed per platform rules and may require verification.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-white font-black">4) Prohibited Use</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>No fraud, fake TxIDs, duplicate accounts, or abuse of referral system.</li>
                      <li>No attempts to hack, exploit, or disrupt platform operations.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-white font-black">5) Privacy</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>We store basic account info to provide platform services.</li>
                      <li>We do not sell your personal information.</li>
                      <li>Wallet transactions are public on blockchain networks.</li>
                    </ul>
                  </div>

                
                </div>

                {/* Footer */}
                <div className="px-5 sm:px-6 py-4 border-t border-gray-800/70 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setTermsOpen(false)}
                    className="px-4 h-11 rounded-2xl bg-white/5 border border-gray-800/70 text-gray-200 font-bold hover:bg-white/10 transition"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({ ...p, termsAccepted: true }));
                      setTermsOpen(false);
                    }}
                    className="px-5 h-11 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 border border-yellow-500 text-gray-900 font-black hover:brightness-110 transition"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;
