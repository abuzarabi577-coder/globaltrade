import React, { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TopNavbar from "./TopNavbar";
import {
  FaHome,
  FaTasks,
  FaCoins,
  FaWallet,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";

import Mainpage from "./mainpage";
import Wallet from "./wallet";
import TasksSection from "../task/TasksSection";
import NoWalletConnected from "./NoWalletConnected";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import Alert from "./Alert";
import InvestPlanCards from "./InvestPlanCards";
import WinnerAnnouncementModal from "./winnerModal";
import UnderMaintenanceModal from "./maintainceModal";

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("home");
  const [currentPage, setCurrentPage] = useState("home");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { showAlert ,alert, FetchUserData,
    HandleFetchUserData,} = useAppContext();
const location = useLocation();
const isPlansPage = location.pathname === "/plans";

  const navigate = useNavigate();
  const { logoutUser, checkAuth } = useAuth();
  // ✅ always fetch user on mount (so login state is known)
  useEffect(() => {
    HandleFetchUserData();
  }, [HandleFetchUserData]);

  // ✅ cookie-based session check (no localStorage)
  useEffect(() => {
    const init = async () => {
      const res = await checkAuth(); // should return null/false if not logged in
      const ok = !!res?.success;

      setIsLoggedIn(ok);
      setIsWalletConnected(!!res?.user?.walletAddress);
    };

    init();
  }, [checkAuth]);

  // ✅ Protected navigation (Tasks / Wallet)
  const handleProtectedNav = async (page) => {
    const res = await checkAuth();
    if (!res?.success) {
      navigate("/login");
      return;
    }

    // update wallet state as well (fresh)
    setIsLoggedIn(true);
    setIsWalletConnected(!!res?.user?.walletAddress);

    setCurrentPage(page);
    setActiveNav(page);
  };
const goToPage = async (page) => {
  // ✅ if currently on /plans, first leave /plans so normal dashboard renders
  if (isPlansPage) {
    navigate("/"); // or "/" whichever your dashboard route is
  }

  // ✅ now set page state
  if (page === "home") {
    setCurrentPage("home");
    setActiveNav("home");
    return;
  }

  if (page === "tasks" || page === "wallet") {
    await handleProtectedNav(page);
    return;
  }

  // ✅ default
  setCurrentPage(page);
  setActiveNav(page);
};
// useEffect(() => {
//   if (isPlansPage) {
//     setActiveNav("");     // highlight off (optional)
//     // setCurrentPage("home"); // optional
//   }
// }, [isPlansPage]);

  // ✅ Logout
  const handleLogout = async () => {
    await logoutUser(); // backend cookie clear

    setIsLoggedIn(false);
    setIsWalletConnected(false);

    setCurrentPage("home");
    setActiveNav("home");

    navigate("/login");
  };

  const navItems = [
  {
    icon: FaHome,
    label: "Home",
    page: "home",
    onClick: () => goToPage("home"),
  },
  {
    icon: FaTasks,
    label: "Tasks",
    page: "tasks",
    onClick: () => goToPage("tasks"),
  },
  { icon: FaCoins, label: "Earn", page: "earn", big: true, onClick: () => goToPage("home") },
  {
    icon: FaWallet,
    label: "Wallet",
    page: "wallet",
    onClick: () => goToPage("wallet"),
  },
  isLoggedIn
    ? {
        icon: FaSignOutAlt,
        label: "Logout",
        page: "logout",
        onClick: handleLogout,
      }
    : {
        icon: FaSignInAlt,
        label: "Login",
        page: "login",
        onClick: () => navigate("/login"),
      },
];


 return (
  <>
    {/* ✅ Alert always on top */}
    <Alert
      type={alert.type}
      message={alert.message}
      isOpen={alert.isOpen}
      onClose={() => showAlert({ isOpen: false, type: "", message: "" })}
    />
   {/* <UnderMaintenanceModal
        openByDefault={true}
        lockSite={true}
        showClose={true} // close allow
      /> */}
    {/* ✅ TopNavbar ALWAYS visible */}
    <TopNavbar />


    {/* ================= CONTENT ================= */}

    {/* ✅ ONLY plans page */}
  {isPlansPage && (
  <div className="min-h-screen w-full mt-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-6 pt-10 pb-28">
      <InvestPlanCards />
    </div>
  </div>
)}


    {/* ✅ NORMAL dashboard when NOT /plans */}
    {!isPlansPage && (
      <>
        {currentPage === "home" && <Mainpage />}
        {currentPage === "tasks" && <TasksSection />}
        {currentPage === "wallet" && <Wallet />}
     t
        
      </>
    )}

    {/* ================= BOTTOM NAV ================= */}

    {/* ✅ Bottom nav ALWAYS visible */}
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 py-1 left-0 right-0 h-18 bg-black/90 backdrop-blur-2xl border-t border-gray-800/50 z-50 flex items-center justify-around px-4"
    >
      {navItems.map((item, idx) => (
        <motion.button
          key={idx}
          className={`flex flex-col items-center transition-all ${
            activeNav === item.page ? "text-yellow-400" : "text-gray-400"
          }`}
          onClick={item.onClick}
          whileTap={{ scale: 0.95 }}
        >
          <item.icon
            className={`mb-1 ${
              item.big ? "w-10 h-12" : "w-6 h-6"
            }`}
          />
          <span className="text-xs font-semibold uppercase tracking-wider">
            {item.label}
          </span>
        </motion.button>
      ))}
    </motion.nav>
  </>
);

}
