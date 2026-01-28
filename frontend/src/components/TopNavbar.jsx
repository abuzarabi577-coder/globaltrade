import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaArrowRight,
  FaSignInAlt,
  FaHeadset,
  FaBullhorn,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import AnnouncementPopupModal from "./AnnouncementPopupModal";
import { useAppContext } from "../context/AppContext";

const SEEN_KEY = "seen_announcement";
const SEEN_TTL_MS = 10 * 60 * 1000; // ✅ 10 minutes

const getSeen = () => {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj?.id || !obj?.expiresAt) return null;

    // ✅ expired
    if (Date.now() > Number(obj.expiresAt)) {
      localStorage.removeItem(SEEN_KEY);
      return null;
    }
    return obj;
  } catch {
    localStorage.removeItem(SEEN_KEY);
    return null;
  }
};

const setSeen = (id) => {
  try {
    localStorage.setItem(
      SEEN_KEY,
      JSON.stringify({ id: String(id), expiresAt: Date.now() + SEEN_TTL_MS })
    );
  } catch {}
};

export default function TopNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Separate states (IMPORTANT)
  const [announcePopupOpen, setAnnouncePopupOpen] = useState(false);
  const [announceSidebarOpen, setAnnounceSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef(null);

  const { isLoggedIn, logoutUser } = useAuth();
  const { publicAnnouncements, publicAnnouncementsLoading, fetchPublicAnnouncements } = useAppContext();

  // ✅ close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  // ✅ close on ESC (close all)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setShowDropdown(false);
        setAnnouncePopupOpen(false);
        setAnnounceSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ✅ Auto popup on visit (ONLY popup)
  useEffect(() => {
    const run = async () => {
      const list = await fetchPublicAnnouncements?.();
      const latestId = Array.isArray(list) && list[0]?._id ? String(list[0]._id) : "";
      if (!latestId) return;

      const seen = getSeen();
      // ✅ show popup only if not seen OR different id
      if (!seen || seen.id !== latestId) {
        setAnnouncePopupOpen(true);
      }
    };
    run();
  }, [fetchPublicAnnouncements]);

  // ✅ Close popup -> set seen for 10 mins
  const closeAnnouncementPopup = () => {
    const latestId =
      Array.isArray(publicAnnouncements) && publicAnnouncements[0]?._id
        ? String(publicAnnouncements[0]._id)
        : "";
    if (latestId) setSeen(latestId);
    setAnnouncePopupOpen(false);
  };

  // ✅ Open sidebar (manual)
  const openAnnouncementSidebar = async () => {
    // popup band, sidebar open
    setAnnouncePopupOpen(false);
    setAnnounceSidebarOpen(true);
    await fetchPublicAnnouncements?.();
  };

  const closeAnnouncementSidebar = () => setAnnounceSidebarOpen(false);

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
      <text x="50" y="44" fontSize="34" fontWeight="900" fill="#fff" stroke="#f59e0b" strokeWidth="1.2">
        1C
      </text>
      <text x="110" y="48" fontSize="25" fontWeight="700" fill="url(#gold)" letterSpacing="0.4">
        Global
      </text>
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
        className="top-0 left-0 right-0 h-16 bg-gradient-to-r from-black/90 via-slate-900/90 to-black/90 backdrop-blur-xl border-b border-yellow-500/20 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <Logo1CTrader className="scale-90 opacity-95 hover:opacity-100 transition" />
            </Link>

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
                {/* ✅ Announcements Sidebar Button */}
                <motion.button
                  type="button"
                  onClick={openAnnouncementSidebar}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10
                             text-gray-400 hover:text-yellow-400 hover:border-yellow-500/30 transition-all"
                  title="Announcements"
                >
                  <FaBullhorn className="text-lg" />
                </motion.button>

                {/* Support */}
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

                {/* Logout */}
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

      {/* ✅ Announcements SIDEBAR (ONLY sidebar state) */}
      <AnimatePresence>
        {announceSidebarOpen && (
          <>
            <motion.button
              type="button"
              onClick={closeAnnouncementSidebar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="fixed top-0 right-0 z-[1000] w-[92%] max-w-md h-full bg-[#050a14]
                         border-l border-yellow-500/20 shadow-2xl"
            >
              <div className="h-16 px-4 flex items-center justify-between border-b border-gray-800/70">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                    <FaBullhorn className="text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">Announcements</div>
                    <div className="text-[11px] text-gray-500">Latest updates</div>
                  </div>
                </div>

                <button
                  onClick={closeAnnouncementSidebar}
                  className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 text-gray-300
                             hover:text-yellow-300 hover:border-yellow-500/30 transition flex items-center justify-center"
                  title="Close"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-4 h-[calc(100%-64px)] overflow-y-auto space-y-3">
                {publicAnnouncementsLoading ? (
                  <div className="text-gray-400">Loading...</div>
                ) : publicAnnouncements?.length ? (
                  publicAnnouncements.map((a) => (
                    <div key={a._id} className="rounded-3xl bg-black/30 border border-yellow-500/15 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-black text-white">{a.title}</h3>
                        <span className="text-[10px] text-gray-500 whitespace-nowrap">
                          {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-300 mt-2 leading-relaxed">{a.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">No announcements yet.</div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ✅ Announcements POPUP (ONLY popup state) */}
      <AnnouncementPopupModal
        open={announcePopupOpen}
        onClose={closeAnnouncementPopup}
        list={publicAnnouncements}
        loading={publicAnnouncementsLoading}
      />
    </>
  );
}