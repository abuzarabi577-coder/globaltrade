import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { showAlert, resetForgotPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ show/hide toggles
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8)
      return showAlert("error", "Password must be at least 8 characters");
    if (password !== confirm)
      return showAlert("error", "Passwords do not match");

    setLoading(true);
    const ok = await resetForgotPassword(password);
    setLoading(false);

    if (ok) {
      showAlert("success", "Password updated. Please login.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md sm:max-w-lg bg-[#020617]/95 border border-gray-800/60 rounded-3xl p-5 sm:p-8 shadow-2xl"
      >
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Set New Password
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Create a strong password (min 8 characters).
          </p>
        </div>

        {/* New Password */}
        <div className="mb-3">
          <label className="text-xs font-medium text-gray-300 mb-1 flex items-center gap-2">
            <FaLock className="w-4 h-4" />
            New Password
          </label>

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full h-12 px-4 pr-12 text-sm bg-white/5 border border-white/20 rounded-xl text-white outline-none focus:border-yellow-400"
              autoComplete="new-password"
            />

            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="text-xs font-medium text-gray-300 mb-1 flex items-center gap-2">
            <FaLock className="w-4 h-4" />
            Confirm Password
          </label>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              className="w-full h-12 px-4 pr-12 text-sm bg-white/5 border border-white/20 rounded-xl text-white outline-none focus:border-yellow-400"
              autoComplete="new-password"
            />

            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <p className="text-[11px] text-gray-500 mt-2">
            Tip: Use letters, numbers and symbols for stronger security.
          </p>
        </div>

        <button
          disabled={loading}
          className="w-full h-13 sm:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-black rounded-2xl border border-yellow-500 shadow-lg hover:shadow-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-3 h-12 rounded-2xl border border-gray-800/70 bg-white/5 text-gray-200 font-bold hover:bg-white/10 transition"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}
