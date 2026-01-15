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
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n || 0));

export default function Leaderboard() {
  const { fetchLeaderboard, leaderboardUsers, leaderboardError, adminLoading } = useAdmin();

  useEffect(() => {
    fetchLeaderboard(50);
  }, [fetchLeaderboard]);

  const top3 = useMemo(() => leaderboardUsers.slice(0, 3), [leaderboardUsers]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(75,85,99,0.35)_1px,transparent_1px),linear-gradient(rgba(75,85,99,0.35)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 space-y-8">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-4xl md:text-5xl font-black">
              Leaderboard <span className="text-yellow-500">Top Traders</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Ranking is based on <span className="text-gray-200 font-bold">Level</span> then{" "}
              <span className="text-gray-200 font-bold">Total Earnings</span>.
            </p>
          </div>
        </div>

        {/* loading / error */}
        {adminLoading && (
          <div className="bg-black/50 border border-gray-800/60 rounded-2xl p-4 text-gray-300">
            Loading leaderboard...
          </div>
        )}

        {!adminLoading && leaderboardError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-2xl p-4">
            {leaderboardError}
          </div>
        )}

        {/* Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {top3.map((u, idx) => (
            <motion.div
              key={u._id || idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/50 border border-gray-800/60 rounded-3xl p-6 relative overflow-hidden"
            >
              <div className="absolute -top-14 -right-14 w-40 h-40 rounded-[40px] bg-yellow-500/10 blur-2xl" />

              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-gray-500">Rank</div>
                <div className={`text-xs font-black px-3 py-1 rounded-2xl border ${badge(u.rank?.title)}`}>
                  {u.rank?.title || "—"}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-300 font-black">
                  {(u.name || "U").slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <div className="text-white font-black text-lg">{u.name || "—"}</div>
                  <div className="text-xs text-gray-500">Position #{u.rank?.position || idx + 1}</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="bg-black/40 border border-gray-800/60 rounded-2xl p-3">
                  <div className="text-[10px] uppercase tracking-wider text-gray-500">Level</div>
                  <div className="text-xl font-black text-white mt-1">{u.level ?? 0}</div>
                </div>
                <div className="bg-black/40 border border-gray-800/60 rounded-2xl p-3">
                  <div className="text-[10px] uppercase tracking-wider text-gray-500">Earnings</div>
                  <div className="text-xl font-black text-green-400 mt-1">{money(u.totalEarnings)}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full table */}
        <div className="bg-black/60 border border-gray-800/60 rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800/60">
            <div className="text-sm font-black text-white">Top Rankings</div>
            <div className="text-xs text-gray-500 mt-1">Auto-calculated & saved inside user profile</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/40">
                <tr className="text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-4 font-semibold">#</th>
                  <th className="text-left px-6 py-4 font-semibold">User</th>
                  <th className="text-left px-6 py-4 font-semibold">Tier</th>
                  <th className="text-left px-6 py-4 font-semibold">Level</th>
                  <th className="text-left px-6 py-4 font-semibold">Total Earnings</th>
                </tr>
              </thead>

              <tbody>
                {leaderboardUsers.map((u, i) => (
                  <tr key={u._id || i} className="border-t border-gray-800/50 hover:bg-white/[0.03] transition">
                    <td className="px-6 py-4 text-gray-300 font-bold">{u.rank?.position || i + 1}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-black/40 border border-gray-800/60 flex items-center justify-center text-gray-200 font-black">
                          {(u.name || "U").slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{u.name || "—"}</div>
                          <div className="text-xs text-gray-500">{u.email || ""}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-xs font-black px-3 py-1 rounded-2xl border ${badge(u.rank?.title)}`}>
                        {u.rank?.title || "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-white font-bold">{u.level ?? 0}</td>
                    <td className="px-6 py-4 text-green-400 font-black">{money(u.totalEarnings)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!adminLoading && !leaderboardUsers.length && !leaderboardError && (
              <div className="px-6 py-10 text-center text-gray-500">No leaderboard data found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
