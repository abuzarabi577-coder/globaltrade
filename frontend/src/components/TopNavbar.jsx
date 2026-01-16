import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaWallet,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaArrowRight,
  FaSignInAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function TopNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef(null);

  const { isLoggedIn, logoutUser } = useAuth();

  // ✅ close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  // ✅ close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setShowDropdown(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ✅ 1C TRADER LOGO
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
      </defs>

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

  const navLinks = [
    { to: "/about", label: "About Us" },
    { to: "/plans", label: "Investment Plans" },
    { to: "/contact", label: "Contact Us" },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <>
      {/* TOP NAVBAR */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="
          fixed top-0 left-0 right-0 h-16
          bg-gradient-to-r from-black/90 via-slate-900/90 to-black/90
          backdrop-blur-xl
          border-b border-yellow-500/20
          z-50
        "
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <Logo1CTrader className="scale-90 opacity-95 hover:opacity-100 transition" />
            </Link>

            {/* DESKTOP LINKS */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`transition ${
                    isActive(l.to)
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            {/* ✅ DESKTOP LOGIN BUTTON */}
            {!isLoggedIn ? (
              <motion.button
                type="button"
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="
                  hidden md:flex
                  items-center gap-2
                  px-4 h-11 rounded-2xl
                  bg-yellow-500/10 border border-yellow-500/25
                  text-yellow-300 font-black text-sm
                  hover:bg-yellow-500/15 transition
                "
              >
                <FaSignInAlt />
                Login
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={logoutUser}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="
                  hidden md:flex
                  items-center gap-2
                  px-4 h-11 rounded-2xl
                  bg-red-500/10 border border-red-500/25
                  text-red-300 font-black text-sm
                  hover:bg-red-500/15 transition
                "
              >
                <FaSignOutAlt />
                Logout
              </motion.button>
            )}

            {/* ✅ MOBILE BURGER */}
            <motion.button
              type="button"
              onClick={() => setMobileOpen((p) => !p)}
              whileTap={{ scale: 0.98 }}
              className="
                md:hidden
                w-11 h-11 rounded-2xl
                bg-black/40 border border-gray-800/70
                flex items-center justify-center
                text-gray-200
                hover:border-yellow-500/40 hover:text-yellow-300
                transition
              "
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <FaTimes className="w-5 h-5" />
              ) : (
                <FaBars className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close menu backdrop"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Panel */}
            <motion.aside
              ref={panelRef}
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="
                fixed top-0 right-0 z-50 md:hidden
                w-[86%] max-w-sm h-full
                bg-gradient-to-b from-[#050a14] via-black to-[#050a14]
                border-l border-yellow-500/20
                shadow-2xl
              "
            >
              {/* Header */}
              <div className="h-16 px-4 flex items-center justify-between border-b border-gray-800/70">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                    <span className="text-yellow-300 font-black">1C</span>
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">1C Trader</div>
                    <div className="text-[11px] text-gray-500">Menu</div>
                  </div>
                </div>

                <motion.button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  whileTap={{ scale: 0.98 }}
                  className="w-11 h-11 rounded-2xl bg-black/40 border border-gray-800/70 flex items-center justify-center text-gray-200 hover:border-yellow-500/40 hover:text-yellow-300 transition"
                >
                  <FaTimes />
                </motion.button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                {/* Primary Links */}
                <div className="bg-black/30 border border-gray-800/60 rounded-3xl p-2">
                  {navLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl text-gray-200 hover:text-yellow-300 hover:bg-white/5 transition"
                    >
                      <span className="text-sm font-bold">{l.label}</span>
                      <FaArrowRight className="text-yellow-400/70" />
                    </Link>
                  ))}
                </div>

                {/* ✅ Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  {!isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="rounded-2xl bg-yellow-500/10 border border-yellow-500/25 text-yellow-300 px-4 py-3 text-sm font-black hover:bg-yellow-500/15 transition"
                    >
                      Login
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={logoutUser}
                      className="rounded-2xl bg-red-500/10 border border-red-500/25 text-red-300 px-4 py-3 text-sm font-black hover:bg-red-500/15 transition"
                    >
                      Logout
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate("/plans")}
                    className="rounded-2xl bg-white/5 border border-gray-800/70 text-gray-200 px-4 py-3 text-sm font-black hover:bg-white/10 transition"
                  >
                    View Plans
                  </button>
                </div>

                {/* Support */}
                <div className="rounded-3xl bg-black/30 border border-gray-800/60 p-4">
                  <div className="text-xs uppercase tracking-wider text-gray-500">Support</div>
                  <div className="text-sm text-gray-200 font-bold mt-1">support@1cglobal.ch</div>
                  <div className="text-xs text-gray-500 mt-1">Response within 24 hours</div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* USER DROPDOWN (optional) */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
                type="button"
              >
                <item.icon className={`w-5 h-5 mr-3 ${item.color}`} />
                <span className="text-sm font-medium text-gray-200">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
