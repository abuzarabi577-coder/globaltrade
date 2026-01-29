// src/Admin/adminpanel.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUsers, FaTrophy, FaTasks, FaWallet,
  FaCog, FaChartBar, FaSignOutAlt, FaBars, FaTimes
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import TasksManager from './TaskManage';
import Alert from '../components/Alert';
import { useAppContext } from '../context/AppContext';
import AdminUsers from './AdminUsersPage';
import Leaderboard from './leaderBoard';
import AdminWithdraws from './AdminWithdraws';
import { useAdmin } from '../context/AdminContext';
import AdminAnnouncements from './AdminAnnouncements';

const AdminLayout = () => {
  const location = useLocation();
  const { showAlert, alert } = useAppContext();
  const { logoutAdmin } = useAdmin();

  const [mobileMenu, setMobileMenu] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', icon: FaChartBar, label: 'Dashboard', path: '/1cglobal_admin_hoon_yaar/dashboard' },
    { id: 'users', icon: FaUsers, label: 'Users', path: '/1cglobal_admin_hoon_yaar/users' },
    { id: 'leaderboard', icon: FaTrophy, label: 'Leaderboard', path: '/1cglobal_admin_hoon_yaar/leaderboard' },
    { id: 'tasksmanage', icon: FaTasks, label: 'Tasks', path: '/1cglobal_admin_hoon_yaar/tasksmanage' },
    { id: 'withdraws', icon: FaWallet, label: 'Withdraws', path: '/1cglobal_admin_hoon_yaar/withdraws' },
        { id: 'announcements', icon: FaBullhorn, label: 'Announcements', path: '/1cglobal_admin_hoon_yaar/announcements' },
    
  ];

  /* ---------------- LOGO ---------------- */
  const Logo1CTrader = () => (
    <div className="text-yellow-400 font-black text-2xl tracking-wide">
      1C <span className="text-white">TRADER</span>
    </div>
  );

  /* ---------------- SIDEBAR CONTENT (REUSED) ---------------- */
  const SidebarContent = ({ isMobile = false }) => (
    <>
      <div className="p-6 border-b border-yellow-500/30 flex justify-center">
        <Logo1CTrader />
      </div>

      <nav className="flex flex-col px-4 py-6 space-y-3 flex-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = location.pathname.includes(item.id);
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => isMobile && setMobileMenu(false)}
              className={`flex items-center gap-3 p-4 rounded-xl transition
                ${isActive
                  ? 'bg-yellow-500/40 text-white shadow'
                  : 'text-gray-300 hover:bg-yellow-500/20'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-yellow-500/20">
        <button
          onClick={logoutAdmin}
          className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 p-3 rounded-xl font-semibold"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </>
  );

  /* ---------------- MAIN CONTENT ROUTER ---------------- */
  const renderContent = () => {
    if (location.pathname.includes('tasksmanage')) return <TasksManager />;
    if (location.pathname.includes('users')) return <AdminUsers />;
    if (location.pathname.includes('leaderboard')) return <Leaderboard />;
    if (location.pathname.includes('withdraws')) return <AdminWithdraws />;
    if (location.pathname.includes('announcements')) return <AdminAnnouncements />;

    return (
      <div className="pt-20">
        <h1 className="text-4xl font-black text-yellow-400">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome to 1C Trader Admin Panel</p>
      </div>
    );
  };

  return (
    <>
      {/* ALERT */}
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => showAlert({ isOpen: false })}
      />

      {/* ================= MOBILE NAVBAR ================= */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-yellow-500/30 p-4 flex items-center justify-between">
        <Logo1CTrader />
        <button onClick={() => setMobileMenu(true)}>
          <FaBars className="text-2xl text-yellow-400" />
        </button>
      </div>

      {/* ================= MOBILE SIDEBAR DRAWER ================= */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition ${
          mobileMenu ? 'visible' : 'invisible'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/70 transition-opacity ${
            mobileMenu ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenu(false)}
        />

        <aside
          className={`absolute left-0 top-0 h-full w-72 bg-gradient-to-b from-black to-gray-900 transform transition-transform ${
            mobileMenu ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="absolute top-4 right-4">
            <FaTimes
              className="text-2xl text-yellow-400 cursor-pointer"
              onClick={() => setMobileMenu(false)}
            />
          </div>

          <SidebarContent isMobile />
        </aside>
      </div>

      {/* ================= DESKTOP SIDEBAR (UNCHANGED) ================= */}
      <div className="hidden lg:flex">
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-black to-gray-900 border-r border-yellow-500/30">
          <SidebarContent />
        </aside>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="lg:ml-64 pt-24 lg:pt-6 p-6 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        {renderContent()}
      </main>
    </>
  );
};

export default AdminLayout;