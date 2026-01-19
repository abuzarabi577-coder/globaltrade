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
  FaHeadset, // Naya icon support ke liye
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
      <text x="50" y="44" fontSize="34" fontWeight="900" fill="#fff" stroke="#f59e0b" strokeWidth="1.2">1C</text>
      <text x="110" y="48" fontSize="25" fontWeight="700" fill="url(#gold)" letterSpacing="0.4">Global</text>
      <path d="M25 55 L45 35 L65 48 L85 28 L105 42" stroke="url(#gold)" strokeWidth="2.5" fill="none" />
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
        className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-black/90 via-slate-900/90 to-black/90 backdrop-blur-xl border-b border-yellow-500/20 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <Logo1CTrader className="scale-90 opacity-95 hover:opacity-100 transition" />
            </Link>

            {/* DESKTOP LINKS - Hidden if logged in */}
            {!isLoggedIn && (
              <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                {navLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`transition ${isActive(l.to) ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"}`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <motion.button
                type="button"
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden md:flex items-center gap-2 px-4 h-11 rounded-2xl bg-yellow-500/10 border border-yellow-500/25 text-yellow-300 font-black text-sm hover:bg-yellow-500/15 transition"
              >
                <FaSignInAlt /> Login
              </motion.button>
            ) : (
              <div className="flex items-center gap-2">
                {/* ✅ LIGHT SUPPORT BUTTON */}
                <motion.button
                  type="button"
                  onClick={() => navigate("/contact")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-yellow-400 hover:border-yellow-500/30 transition-all"
                  title="Support"
                >
                  <FaHeadset className="text-lg" />
                </motion.button>

                {/* LOGOUT BUTTON */}
                <motion.button
                  type="button"
                  onClick={logoutUser}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden md:flex items-center gap-2 px-4 h-11 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-300 font-black text-sm hover:bg-red-500/15 transition"
                >
                  <FaSignOutAlt /> Logout
                </motion.button>
              </div>
            )}

            {/* MOBILE BURGER */}
            <motion.button
              type="button"
              onClick={() => setMobileOpen((p) => !p)}
              whileTap={{ scale: 0.98 }}
              className="md:hidden w-11 h-11 rounded-2xl bg-black/40 border border-gray-800/70 flex items-center justify-center text-gray-200 hover:border-yellow-500/40 hover:text-yellow-300 transition"
            >
              {mobileOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            <motion.aside
              ref={panelRef}
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="fixed top-0 right-0 z-50 md:hidden w-[86%] max-w-sm h-full bg-[#050a14] border-l border-yellow-500/20 shadow-2xl"
            >
              {/* Mobile Header */}
              <div className="h-16 px-4 flex items-center justify-between border-b border-gray-800/70">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center font-black text-yellow-300">1C</div>
                  <div>
                    <div className="text-sm font-black text-white">1C Trader</div>
                    <div className="text-[11px] text-gray-500">Menu</div>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-gray-400"><FaTimes /></button>
              </div>

              <div className="p-4 space-y-4">
                {/* Nav Links - Hidden if logged in */}
                {!isLoggedIn && (
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
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 gap-3">
                  {!isLoggedIn ? (
                    <button
                      onClick={() => navigate("/login")}
                      className="rounded-2xl bg-yellow-500/10 border border-yellow-500/25 text-yellow-300 px-4 py-3 text-sm font-black"
                    >
                      Login
                    </button>
                  ) : (
                    <>
                      {/* Mobile Support Btn */}
                      <button
                        onClick={() => navigate("/contact")}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 text-gray-200 px-4 py-3 text-sm font-black"
                      >
                        <FaHeadset className="text-yellow-400" /> Support Center
                      </button>
                      <button
                        onClick={logoutUser}
                        className="rounded-2xl bg-red-500/10 border border-red-500/25 text-red-300 px-4 py-3 text-sm font-black"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}