// Wallet.jsx - FIXED Full Wallet Dashboard (no "w is not defined" + no setState in render)
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

const Wallet = () => {
  const [activeTab, setActiveTab] = useState("balance");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const {
    FetchUserData,
    HandleFetchUserData,
    createWithdraw,
    withdrawHistory,
    fetchWithdrawHistory,
    loading,
    setloading,
  } = useAppContext();

  // ✅ Fetch user once
  useEffect(() => {
    HandleFetchUserData();
  }, [HandleFetchUserData]);

  // ✅ Loading state synced (NO setState in render)
  useEffect(() => {
    if (typeof setloading === "function") {
      setloading(!FetchUserData);
    }
  }, [FetchUserData, setloading]);

  // ✅ Withdraw fee (10%) + final amount (net)
  const withdrawNum = useMemo(() => Number(withdrawAmount || 0), [withdrawAmount]);
  const user = FetchUserData || {};
  const availableBalance = Number(user?.totalEarnings || 0);

  const withdrawFee = useMemo(() => {
    const fee = withdrawNum * 0.1;
    return Number.isFinite(fee) ? fee : 0;
  }, [withdrawNum]);

  const withdrawFinal = useMemo(() => {
    const net = withdrawNum - withdrawFee;
    return Number.isFinite(net) ? net : 0;
  }, [withdrawNum, withdrawFee]);

  const canWithdraw = useMemo(() => {
    if (!withdrawAmount) return false;
    if (!Number.isFinite(withdrawNum)) return false;
    if (withdrawNum < 20) return false; // ✅ min rule
    if (withdrawNum > Number(FetchUserData?.totalEarnings || 0)) return false; // ✅ available
    return true;
  }, [withdrawAmount, withdrawNum, FetchUserData]);

  const maskWallet = (addr = "") => {
    if (!addr) return "—";
    if (addr.length <= 4) return addr;
    return `${addr.slice(0, 4)}••••••••`;
  };

  // ✅ Fetch withdraw history only when tab opened
  useEffect(() => {
    if (activeTab === "history") {
      fetchWithdrawHistory?.();
    }
  }, [activeTab, fetchWithdrawHistory]);

  // ✅ Sum of pending + processing withdrawals
  const pendingSum = useMemo(() => {
    const list = Array.isArray(withdrawHistory) ? withdrawHistory : [];
    return list
      .filter((w) =>
        ["pending", "processing"].includes(String(w?.status || "").toLowerCase())
      )
      .reduce((sum, w) => sum + Number(w?.amount || w?.amountUSD || 0), 0);
  }, [withdrawHistory]);

  const handleWithdraw = () => {
    // ✅ backend ko amount bhejo (aap backend me fee deduct karo ya yahin se net bhejna ho to withdrawFinal bhej do)
    createWithdraw?.(withdrawAmount);
  };

  return (
    <div className="min-h-full pt-0 pb-24 bg-gradient-to-br from-slate-900 via-black to-slate-950 text-white">
      {/* HEADER */}
      <div className="px-6 pt-32 pb-6 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl">
          <span className="text-3xl font-black">💰</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
          Your Wallet
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          Manage earnings & withdrawals
        </p>
      </div>

      {/* BALANCE CARDS */}
      <div className="px-6 mb-8 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 text-center shadow-2xl"
        >
          <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-2">
            ${Number(availableBalance || 0).toFixed(2)}
          </div>
          <div className="text-slate-400 text-sm uppercase tracking-wider font-semibold">
            Available Balance
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/40 rounded-2xl p-5 text-center backdrop-blur-xl hover:shadow-emerald-500/30 transition-all"
          >
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              ${Number(FetchUserData?.WithdrwalAmt || 0).toFixed(2)}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">
              Withdrawal
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-2 border-orange-500/40 rounded-2xl p-5 text-center backdrop-blur-xl hover:shadow-orange-500/30 transition-all"
          >
            <div className="text-2xl font-bold text-orange-400 mb-1">
              ${Number(pendingSum || 0).toFixed(2)}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">
              Pending
            </div>
          </motion.div>
        </div>
      </div>

      {/* TABS */}
      <div className="px-6 mb-8">
        <div className="flex bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-xl">
          {[
            { id: "balance", label: "Balance", icon: "💰" },
            { id: "history", label: "History", icon: "📊" },
            { id: "withdraw", label: "Withdraw", icon: "📤" },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-6 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 shadow-lg shadow-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.icon} {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="px-6 space-y-6 pb-0">
        {/* BALANCE TAB */}
        {activeTab === "balance" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center shadow-2xl">
              <h3 className="text-xl font-bold text-slate-200 mb-4">
                Quick Stats
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-black text-emerald-400 mb-1">
                    {Number(FetchUserData?.TotalPoints || 0)}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">
                    Total Points
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-black text-orange-400 mb-1">
                    {Number(FetchUserData?.earnings?.referralCommission || 0)}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">
                    Referal Earning
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-black text-purple-400 mb-1">
                    {Number(FetchUserData?.earnings?.roi || 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">
                    ROI Earning
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                Withdraw History
                <span className="text-emerald-400 text-sm font-bold">Live</span>
              </h3>

              {(Array.isArray(withdrawHistory) ? withdrawHistory : []).length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 text-slate-400">
                  No withdrawals yet.
                </div>
              ) : (
                (Array.isArray(withdrawHistory) ? withdrawHistory : []).map((w, idx) => {
                  const status = String(w?.status || "").trim().toLowerCase();

                  const statusColor =
                    status === "pending" || status === "processing"
                      ? "text-orange-400"
                      : ["approved", "paid", "processed", "completed", "success"].includes(status)
                      ? "text-emerald-400"
                      : "text-red-400";

                  const boxColor =
                    status === "pending" || status === "processing"
                      ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
                      : ["approved", "paid", "processed", "completed", "success"].includes(status)
                      ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-400"
                      : "bg-red-500/15 border-red-500/35 text-red-400";

                  return (
                    <motion.div
                      key={w?._id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 hover:bg-slate-800/50 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold border-2 ${boxColor}`}>
                          ↓
                        </div>

                        <div>
                          <div className="font-bold text-slate-200">Withdrawal</div>
                          <div className="text-xs text-slate-500">
                            #{String(w?._id || "").slice(-6)} •{" "}
                            {w?.createdAt ? new Date(w.createdAt).toLocaleString() : "—"}
                          </div>
                          <div className="text-xs text-slate-400">
                            {w?.asset || "—"} • {w?.network || "—"} • {maskWallet(w?.toAddress)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-black text-orange-400">
                          -${Number(w?.amount || 0).toFixed(2)}
                        </div>
                        <div className={`text-xs font-bold ${statusColor}`}>
                          {status || "unknown"}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

        {/* WITHDRAW TAB */}
        {activeTab === "withdraw" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-slate-100 mb-8 text-center">
                Withdraw Earnings
              </h3>

              <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-emerald-500/30 rounded-3xl p-8 mb-6 text-center">
                <div className="text-3xl font-black text-emerald-400 mb-2">
                  ${Number(FetchUserData?.totalEarnings || 0).toFixed(2)}
                </div>
                <div className="text-slate-400 text-sm uppercase tracking-wider">
                  Available for Withdrawal
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="20"
                    max={Number(FetchUserData?.totalEarnings || 0)}
                    step="0.01"
                    className="w-full p-4 bg-slate-900/80 border-2 border-slate-700/50 rounded-2xl text-xl font-bold text-white focus:border-emerald-500/70 focus:outline-none backdrop-blur-xl transition-all"
                  />
                </div>
              </div>

              {/* Fee breakdown */}
              <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 font-semibold">Selected Amount</span>
                  <span className="text-white font-black">${withdrawNum.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-slate-400 font-semibold">Fee (10%)</span>
                  <span className="text-orange-400 font-black">-${withdrawFee.toFixed(2)}</span>
                </div>

                <div className="h-px bg-slate-700/60 my-3" />

                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-bold">Final Amount (You Receive)</span>
                  <span className="text-emerald-400 text-xl font-black">
                    ${withdrawFinal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="py-4">
                <motion.button
                  onClick={handleWithdraw}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-slate-900 font-black text-xl rounded-3xl shadow-2xl hover:shadow-emerald-500/50 border-2 border-emerald-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!canWithdraw || !!loading}
                >
                  🚀 Withdraw ${withdrawFinal.toFixed(2)}
                </motion.button>
              </div>

            <div className="mt-6 text-xs text-slate-500 text-center space-y-1">
  <p>• Minimum: $20</p>

  <p className="text-emerald-400 font-bold">
    • Withdraw requests: Only on 1st & 15th of each month
  </p>

  <p>• Processing: 24-48 hours</p>
</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wallet;