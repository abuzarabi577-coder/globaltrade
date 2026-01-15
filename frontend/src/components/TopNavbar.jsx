import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCoins,
  FaUserCircle,
  FaWallet,
  FaHistory,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function TopNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // ✅ 1C TRADER LOGO — Fixed + Stylish broken line
 
const Logo1CTrader = ({ className = "" }) => (
  <svg
    className={`w-[184px] h-auto ${className}`}
    viewBox="0 0 300 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="1C Trader Logo"
  >
    <defs>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="dark" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#000" />
        <stop offset="100%" stopColor="#1f2937" />
      </linearGradient>
    </defs>
{/* 
    <rect
      x="10"
      y="10"
      width="280"
      height="60"
      rx="14"
      fill="url(#dark)"
      stroke="url(#gold)"
      strokeWidth="2"
    /> */}

    <text
      x="50"
      y="44"
      fontSize="34"
      fontWeight="900"
      fill="#fff"
      stroke="#f59e0b"
      strokeWidth="1.2"
    >
      1C
    </text>

    <text
      x="110"
      y="48"
      fontSize="25"
      fontWeight="700"
      fill="url(#gold)"
      letterSpacing="0.4"
    >
      TRADER
    </text>

    <path
      d="M25 55 L45 35 L65 48 L85 28 L105 42"
      stroke="url(#gold)"
      strokeWidth="2.5"
      fill="none"
    />
  </svg>
);


  return (
    <>
      {/* TOP NAVBAR */}
  <motion.nav
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  className="
     top-0 left-0 right-0 h-16
    bg-gradient-to-r from-black/90 via-slate-900/90 to-black/90
    backdrop-blur-xl
    border-b border-yellow-500/20
    z-50
  "
>

        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          {/* LEFT: LOGO + NAV ITEMS */}
          <div className="flex items-center gap-8">
            {/* LOGO */}
        
      
    <div className="flex items-center gap-3">
      <Link to={'/'}>
<Logo1CTrader className="scale-90 opacity-95 hover:opacity-100 transition" />
      </Link>
</div>



         

            {/* NAV LINKS (Desktop) */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                to="/about"
                className="text-gray-300 hover:text-yellow-400 transition"
              >
                About Us
              </Link>
              <Link
                to="/plans"
                className="text-gray-300 hover:text-yellow-400 transition"
              >
                Investment Plans
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-yellow-400 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* RIGHT: USER ICON */}
          {/* <motion.div
            className="w-10 h-10 bg-gray-800/60 rounded-xl flex items-center justify-center border border-gray-700 cursor-pointer hover:border-white/50 transition-all"
            onClick={() => setShowDropdown(!showDropdown)}
            whileHover={{ scale: 1.05 }}
          >
            <FaUserCircle className="w-6 h-6 text-gray-300" />
          </motion.div> */}
        </div>
      </motion.nav>

      {/* USER DROPDOWN */}
      {showDropdown && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-6 bg-black/95 backdrop-blur-xl rounded-2xl p-3 border border-gray-800 shadow-2xl min-w-[190px] z-50"
        >
          {[
            { icon: FaWallet, label: "Withdraw", color: "text-green-400" },
            { icon: FaHistory, label: "Transactions", color: "text-white" },
            { icon: FaCog, label: "Settings", color: "text-white" },
            { icon: FaSignOutAlt, label: "Logout", color: "text-red-400" },
          ].map((item, idx) => (
            <motion.button
              key={idx}
              className="w-full flex items-center px-4 py-3 rounded-xl hover:bg-gray-800/60 transition-all"
              whileHover={{ x: 4 }}
              onClick={() => setShowDropdown(false)}
            >
              <item.icon className={`w-5 h-5 mr-3 ${item.color}`} />
              <span className="text-sm font-medium text-gray-200">
                {item.label}
              </span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </>
  );
}
