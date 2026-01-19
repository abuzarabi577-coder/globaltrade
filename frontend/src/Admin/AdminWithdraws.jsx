import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaSyncAlt, FaCopy } from "react-icons/fa";
import { useAdmin } from "../context/AdminContext";
import Alert from "../components/Alert";

const Badge = ({ text }) => {
  const cls =
    text === "pending"
      ? "border-orange-500/40 text-orange-400 bg-orange-500/10"
      : text === "processing"
        ? "border-yellow-500/40 text-yellow-400 bg-yellow-500/10"
        : text === "processed" || text === "paid"
          ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
          : "border-green-500/40 text-red-400 bg-red-500/10";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${cls}`}>
      {text}
    </span>
  );
};

export default function AdminWithdraws() {
  const {
    withdraws,
    fetchWithdrawRequests,
    approveWithdrawRequest,
    rejectWithdrawRequest,showAlert,alert
  } = useAdmin();

  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");
  
  // Modal states
  const [showConfirm, setShowConfirm] = useState({ show: false, id: null, type: null });

  useEffect(() => {
    fetchWithdrawRequests(status);
  }, [fetchWithdrawRequests, status]);

  // Copy to Clipboard Logic
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showAlert('success',"Wallet Adress copied")
  };

  // Confirm Actions
  const handleAction = async () => {
    const { id, type } = showConfirm;
    if (type === "approve") {
      await approveWithdrawRequest(id);
    } else {
      await rejectWithdrawRequest(id, "Rejected by admin");
    }
    setShowConfirm({ show: false, id: null, type: null });
  };

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return withdraws;

    return withdraws.filter((w) => {
      const u = w.userId || {};
      return (
        String(u.name || "").toLowerCase().includes(s) ||
        String(u.email || "").toLowerCase().includes(s) ||
        String(w.toAddress || "").toLowerCase().includes(s) ||
        String(w._id || "").toLowerCase().includes(s)
      );
    });
  }, [withdraws, search]);

  const maskWallet = (addr = "") => {
    if (!addr) return "—";
    if (addr.length <= 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4">
      {/* --- Confirm Popup Modal --- */}
        <Alert
                  type={alert.type} 
                  message={alert.message} 
                  isOpen={alert.isOpen}
                  onClose={() => showAlert({ isOpen: false, type: '', message: '' })}
                />
      <AnimatePresence>
        {showConfirm.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-yellow-500/20 p-8 rounded-3xl max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-2 italic">Are you sure?</h3>
              <p className="text-gray-400 text-sm mb-6">
                Do you want to <span className={showConfirm.type === 'approve' ? 'text-emerald-400' : 'text-red-400'}>{showConfirm.type}</span> this withdrawal request?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirm({ show: false, id: null, type: null })}
                  className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAction}
                  className={`flex-1 py-3 rounded-xl font-bold text-black ${showConfirm.type === 'approve' ? 'bg-emerald-500' : 'bg-red-500'}`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-white">Withdraw Requests</h1>
          <p className="text-gray-400 mt-2">Approve / Reject user withdrawals</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-black/60 border border-yellow-500/30 rounded-2xl px-4 py-3 text-sm text-white outline-none"
          >
            {["pending", "processing", 'processed', "rejected", "failed"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fetchWithdrawRequests(status)}
            className="px-5 py-3 rounded-2xl bg-yellow-500 text-black font-black flex items-center gap-2"
          >
            <FaSyncAlt /> Refresh
          </motion.button>
        </div>
      </div>

      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user name, email, address, request id..."
          className="w-full bg-black/50 border border-gray-700/60 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-yellow-500/60 transition-all"
        />
      </div>

      <div className="bg-black/40 border border-yellow-500/20 rounded-3xl overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-12 gap-4 px-8 py-4 text-xs font-bold text-yellow-400 uppercase border-b border-yellow-500/15">
            <div className="col-span-3">User</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-3">Wallet Address</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500 italic">No requests found.</div>
          ) : (
            filtered.map((w) => {
              const u = w.userId || {};
              return (
                <div
                  key={w._id}
                  className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-gray-800/60 hover:bg-white/5 transition items-center"
                >
                  <div className="col-span-3">
                    <div className="text-white font-bold">{u.name || "—"}</div>
                    <div className="text-xs text-gray-500 truncate">{u.email || ""}</div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-emerald-400 font-black text-lg">${Number(w.amountUSD || 0).toFixed(2)}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-tighter">{w.asset} • {w.network}</div>
                  </div>

                  <div className="col-span-3">
                    <div className="flex items-center gap-2 group">
                      <span className="text-xs text-gray-300 font-mono">
                        {maskWallet(w.toAddress)}
                      </span>
                      {w.toAddress && (
                        <button 
                          onClick={() => copyToClipboard(w.toAddress)}
                          className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all"
                          title="Copy Address"
                        >
                          <FaCopy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Badge text={w.status} />
                  </div>

                  <div className="col-span-2 flex justify-end gap-2">
                    {(w.status === "pending" || w.status === "failed") ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowConfirm({ show: true, id: w._id, type: "approve" })}
                          className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center"
                          title="Approve"
                        >
                          <FaCheckCircle className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowConfirm({ show: true, id: w._id, type: "reject" })}
                          className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center"
                          title="Reject"
                        >
                          <FaTimesCircle className="w-5 h-5" />
                        </motion.button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-600 font-medium italic">Handled</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}