// src/Admin/AdminUsers.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
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
  FaCopy,
  FaUserCircle,
  FaIdBadge,
  FaWallet,
  FaNetworkWired,
  FaCalendarAlt,
} from "react-icons/fa";
import Alert from "../components/Alert";

const money = (n) => {
  const num = Number(n || 0);
  const rounded = Math.round((num + Number.EPSILON) * 100) / 100;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(rounded);
};

const safeText = (v) => (v === null || v === undefined || v === "" ? "—" : String(v));

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

  // ✅ modals
  const [dummyModalOpen, setDummyModalOpen] = useState(false);
  const [dummyForm, setDummyForm] = useState({
    name: "",
    email: "",
    password: "",
    level: 0,
    totalEarnings: 0,
    walletAddress: "dumyuserwallet",
    network: "ETH",
  });
  const [dummyError, setDummyError] = useState("");

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    userId: null,
    currentStatus: null,
    name: "",
  });

  // ✅ fetch list
  useEffect(() => {
    fetchUsers("");
  }, [fetchUsers]);

  // ✅ close on ESC (drawer + modals)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setDummyModalOpen(false);
      setConfirmModal((p) => ({ ...p, isOpen: false }));
      setDrawerOpen(false);
      setSelectedUser(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSelectedUser]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return users || [];
    return (users || []).filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      return name.includes(s) || email.includes(s);
    });
  }, [users, search]);

  const openUser = useCallback(
    async (u) => {
      setDrawerOpen(true);
      setSelectedUser(null);
      await fetchUserDetails(u._id);
    },
    [fetchUserDetails, setSelectedUser]
  );

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedUser(null);
  }, [setSelectedUser]);

  const handleToggleClick = (u) => {
    setConfirmModal({
      isOpen: true,
      userId: u._id,
      currentStatus: !!u.isActive,
      name: u.name || "User",
    });
  };

  const confirmToggle = async () => {
    const ok = await toggleUserStatus(confirmModal.userId, confirmModal.currentStatus);
    if (ok) setConfirmModal((p) => ({ ...p, isOpen: false }));
  };

  // ✅ Dummy modal open
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

    const payload = {
      name: dummyForm.name.trim(),
      email: dummyForm.email.trim().toLowerCase(),
      password: dummyForm.password,
      level: Number(dummyForm.level || 0),
      totalEarnings: Number(dummyForm.totalEarnings || 0),
      walletAddress: dummyForm.walletAddress || "dumyuserwallet",
      network: dummyForm.network || "ETH",
    };

    if (!payload.name) return setDummyError("Name is required");
    if (!payload.email || !payload.email.includes("@")) return setDummyError("Valid email is required");
    if (!payload.password || payload.password.length < 8)
      return setDummyError("Password must be at least 8 characters");
    if (!Number.isFinite(payload.level) || payload.level < 0 || payload.level > 10)
      return setDummyError("Level must be 0 - 10");
    if (!Number.isFinite(payload.totalEarnings) || payload.totalEarnings < 0)
      return setDummyError("Total earnings must be 0 or more");

    const ok = await createDummyUser(payload);
    if (ok) setDummyModalOpen(false);
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text || ""));
      showAlert({ isOpen: true, type: "success", message: "Copied" });
    } catch {
      showAlert({ isOpen: true, type: "error", message: "Copy failed" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-16 px-4 sm:px-6">
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => showAlert({ isOpen: false, type: "", message: "" })}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Users <span className="text-yellow-500">Management</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Search users, view levels, earnings and open full profile in a responsive drawer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-black/50 border border-gray-800/60 text-gray-300 text-xs">
            Total: <span className="text-white font-bold">{(users || []).length}</span>
          </div>

          <button
            type="button"
            onClick={openDummyModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 text-yellow-200 font-black text-xs sm:text-sm hover:border-yellow-500/60 hover:bg-yellow-500/25 transition"
          >
            <FaPlus />
            Add Dummy
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-black/60 border border-gray-800/60 rounded-3xl p-4 mb-5">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-11 h-11 rounded-2xl bg-black/50 border border-gray-800/60 flex items-center justify-center">
              <FaSearch className="text-gray-400" />
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-transparent outline-none text-white placeholder:text-gray-500 text-sm"
            />

            <button
              type="button"
              onClick={() => fetchUsers(search)}
              className="px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm font-bold hover:bg-yellow-500/15 transition"
            >
              Search
            </button>
          </div>

          <div className="text-xs text-gray-400 md:text-right">
            {usersLoading ? "Loading..." : usersError ? usersError : `${filtered.length} results`}
          </div>
        </div>
      </div>

      {/* Cards (mobile) */}
      <div className="block md:hidden space-y-3">
        {!usersLoading && filtered.length === 0 && (
          <div className="bg-black/60 border border-gray-800/60 rounded-3xl p-8 text-center text-gray-500">
            No users found.
          </div>
        )}

        {filtered.map((u) => (
          <div
            key={u._id}
            className="bg-black/60 border border-gray-800/60 rounded-3xl p-4 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-300 font-black shrink-0">
                {(u.name || "U").slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-white font-bold truncate">{u.name || "—"}</div>
                <div className="text-xs text-gray-500 truncate">{u.email || "—"}</div>
                <div className="mt-1 flex items-center gap-2 text-[11px]">
                  <span className="px-2 py-1 rounded-xl bg-black/50 border border-gray-800/60 text-gray-200">
                    Lv <span className="text-yellow-400 font-bold">{u.level ?? 0}</span>
                  </span>
                  <span className="text-emerald-400 font-bold">{money(u.totalEarnings)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleToggleClick(u)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition border ${
                  u.isActive
                    ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                }`}
                title={u.isActive ? "Suspend User" : "Activate User"}
              >
                {u.isActive ? <FaUserSlash /> : <FaUserCheck />}
              </button>

              <button
                onClick={() => openUser(u)}
                className="w-10 h-10 rounded-xl bg-black/50 border border-gray-800/60 text-gray-200 hover:border-yellow-500/40 hover:text-yellow-300 transition flex items-center justify-center"
                title="View profile"
              >
                <FaEye />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Table (desktop) */}
      <div className="hidden md:block bg-black/60 border border-gray-800/60 rounded-3xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800/60 flex items-center justify-between">
          <div className="text-sm font-bold text-white">All Users</div>
          <div className="text-xs text-gray-400">
            {usersLoading ? "Loading..." : usersError ? usersError : `${filtered.length} results`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/40">
              <tr className="text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-4 font-semibold">User</th>
                <th className="text-left px-6 py-4 font-semibold">Level</th>
                <th className="text-left px-6 py-4 font-semibold">Total Earnings</th>
                <th className="text-right px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {!usersLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}

              {filtered.map((u) => (
                <tr key={u._id} className="border-t border-gray-800/50 hover:bg-white/[0.03] transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-300 font-black">
                        {(u.name || "U").slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-semibold flex items-center gap-2">
                          <span className="truncate max-w-[260px]">{u.name || "—"}</span>
                          {u.isDummy && (
                            <span className="text-[10px] px-2 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 font-bold">
                              DUMMY
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[320px]">{u.email || "—"}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-2xl bg-black/50 border border-gray-800/60 text-gray-200">
                      Level <span className="text-yellow-400 font-bold">{u.level ?? 0}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-emerald-400 font-bold">{money(u.totalEarnings)}</span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleClick(u)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition border ${
                          u.isActive
                            ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                        }`}
                        title={u.isActive ? "Suspend User" : "Activate User"}
                      >
                        {u.isActive ? <FaUserSlash /> : <FaUserCheck />}
                      </button>

                      <button
                        onClick={() => openUser(u)}
                        className="w-10 h-10 rounded-xl bg-black/50 border border-gray-800/60 text-gray-200 hover:border-yellow-500/40 hover:text-yellow-300 transition flex items-center justify-center"
                        title="View profile"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Dummy User Modal */}
      <AnimatePresence>
        {dummyModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[120]"
              onClick={() => setDummyModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: "tween", duration: 0.18 }}
              className="fixed inset-0 z-[130] flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
            >
              <div className="w-full max-w-xl bg-gradient-to-b from-black via-gray-950 to-black border border-gray-800/70 rounded-3xl overflow-hidden shadow-2xl">
                <div className="px-6 py-5 border-b border-gray-800/70 flex items-center justify-between bg-black/60">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-500">Create</div>
                    <div className="text-white font-black text-lg">Dummy User</div>
                  </div>

                  <button
                    onClick={() => setDummyModalOpen(false)}
                    className="w-11 h-11 rounded-2xl bg-black/50 border border-gray-800/70 hover:border-yellow-500/40 text-gray-200 hover:text-yellow-300 transition flex items-center justify-center"
                    type="button"
                    title="Close"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {dummyError && (
                    <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                      {dummyError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Name">
                      <input
                        value={dummyForm.name}
                        onChange={(e) => setDummyForm((p) => ({ ...p, name: e.target.value }))}
                        className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
                        placeholder="John Doe"
                      />
                    </Field>

                    <Field label="Email">
                      <input
                        value={dummyForm.email}
                        onChange={(e) => setDummyForm((p) => ({ ...p, email: e.target.value }))}
                        className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
                        placeholder="john@example.com"
                      />
                    </Field>

                    <Field label="Set Password">
                      <input
                        type="password"
                        value={dummyForm.password}
                        onChange={(e) => setDummyForm((p) => ({ ...p, password: e.target.value }))}
                        className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
                        placeholder="Min 8 chars"
                      />
                    </Field>

                    <Field label="Level (0 - 10)">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={dummyForm.level}
                        onChange={(e) => setDummyForm((p) => ({ ...p, level: e.target.value }))}
                        className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
                      />
                    </Field>

                    <Field label="Total Earnings (USD)">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={dummyForm.totalEarnings}
                        onChange={(e) => setDummyForm((p) => ({ ...p, totalEarnings: e.target.value }))}
                        className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
                        placeholder="0"
                      />
                    </Field>

                    <Field label="Network">
                      <input
                        value={dummyForm.network}
                        onChange={(e) => setDummyForm((p) => ({ ...p, network: e.target.value }))}
                        className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
                        placeholder="ETH / TRX"
                      />
                    </Field>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={saveDummyUser}
                      className="flex-1 px-5 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black hover:brightness-110 transition"
                      type="button"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setDummyModalOpen(false)}
                      className="px-5 py-3 rounded-2xl bg-black/50 border border-gray-800/70 text-gray-200 hover:border-yellow-500/40 hover:text-yellow-300 transition"
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="text-[11px] text-gray-500">
                    * Dummy user is for testing. Ensure backend supports this endpoint.
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ✅ Confirm Toggle Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-[#111] border border-gray-800 p-6 sm:p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center"
            >
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl ${
                  confirmModal.currentStatus ? "bg-red-500/20 text-red-500" : "bg-emerald-500/20 text-emerald-500"
                }`}
              >
                {confirmModal.currentStatus ? <FaBan /> : <FaCheck />}
              </div>

              <h3 className="text-xl font-black text-white mb-2">Are you sure?</h3>
              <p className="text-gray-400 text-sm mb-6">
                You are about to{" "}
                <span className="font-black text-white">{confirmModal.currentStatus ? "Suspend" : "Activate"}</span>{" "}
                {confirmModal.name}.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal((p) => ({ ...p, isOpen: false }))}
                  className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-bold"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmToggle}
                  className={`flex-1 py-3 rounded-xl font-black text-black ${
                    confirmModal.currentStatus ? "bg-red-500" : "bg-emerald-500"
                  }`}
                  type="button"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ✅ Profile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black z-[100]"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.22 }}
              className="fixed right-0 top-0 h-screen w-full sm:w-[520px] md:w-[560px] z-[110] bg-gradient-to-b from-black via-gray-950 to-black border-l border-gray-800/70"
              role="dialog"
              aria-modal="true"
            >
              <div className="h-full flex flex-col">
                <div className="px-5 sm:px-6 py-5 border-b border-gray-800/70 flex items-center justify-between bg-black/60 backdrop-blur-xl">
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wider text-gray-500">View Profile</div>
                    <div className="text-white font-black text-lg truncate">
                      {selectedUser?.name || (selectedLoading ? "Loading..." : "—")}
                    </div>
                  </div>

                  <button
                    onClick={closeDrawer}
                    className="w-11 h-11 rounded-2xl bg-black/50 border border-gray-800/70 hover:border-yellow-500/40 text-gray-200 hover:text-yellow-300 transition flex items-center justify-center"
                    type="button"
                    title="Close"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                  {/* loading state */}
                  {selectedLoading && (
                    <div className="bg-black/50 border border-gray-800/60 rounded-3xl p-6 text-gray-400 text-sm">
                      Loading profile...
                    </div>
                  )}

                  {!selectedLoading && !selectedUser && (
                    <div className="bg-black/50 border border-gray-800/60 rounded-3xl p-6 text-gray-500 text-sm">
                      No data.
                    </div>
                  )}

                  {!!selectedUser && (
                    <>
                      {/* top identity */}
                      <div className="bg-black/50 border border-gray-800/60 rounded-3xl p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-14 h-14 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-300 text-2xl shrink-0">
                              <FaUserCircle />
                            </div>
                            <div className="min-w-0">
                              <div className="text-white font-black text-lg truncate">{safeText(selectedUser.name)}</div>
                              <div className="text-xs text-gray-500 truncate">{safeText(selectedUser.email)}</div>
                              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                                <Chip icon={<FaIdBadge />} text={`Level ${selectedUser.level ?? 0}`} />
                                <Chip icon={<FaCheck />} text={selectedUser.isActive ? "Active" : "Disabled"} />
                                <Chip icon={<FaCalendarAlt />} text={selectedUser.Join ? new Date(selectedUser.Join).toLocaleDateString() : "—"} />
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-[10px] uppercase tracking-wider text-gray-500">Total Earnings</div>
                            <div className="text-2xl font-black text-emerald-400">{money(selectedUser.totalEarnings)}</div>
                          </div>
                        </div>
                      </div>

                      {/* quick cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <MiniCard label="Level" value={String(selectedUser.level ?? "—")} />
                        <MiniCard label="ROI" value={money(selectedUser?.earnings?.roi)} valueClass="text-purple-300" />
                        <MiniCard
                          label="Referral"
                          value={money(selectedUser?.earnings?.referralCommission)}
                          valueClass="text-yellow-300"
                        />
                        <MiniCard
                          label="Team Share"
                          value={money(selectedUser?.earnings?.teamProfitShare)}
                          valueClass="text-sky-300"
                        />
                        <MiniCard label="Other" value={money(selectedUser?.earnings?.other)} valueClass="text-gray-200" />
                        <MiniCard label="Withdraw" value={safeText(selectedUser.Iswithdraw ? "ON" : "OFF")} />
                      </div>

                      {/* account */}
                      <Section title="Account">
                        <InfoRow label="Referral Code" value={safeText(selectedUser.referralCode)} mono />
                        <InfoRow
                          label="Wallet"
                          value={
                            <div className="flex items-center justify-end gap-2">
                              <span className="font-mono text-gray-200">{safeText(selectedUser.walletAddress)}</span>
                              {selectedUser.walletAddress && selectedUser.walletAddress !== "—" && (
                                <button
                                  type="button"
                                  onClick={() => copy(selectedUser.walletAddress)}
                                  className="w-8 h-8 rounded-xl bg-black/50 border border-gray-800/70 hover:border-yellow-500/40 text-gray-200 hover:text-yellow-300 transition flex items-center justify-center"
                                  title="Copy"
                                >
                                  <FaCopy className="text-xs" />
                                </button>
                              )}
                            </div>
                          }
                        />
                        <InfoRow label="Network" value={<span className="inline-flex items-center gap-2"><FaNetworkWired /> {safeText(selectedUser.network)}</span>} />
                        <InfoRow label="isActivePlan" value={safeText(selectedUser.isActivePlan ? "Yes" : "No")} />
                        <InfoRow label="Freeze" value={safeText(selectedUser.Freeze ? "Yes" : "No")} />
                      </Section>

                      {/* earnings breakdown */}
                      <Section title="Earnings Breakdown">
                        <div className="bg-black/40 border border-gray-800/60 rounded-2xl overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-black/50">
                              <tr className="text-xs uppercase tracking-wider text-gray-500">
                                <th className="text-left px-4 py-3">Type</th>
                                <th className="text-right px-4 py-3">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <BreakRow label="ROI" value={money(selectedUser?.earnings?.roi)} />
                              <BreakRow label="Team Profit Share" value={money(selectedUser?.earnings?.teamProfitShare)} />
                              <BreakRow
                                label="Referral Commission"
                                value={money(selectedUser?.earnings?.referralCommission)}
                              />
                              <BreakRow label="Other" value={money(selectedUser?.earnings?.other)} />
                            </tbody>
                          </table>
                        </div>
                      </Section>

                      {/* active plan */}
                      <Section title="Active Plan">
                        <div className="bg-black/40 border border-gray-800/60 rounded-2xl p-4">
                          {!selectedUser?.activePlan?.length ? (
                            <div className="text-gray-500 text-sm">No active plan record.</div>
                          ) : (
                            <div className="space-y-3">
                              {selectedUser.activePlan.slice(0, 4).map((p) => (
                                <div key={p._id} className="bg-black/40 border border-gray-800/60 rounded-2xl p-4">
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="text-white font-black truncate">{p.plan?.name || "Plan"}</div>
                                    <div className="text-[11px] text-gray-500 shrink-0">{safeText(p.date)}</div>
                                  </div>
                                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                    <SmallStat label="Amount" value={money(p.plan?.amount)} />
                                    <SmallStat label="Daily ROI %" value={`${p.plan?.dailyROIPct ?? 0}%`} />
                                    <SmallStat label="Total Profit" value={money(p.plan?.totalProfit)} />
                                    <SmallStat label="Closed" value={p.plan?.isClosed ? "Yes" : "No"} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Section>

                      {/* referrals */}
                      <Section title="Referrals">
                        <div className="bg-black/40 border border-gray-800/60 rounded-2xl overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-black/50">
                              <tr className="text-xs uppercase tracking-wider text-gray-500">
                                <th className="text-left px-4 py-3">#</th>
                                <th className="text-left px-4 py-3">UserId</th>
                                <th className="text-left px-4 py-3">Joined</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(selectedUser?.Referal || []).slice(0, 10).map((r, idx) => (
                                <tr key={idx} className="border-t border-gray-800/60">
                                  <td className="px-4 py-3 text-gray-400">{r.userNumber ?? idx + 1}</td>
                                  <td className="px-4 py-3 text-white font-mono truncate max-w-[220px]">
                                    {safeText(r.userId)}
                                  </td>
                                  <td className="px-4 py-3 text-gray-400">
                                    {r.joinedAt ? new Date(r.joinedAt).toLocaleDateString() : "—"}
                                  </td>
                                </tr>
                              ))}
                              {(!selectedUser?.Referal || selectedUser.Referal.length === 0) && (
                                <tr>
                                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                                    No referrals.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </Section>

                      {/* quick actions */}
                      <div className="bg-black/50 border border-gray-800/60 rounded-3xl p-5">
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-4">Quick Actions</div>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleClick(selectedUser)}
                            className={`px-4 py-3 rounded-2xl font-black transition border ${
                              selectedUser.isActive
                                ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                            }`}
                          >
                            {selectedUser.isActive ? "Suspend" : "Activate"}
                          </button>

                          <button
                            type="button"
                            onClick={() => copy(selectedUser.email)}
                            className="px-4 py-3 rounded-2xl bg-black/40 border border-gray-800/70 text-gray-200 font-black hover:border-yellow-500/40 hover:text-yellow-300 transition"
                          >
                            Copy Email
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-4 sm:p-6 border-t border-gray-800/70 bg-black/60">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="w-full py-3 rounded-2xl bg-black/40 border border-gray-800/70 text-gray-200 font-black hover:border-yellow-500/40 hover:text-yellow-300 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===== Small UI parts ===== */
function Field({ label, children }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">{label}</div>
      {children}
    </div>
  );
}

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

function Chip({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-2xl bg-black/40 border border-gray-800/60 text-gray-200">
      <span className="text-gray-400 text-[11px]">{icon}</span>
      <span className="text-[11px] font-bold">{text}</span>
    </span>
  );
}