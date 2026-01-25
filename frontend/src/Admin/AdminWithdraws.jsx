import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaSyncAlt, FaCopy } from "react-icons/fa";
import { useAdmin } from "../context/AdminContext";
import Alert from "../components/Alert";

/* ---------- Badge ---------- */
const Badge = ({ text }) => {
  const cls =
    text === "pending"
      ? "border-orange-500/40 text-orange-400 bg-orange-500/10"
      : text === "processing"
      ? "border-yellow-500/40 text-yellow-400 bg-yellow-500/10"
      : text === "processed" || text === "paid"
      ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
      : "border-red-500/40 text-red-400 bg-red-500/10";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${cls}`}>
      {text}
    </span>
  );
};

/* ---------- Component ---------- */
export default function AdminWithdraws() {
  const {
    withdraws,
    fetchWithdrawRequests,
    approveWithdrawRequest,
    rejectWithdrawRequest,
    showAlert,
    alert,
  } = useAdmin();

  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState({
    show: false,
    id: null,
    type: null,
  });

  useEffect(() => {
    fetchWithdrawRequests(status);
  }, [status, fetchWithdrawRequests]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showAlert("success", "Wallet address copied");
  };

  const handleAction = async () => {
    if (showConfirm.type === "approve") {
      await approveWithdrawRequest(showConfirm.id);
    } else {
      await rejectWithdrawRequest(showConfirm.id, "Rejected by admin");
    }
    setShowConfirm({ show: false, id: null, type: null });
  };

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    if (!s) return withdraws;
    return withdraws.filter((w) => {
      const u = w.userId || {};
      return (
        u.name?.toLowerCase().includes(s) ||
        u.email?.toLowerCase().includes(s) ||
        w.toAddress?.toLowerCase().includes(s) ||
        w._id?.toLowerCase().includes(s)
      );
    });
  }, [withdraws, search]);

  const maskWallet = (addr = "") =>
    addr.length > 10 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4">
      <Alert {...alert} onClose={() => showAlert({ isOpen: false })} />

      {/* ---------- Confirm Modal ---------- */}
      <AnimatePresence>
        {showConfirm.show && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] p-6 rounded-2xl w-full max-w-sm border border-yellow-500/20"
            >
              <h3 className="text-lg font-bold text-white mb-2">
                Confirm action
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Are you sure you want to{" "}
                <span
                  className={
                    showConfirm.type === "approve"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }
                >
                  {showConfirm.type}
                </span>{" "}
                this request?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setShowConfirm({ show: false, id: null, type: null })
                  }
                  className="flex-1 py-2 rounded-xl bg-gray-800 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  className={`flex-1 py-2 rounded-xl font-bold ${
                    showConfirm.type === "approve"
                      ? "bg-emerald-500 text-black"
                      : "bg-red-500 text-black"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------- Header ---------- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Withdraw Requests</h1>
          <p className="text-gray-400 text-sm">
            Approve or reject withdrawals
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-black border border-yellow-500/30 rounded-xl px-4 py-2 text-white"
          >
            {["pending", "processing", "processed", "rejected", "failed"].map(
              (s) => (
                <option key={s}>{s}</option>
              )
            )}
          </select>

          <button
            onClick={() => fetchWithdrawRequests(status)}
            className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-bold flex items-center gap-2"
          >
            <FaSyncAlt /> Refresh
          </button>
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search withdrawals..."
        className="w-full mb-6 bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white"
      />

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-black/40 border border-yellow-500/20 rounded-3xl overflow-x-auto">
        <div className="min-w-[900px]">
          {filtered.map((w) => {
            const u = w.userId || {};
            return (
              <div
                key={w._id}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-800 items-center"
              >
                <div className="col-span-3">
                  <div className="text-white font-bold">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </div>

                <div className="col-span-2 text-emerald-400 font-bold">
                  ${Number(w.amountUSD).toFixed(2)}
                </div>

                <div className="col-span-3 flex items-center gap-2">
                  <span className="font-mono text-xs text-gray-300">
                    {maskWallet(w.toAddress)}
                  </span>
                  <FaCopy
                    onClick={() => copyToClipboard(w.toAddress)}
                    className="cursor-pointer text-gray-400 hover:text-yellow-500"
                  />
                </div>

                <div className="col-span-2">
                  <Badge text={w.status} />
                </div>

                <div className="col-span-2 flex justify-end gap-2">
                  {(w.status === "pending" || w.status === "failed") && (
                    <>
                      <FaCheckCircle
                        onClick={() =>
                          setShowConfirm({
                            show: true,
                            id: w._id,
                            type: "approve",
                          })
                        }
                        className="text-emerald-400 cursor-pointer"
                      />
                      <FaTimesCircle
                        onClick={() =>
                          setShowConfirm({
                            show: true,
                            id: w._id,
                            type: "reject",
                          })
                        }
                        className="text-red-400 cursor-pointer"
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {filtered.map((w) => {
          const u = w.userId || {};
          return (
            <div
              key={w._id}
              className="bg-black/50 border border-gray-800 rounded-2xl p-4"
            >
              <div className="flex justify-between mb-2">
                <div>
                  <p className="text-white font-bold">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <Badge text={w.status} />
              </div>

              <p className="text-emerald-400 font-black mb-2">
                ${Number(w.amountUSD).toFixed(2)}
              </p>

              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-gray-400">
                  {maskWallet(w.toAddress)}
                </span>
                <FaCopy
                  onClick={() => copyToClipboard(w.toAddress)}
                  className="text-gray-400"
                />
              </div>

              {(w.status === "pending" || w.status === "failed") && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() =>
                      setShowConfirm({
                        show: true,
                        id: w._id,
                        type: "approve",
                      })
                    }
                    className="flex-1 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      setShowConfirm({
                        show: true,
                        id: w._id,
                        type: "reject",
                      })
                    }
                    className="flex-1 py-2 bg-red-500/10 text-red-400 rounded-xl"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
