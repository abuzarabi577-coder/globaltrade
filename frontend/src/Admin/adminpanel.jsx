// src/Admin/adminpanel.jsx - DOT REMOVED + CLEAN LOGO
import React from 'react';
import { motion } from 'framer-motion';
import {
  FaUsers, FaTrophy, FaTasks, FaWallet, FaCog, FaChartBar, FaSignOutAlt,FaBullhorn
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import TasksManager from './TaskManage';
import Alert from '../components/Alert';
import { useAppContext } from '../context/AppContext';
import AdminUsersPage from './AdminUsersPage';
import AdminUsers from './AdminUsersPage';
import Leaderboard from './leaderBoard';
import AdminWithdraws from './AdminWithdraws';
import { useAdmin } from '../context/AdminContext';
import AdminAnnouncements from './AdminAnnouncements';

const AdminLayout = () => {
  const location = useLocation();
  const { showAlert ,alert} = useAppContext();
  const { logoutAdmin} = useAdmin();
  const sidebarItems = [
    { id: 'dashboard', icon: FaChartBar, label: 'Dashboard', path: '/1cglobal_admin_hoon_yaar/dashboard' },
    { id: 'users', icon: FaUsers, label: 'Users', path: '/1cglobal_admin_hoon_yaar/users' },
    { id: 'leaderboard', icon: FaTrophy, label: 'Leaderboard', path: '/1cglobal_admin_hoon_yaar/leaderboard' },
    { id: 'tasks', icon: FaTasks, label: 'Tasks', path: '/1cglobal_admin_hoon_yaar/tasksmanage' },
    { id: 'withdrawal', icon: FaWallet, label: 'withdrawal', path: '/1cglobal_admin_hoon_yaar/withdraws' },
    { id: 'announcements', icon: FaBullhorn, label: 'Announcements', path: '/1cglobal_admin_hoon_yaar/announcements' },
  ];

  // 🔥 1C TRADER LOGO - DOT REMOVED
  const Logo1CTrader = ({ className = '' }) => (
    <svg 
      className={`w-50 h-18 ${className}`}
      viewBox="0 0 300 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Trading Chart Background */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
      </defs>

      {/* Main Shield Background */}
      <rect 
        x="10" y="10" 
        width="280" height="60" 
        rx="12" ry="12"
        fill="url(#gradient2)"
        stroke="url(#gradient1)"
        strokeWidth="2"
        opacity="0.9"
      />

      {/* 1C Stylized - Bold Trading Style */}
      <text 
        x="50" y="42" 
        fontFamily="'Inter', 'Roboto', sans-serif"
        fontSize="28" 
        fontWeight="900"
        fill="#ffffff"
        stroke="#f59e0b"
        strokeWidth="1.2"
        letterSpacing="-0.5"
      >
        1C
      </text>

      {/* Trader Text */}
      <text 
        x="110" y="48" 
        fontFamily="'Inter', 'Roboto', sans-serif"
        fontSize="16" 
        fontWeight="700"
        fill="url(#gradient1)"
        letterSpacing="0.3"
      >
        TRADER
      </text>

      {/* Trading Chart Lines */}
      <path 
        d="M 25 55 L 45 35 L 65 48 L 85 28 L 105 42" 
        stroke="url(#gradient1)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.8"
      />
      
      {/* Price Tick Marks */}
      <circle cx="30" cy="52" r="2.5" fill="#f59e0b" opacity="0.9"/>
      <circle cx="50" cy="32" r="2.5" fill="#eab308" opacity="0.9"/>
      <circle cx="70" cy="45" r="2.5" fill="#f59e0b" opacity="0.9"/>
      <circle cx="90" cy="25" r="2.5" fill="#d97706" opacity="0.9"/>

      {/* Glow Effect */}
      <rect 
        x="10" y="10" 
        width="280" height="60" 
        rx="12" ry="12"
        fill="none"
        stroke="url(#gradient1)"
        strokeWidth="0"
        opacity="0.3"
      />

      {/* Subtle Shine */}
      <rect 
        x="15" y="15" 
        width="20" height="50" 
        rx="10" 
        fill="url(#gradient1)"
        opacity="0.1"
      />
    </svg>
  );

  const DashboardContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-7xl mx-auto pt-24"
  >
    <div className="bg-black/50 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-10">
      <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-4">
        Admin Dashboard
      </h1>

      <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
        Welcome to <span className="text-yellow-400 font-semibold">1C Trader</span> Admin Panel.
      </p>

      <p className="text-sm md:text-base text-gray-400 mt-3 max-w-3xl">
        Manage users, tasks, leaderboard and withdraw requests from the left sidebar.
      </p>

      <p className="text-sm text-gray-500 mt-6">
        Tip: Use “Withdraws” to approve payouts and “Tasks” to update daily activity items.
      </p>
    </div>
  </motion.div>
);


  const UnderConstruction = ({ pageTitle }) => (
    <div className="min-h-screen flex items-center justify-center p-12 pt-32">
      <div className="text-center max-w-2xl space-y-8">
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-32 h-32 mx-auto mb-12 bg-yellow-500/10 rounded-3xl border-4 border-dashed border-yellow-500/40 flex items-center justify-center shadow-2xl"
        >
          <FaCog className="w-16 h-16 text-yellow-500 animate-spin" />
        </motion.div>
        <div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-6">
            Under Construction
          </h1>
          <h2 className="text-4xl font-bold text-white/90 capitalize">{pageTitle}</h2>
        </div>
        <Link to="/admin">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="px-10 py-5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black text-xl rounded-3xl shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300"
          >
            ← Back to Dashboard
          </motion.button>
        </Link>
      </div>
    </div>
  );

  return (
    <>
     {/* Alert Component */}
          <Alert
            type={alert.type} 
            message={alert.message} 
            isOpen={alert.isOpen}
            onClose={() => showAlert({ isOpen: false, type: '', message: '' })}
          />
      {/* Mobile Block */}
      <div className=" lg:hidden min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 mx-auto bg-yellow-500/20 rounded-3xl flex items-center justify-center mb-8">
            <svg className="w-14 h-14" viewBox="0 0 50 50">
              <text x="12" y="34" fontSize="28" fontWeight="900" fill="#f59e0b">1C</text>
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Desktop Only</h1>
          <p className="text-xl text-gray-400">1C Trader Admin Panel (1024px+)</p>
        </div>
      </div>

      {/* Desktop Panel */}
      <div className="hidden lg:block min-h-screen bg-gradient-to-br from-gray-900 via-black/50 to-gray-900 text-white overflow-hidden">
        
        {/* 🔥 FIXED SIDEBAR - DOT REMOVED */}
        <aside className="fixed left-0 top-0 h-screen w-64 z-50 bg-gradient-to-b from-black/95 via-gray-900/95 to-black/90 
                          backdrop-blur-3xl border-r border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
          
          {/* 🔥 CLEAN LOGO SECTION - NO DOT */}
          <div className="p-6 border-b border-yellow-500/30 bg-black/80 backdrop-blur-xl sticky top-0 z-10">
            <div className="flex items-center justify-center">
              <Logo1CTrader className="drop-shadow-2xl hover:scale-[1.02] transition-transform duration-300" />
            </div>
            {/* ✅ DOT REMOVED */}
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col px-4 py-8 space-y-3 h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
            {sidebarItems.map((item) => {
              const isActive = location.pathname.includes(item.id);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`group relative flex items-center p-4 rounded-2xl transition-all duration-300 h-14 hover:h-16
                    ${isActive
                      ? 'bg-gradient-to-r from-yellow-500/60 to-yellow-400/40 border-3 border-yellow-500 shadow-xl shadow-yellow-500/50 scale-[1.02] ring-2 ring-yellow-500/40 text-white font-semibold'
                      : 'bg-black/50 hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-yellow-400/20 border border-gray-700/50 hover:border-yellow-500/60 hover:shadow-xl hover:shadow-yellow-500/30 hover:scale-[1.02] hover:text-white text-gray-300'
                    }`}
                  title={item.label}
                >
                  <item.icon className={`w-7 h-7 mr-4 p-2 rounded-xl transition-all duration-300 flex-shrink-0
                    ${isActive 
                      ? 'bg-yellow-500/50 text-yellow-400 shadow-lg scale-110' 
                      : 'bg-gray-800/60 text-gray-400 group-hover:bg-yellow-500/30 group-hover:text-yellow-400 group-hover:shadow-lg group-hover:scale-110'
                    }`} />
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  {isActive && (
                    <motion.div 
                      className="absolute right-3 w-2 h-2 bg-green-400 rounded-full shadow-lg animate-ping"
                      layoutId="active-indicator"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-6 pt-4 mt-auto sticky bottom-0 bg-black/80 backdrop-blur-xl border-t border-yellow-500/20">
            <button className="group w-full h-14 p-4 rounded-2xl bg-gradient-to-r from-red-600/95 to-red-700/95 
                              border-2 border-red-500/60 shadow-xl hover:shadow-red-500/50 hover:from-red-500 hover:to-red-600 
                              hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 text-white font-semibold
                              hover:text-white active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-500/50"
                    title="Logout" onClick={logoutAdmin}>
              <FaSignOutAlt className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
    {/* // adminpanel.jsx mein main section: */}

<main className="ml-64 p-6 ">
  {location.pathname === "/1cglobal_admin_hoon_yaar/tasksmanage" ? (
    <TasksManager />
  ) : location.pathname === "/1cglobal_admin_hoon_yaar" || location.pathname === "/1cglobal_admin_hoon_yaar/dashboard" ? (
    <DashboardContent />
  ) : location.pathname === "/1cglobal_admin_hoon_yaar/users" ? (
    <AdminUsers/>
  ) : 
  location.pathname === "/1cglobal_admin_hoon_yaar/leaderboard" ? (
    <Leaderboard/>
  ) :location.pathname === "/1cglobal_admin_hoon_yaar/withdraws" ? (
  <AdminWithdraws/>
) : location.pathname === "/1cglobal_admin_hoon_yaar/announcements" ? (
<AdminAnnouncements />
) :
  
  
  (
    <UnderConstruction pageTitle={location.pathname.replace("/1cglobal_admin_hoon_yaar/", "") || "Page"} />
  )}
</main>

      </div>
{/* 
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;800;900&display=swap');
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #eab308, #f59e0b);
          border-radius: 3px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #f59e0b, #d97706);
        }
      `}</style> */}
    </>
  );
};

export default AdminLayout;