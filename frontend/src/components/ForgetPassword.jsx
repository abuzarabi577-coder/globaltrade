import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaArrowLeft, FaCoins } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ForgetPassword = () => {
  const navigate = useNavigate();
    const { email,setEmail,requestForgotOtp} = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = email.trim().toLowerCase();
    if (!value || !value.includes("@")) {
      alert("Please enter a valid email");
      return;
    }
requestForgotOtp(value)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#020617]/95 border border-gray-800/60 rounded-3xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-4">
            <FaCoins className="text-gray-900 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white">Forgot Password</h1>
          <p className="text-gray-400 text-sm mt-2">
            Enter your email to recover account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1 flex items-center gap-2">
              <FaEnvelope />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domain.com"
              className="w-full h-12 px-4 bg-white/5 border border-white/20 rounded-xl text-white focus:border-yellow-400 outline-none"
              required
            />
          </div>

          

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-black rounded-2xl shadow-lg"
          >
            Save Email
          </motion.button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition"
          >
            <FaArrowLeft />
            Back to Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgetPassword;
