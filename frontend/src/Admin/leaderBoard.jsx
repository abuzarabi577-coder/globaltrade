import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useAdmin } from "../context/AdminContext";

const badge = (title) => {
  if (title === "PLATINUM") return "bg-indigo-500/15 border-indigo-500/30 text-indigo-300";
  if (title === "GOLD") return "bg-yellow-500/15 border-yellow-500/30 text-yellow-300";
  if (title === "SILVER") return "bg-gray-400/10 border-gray-600/40 text-gray-200";
  return "bg-amber-500/10 border-amber-500/20 text-amber-200";
};

const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(n || 0));

export default function Leaderboard() {
  const { fetchLeaderboard, leaderboardUsers, leaderboardError, adminLoading } = useAdmin();

  useEffect(() => {
    fetchLeaderboard(50);
  }, [fetchLeaderboard]);

  const top3 = useMemo(() => leaderboardUsers.slice(0, 3), [leaderboardUsers]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-20 space-y-10">
        {/* ---------- Header ---------- */}
        <div>
          <h1 className="text-3xl md:text-5xl font-black">
            Leaderboard <span className="text-yellow-500">Top Traders</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Ranking based on <b>Level</b> then <b>Total Earnings</b>
          </p>
        </div>

        {/* ---------- Loading / Error ---------- */}
        {adminLoading && (
          <div className="bg-black/50 border border-gray-800 rounded-2xl p-4 text-gray-300">
            Loading leaderboard...
          </div>
        )}

        {!adminLoading && leaderboardError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-2xl p-4">
            {leaderboardError}
          </div>
        )}

        {/* ---------- Top 3 ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {top3.map((u, idx) => (
            <motion.div
              key={u._id || idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/50 border border-gray-800 rounded-3xl p-6 relative"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 uppercase">Rank</span>
                <span className={`text-xs font-black px-3 py-1 rounded-2xl border ${badge(u.rank?.title)}`}>
                  {u.rank?.title || "—"}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center font-black text-yellow-300">
                  {(u.name || "U").slice(0, 1)}
                </div>
                <div>
                  <div className="font-black text-lg">{u.name || "—"}</div>
                  <div className="text-xs text-gray-500">
                    Position #{u.rank?.position || idx + 1}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-black/40 border border-gray-800 rounded-2xl p-3">
                  <div className="text-[10px] text-gray-500 uppercase">Level</div>
                  <div className="text-xl font-black">{u.level ?? 0}</div>
                </div>
                <div className="bg-black/40 border border-gray-800 rounded-2xl p-3">
                  <div className="text-[10px] text-gray-500 uppercase">Earnings</div>
                  <div className="text-xl font-black text-green-400">
                    {money(u.totalEarnings)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block bg-black/60 border border-gray-800 rounded-3xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/40 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 text-left">#</th>
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Tier</th>
                <th className="px-6 py-4 text-left">Level</th>
                <th className="px-6 py-4 text-left">Total Earnings</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardUsers.map((u, i) => (
                <tr key={u._id || i} className="border-t border-gray-800 hover:bg-white/[0.03]">
                  <td className="px-6 py-4 font-bold text-gray-300">
                    {u.rank?.position || i + 1}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-black/40 border border-gray-800 flex items-center justify-center font-black">
                        {(u.name || "U").slice(0, 1)}
                      </div>
                      <div>
                        <div className="font-semibold">{u.name || "—"}</div>
                        <div className="text-xs text-gray-500">{u.email || ""}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`text-xs font-black px-3 py-1 rounded-2xl border ${badge(u.rank?.title)}`}>
                      {u.rank?.title || "—"}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-bold">{u.level ?? 0}</td>
                  <td className="px-6 py-4 font-black text-green-400">
                    {money(u.totalEarnings)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden space-y-4">
          {leaderboardUsers.map((u, i) => (
            <div key={u._id || i} className="bg-black/50 border border-gray-800 rounded-2xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold">{u.name || "—"}</div>
                  <div className="text-xs text-gray-500">{u.email || ""}</div>
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-2xl border ${badge(u.rank?.title)}`}>
                  {u.rank?.title || "—"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center mt-3">
                <div>
                  <div className="text-xs text-gray-500">Rank</div>
                  <div className="font-black">{u.rank?.position || i + 1}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Level</div>
                  <div className="font-black">{u.level ?? 0}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Earnings</div>
                  <div className="font-black text-green-400">
                    {money(u.totalEarnings)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!adminLoading && !leaderboardUsers.length && (
          <div className="text-center text-gray-500">No leaderboard data found.</div>
        )}
      </div>
    </div>
  );
}
