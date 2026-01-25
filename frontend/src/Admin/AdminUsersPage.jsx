import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "../context/AdminContext";
import {
  FaEye,
  FaTimes,
  FaSearch,
  FaPlus,
  FaUserSlash,
  FaUserCheck,
  FaCheck,
  FaBan,
} from "react-icons/fa";
import Alert from "../components/Alert";

/* utils */
const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(n || 0));

export default function AdminUsers() {
  const {
    users,
    usersLoading,
    usersError,
    fetchUsers,
    selectedUser,
    setSelectedUser,
    selectedLoading,
    fetchUserDetails,
    createDummyUser,
    toggleUserStatus,
    showAlert,
    alert,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* dummy modal */
  const [dummyModalOpen, setDummyModalOpen] = useState(false);
  const [dummyError, setDummyError] = useState("");
  const [dummyForm, setDummyForm] = useState({
    name: "",
    email: "",
    password: "",
    level: 0,
    totalEarnings: 0,
    walletAddress: "dumyuserwallet",
    network: "ETH",
  });

  /* confirm modal */
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    userId: null,
    currentStatus: null,
    name: "",
  });

  useEffect(() => {
    fetchUsers("");
  }, [fetchUsers]);

  /* search filter */
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return users || [];
    return (users || []).filter(
      (u) =>
        (u.name || "").toLowerCase().includes(s) ||
        (u.email || "").toLowerCase().includes(s)
    );
  }, [users, search]);

  const openUser = async (u) => {
    setDrawerOpen(true);
    setSelectedUser(null);
    await fetchUserDetails(u._id);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleToggleClick = (u) => {
    setConfirmModal({
      isOpen: true,
      userId: u._id,
      currentStatus: u.isActive,
      name: u.name,
    });
  };

  const confirmToggle = async () => {
    const ok = await toggleUserStatus(
      confirmModal.userId,
      confirmModal.currentStatus
    );
    if (ok) setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const openDummyModal = () => {
    setDummyError("");
    setDummyForm({
      name: "",
      email: "",
      password: "",
      level: 0,
      totalEarnings: 0,
      walletAddress: "dumyuserwallet",
      network: "ETH",
    });
    setDummyModalOpen(true);
  };

  const saveDummyUser = async () => {
    setDummyError("");
    if (!dummyForm.name) return setDummyError("Name required");
    if (!dummyForm.email.includes("@"))
      return setDummyError("Valid email required");
    if (dummyForm.password.length < 8)
      return setDummyError("Password min 8 chars");

    const ok = await createDummyUser({
      ...dummyForm,
      level: Number(dummyForm.level),
      totalEarnings: Number(dummyForm.totalEarnings),
    });

    if (ok) setDummyModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto pt-16 px-4">
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => showAlert({ isOpen: false })}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-white">
            Users <span className="text-yellow-500">Management</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Search users, view levels, earnings & profiles
          </p>
        </div>

        <button
          onClick={openDummyModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 font-bold"
        >
          <FaPlus /> Add Dummy User
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-black/60 border border-gray-800/60 rounded-3xl p-4 mb-6 flex items-center gap-3">
        <FaSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 bg-transparent outline-none text-white"
        />
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-4">
        {filtered.map((u) => (
          <div
            key={u._id}
            className="bg-black/60 border border-gray-800/60 rounded-2xl p-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-white font-bold">{u.name}</div>
                <div className="text-xs text-gray-400">{u.email}</div>
              </div>
              <span className="text-yellow-400 font-bold">Lvl {u.level}</span>
            </div>

            <div className="mt-3 flex justify-between text-sm">
              <span className="text-gray-400">Earnings</span>
              <span className="text-green-400 font-bold">
                {money(u.totalEarnings)}
              </span>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleToggleClick(u)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold ${
                  u.isActive
                    ? "bg-red-500/20 text-red-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {u.isActive ? "Suspend" : "Activate"}
              </button>

              <button
                onClick={() => openUser(u)}
                className="flex-1 py-2 rounded-xl bg-black/40 border border-gray-700 text-white"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-black/60 border border-gray-800/60 rounded-3xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/40">
            <tr className="text-gray-400 uppercase text-xs">
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Level</th>
              <th className="px-6 py-4 text-left">Earnings</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr
                key={u._id}
                className="border-t border-gray-800 hover:bg-white/[0.03]"
              >
                <td className="px-6 py-4">
                  <div className="text-white font-semibold">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </td>
                <td className="px-6 py-4 text-yellow-400 font-bold">
                  {u.level}
                </td>
                <td className="px-6 py-4 text-green-400 font-bold">
                  {money(u.totalEarnings)}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => handleToggleClick(u)}
                    className={`w-10 h-10 rounded-xl ${
                      u.isActive
                        ? "bg-red-500/20 text-red-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {u.isActive ? <FaUserSlash /> : <FaUserCheck />}
                  </button>
                  <button
                    onClick={() => openUser(u)}
                    className="w-10 h-10 rounded-xl bg-black/40 border border-gray-700 text-white"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-[#111] p-6 rounded-3xl text-center w-full max-w-sm"
            >
              <h3 className="text-white font-bold mb-4">
                {confirmModal.currentStatus ? "Suspend" : "Activate"}{" "}
                {confirmModal.name}?
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setConfirmModal({ ...confirmModal, isOpen: false })
                  }
                  className="flex-1 py-2 bg-gray-800 rounded-xl text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmToggle}
                  className={`flex-1 py-2 rounded-xl font-bold ${
                    confirmModal.currentStatus
                      ? "bg-red-500"
                      : "bg-emerald-500"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* small UI parts */
function Field({ label, children }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">{label}</div>
      {children}
    </div>
  );
}
/* small UI parts */
function Section({ title, children }) {
  return (
    <div className="bg-black/50 border border-gray-800/60 rounded-3xl p-5">
      <div className="text-xs uppercase tracking-wider text-gray-500 mb-4">{title}</div>
      {children}
    </div>
  );
}

function MiniCard({ label, value, valueClass = "text-white" }) {
  return (
    <div className="bg-black/50 border border-gray-800/60 rounded-3xl p-4">
      <div className="text-[10px] uppercase tracking-wider text-gray-500">{label}</div>
      <div className={`text-xl font-black mt-1 ${valueClass}`}>{value}</div>
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-800/40 last:border-b-0">
      <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
      <div className={`text-sm text-gray-200 text-right ${mono ? "font-mono" : ""}`}>
        {value ?? "—"}
      </div>
    </div>
  );
}

function BreakRow({ label, value }) {
  return (
    <tr className="border-t border-gray-800/60">
      <td className="px-4 py-3 text-gray-300">{label}</td>
      <td className="px-4 py-3 text-right text-white font-bold">{value}</td>
    </tr>
  );
}

function SmallStat({ label, value }) {
  return (
    <div className="bg-black/40 border border-gray-800/60 rounded-2xl p-3">
      <div className="text-[10px] uppercase tracking-wider text-gray-500">{label}</div>
      <div className="text-sm font-bold text-white mt-1">{value}</div>
    </div>
  );
}