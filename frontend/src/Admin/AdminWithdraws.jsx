import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaSyncAlt } from "react-icons/fa";
import { useAdmin } from "../context/AdminContext";

const Badge = ({ text }) => {
  const cls =
    text === "pending"
      ? "border-orange-500/40 text-orange-400 bg-orange-500/10"
      : text === "processing"
        ? "border-yellow-500/40 text-yellow-400 bg-yellow-500/10"
        : text === "approved" || text === "paid"
          ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
          : "border-red-500/40 text-red-400 bg-red-500/10";

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
    rejectWithdrawRequest,
  } = useAdmin();

  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchWithdrawRequests(status);
  }, [fetchWithdrawRequests, status]);

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
  if (addr.length <= 4) return addr;
  return `${addr.slice(0, 4)}••••••••`;
};

  return (
    <div className="pt-24 max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-4 mb-8">
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
            {["pending", "processing", "approved", "paid", "rejected", "failed"].map((s) => (
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
          className="w-full bg-black/50 border border-gray-700/60 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-yellow-500/60"
        />
      </div>



      <div className="bg-black/40 border border-yellow-500/20 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-12 py-4 text-xs font-bold text-yellow-400 uppercase border-b border-yellow-500/15">
          <div className="col-span-3">User</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-3">Wallet</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-gray-400">No requests found.</div>
        ) : (
          filtered.map((w) => {
            const u = w.userId || {};
            return (
              <div
                key={w._id}
                className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-gray-800/60 hover:bg-white/5 transition"
              >
                <div className="col-span-3">
                  <div className="text-white font-bold">{u.name || "—"}</div>
                  <div className="text-xs text-gray-400">{u.email || ""}</div>
                </div>

                <div className="col-span-2">
                  <div className="text-emerald-400 font-black text-lg">${Number(w.amount || 0).toFixed(2)}</div>
                  <div className="text-xs text-gray-400">{w.asset} • {w.network}</div>
                </div>

                <div className="col-span-3">
<div className="text-xs text-gray-300 font-mono">
  {maskWallet(w.toAddress)}
</div>
                </div>

                <div className="col-span-2 flex items-center">
                  <Badge text={w.status} />
                </div>

                <div className="col-span-2 flex justify-end gap-2">
  {(w.status === "pending" || w.status === "failed") ? (
    <>
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => approveWithdrawRequest(w._id)}
        className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 flex items-center justify-center"
        title="Approve"
        type="button"
      >
        <FaCheckCircle className="w-5 h-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => rejectWithdrawRequest(w._id, "Rejected by admin")}
        className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/20 flex items-center justify-center"
        title="Reject"
        type="button"
      >
        <FaTimesCircle className="w-5 h-5" />
      </motion.button>
    </>
  ) : (
    <span className="text-xs text-gray-500">—</span>
  )}
</div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
