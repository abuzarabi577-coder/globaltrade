import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";

const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n || 0));

const badge = (title) => {
  if (title === "PLATINUM") return "bg-indigo-500/15 border-indigo-500/30 text-indigo-300";
  if (title === "GOLD") return "bg-yellow-500/15 border-yellow-500/30 text-yellow-300";
  if (title === "SILVER") return "bg-gray-400/10 border-gray-600/40 text-gray-200";
  return "bg-amber-500/10 border-amber-500/20 text-amber-200";
};

const crownGlow = (pos) => {
  if (pos === 1) return "from-yellow-500/20 to-yellow-500/0";
  if (pos === 2) return "from-gray-300/15 to-gray-300/0";
  if (pos === 3) return "from-amber-500/15 to-amber-500/0";
  return "from-white/0 to-white/0";
};

export default function PublicTopRankers({ limit = 10 }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setErr("");

        // ✅ base URL adjust if you use axios instance; this works with proxy too
        const res = await fetch(`https://api.1cglobal.cc/api/user/leaderboard/top?limit=${limit}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!mounted) return;
        if (!res.ok || !data?.success) throw new Error(data?.message || "Failed to load leaderboard");

        setUsers(Array.isArray(data.users) ? data.users : []);
      } catch (e) {
        if (!mounted) return;
        setErr(e.message);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [limit]);

  const top3 = useMemo(() => users.slice(0, 3), [users]);

  return (
    <section className="bg-black/40 border border-gray-800/60 backdrop-blur-xl rounded-3xl p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-500">Public Leaderboard</div>
          <h2 className="text-2xl md:text-4xl font-black text-white mt-1">
            Top <span className="text-yellow-400">Rankers</span>
          </h2>
          <p className="text-sm text-gray-400 mt-2 max-w-2xl">
            Ranking is based on Level first, then Total Earnings.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs font-black">
          <FaTrophy /> TOP {limit}
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="bg-black/40 border border-gray-800/60 rounded-2xl p-4 text-gray-300">
          Loading top rankers...
        </div>
      )}

      {!loading && err && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-2xl p-4">
          {err}
        </div>
      )}

      {!loading && !err && (
        <>
          {/* ✅ Top 3 Cards (compact + responsive) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3.map((u, idx) => {
              const pos = Number(u?.rank?.position || idx + 1);

              return (
                <motion.div
                  key={u._id || idx}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="relative overflow-hidden bg-black/45 border border-gray-800/60 rounded-3xl p-5"
                >
                  <div className={`absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br ${crownGlow(pos)} rounded-full blur-2xl`} />

                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-wider text-gray-500">Rank</div>
                    <div className={`text-xs font-black px-3 py-1 rounded-2xl border ${badge(u?.rank?.title)}`}>
                      {u?.rank?.title || "—"}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-300 font-black">
                      {(u?.name || "U").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-black text-lg truncate">{u?.name || "—"}</div>
                      <div className="text-xs text-gray-500">Position #{pos}</div>
                    </div>

                    <div className="ml-auto text-right">
                      <div className="text-xs text-gray-500">Level</div>
                      <div className="text-lg font-black text-white leading-none">{u?.level ?? 0}</div>
                    </div>
                  </div>

                  <div className="mt-4 bg-black/35 border border-gray-800/60 rounded-2xl p-3">
                    <div className="text-[10px] uppercase tracking-wider text-gray-500">Total Earnings</div>
                    <div className="text-lg font-black text-green-400 mt-1">{money(u?.totalEarnings)}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ✅ Top 10 Table */}
          <div className="mt-6 bg-black/55 border border-gray-800/60 rounded-3xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800/60">
              <div className="text-sm font-black text-white">Top {limit} Rankings</div>
              <div className="text-xs text-gray-500 mt-1">Updated based on saved rank positions.</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black/40">
                  <tr className="text-gray-400 text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-4 font-semibold">#</th>
                    <th className="text-left px-5 py-4 font-semibold">User</th>
                    <th className="text-left px-5 py-4 font-semibold">Tier</th>
                    <th className="text-left px-5 py-4 font-semibold">Level</th>
                    <th className="text-left px-5 py-4 font-semibold">Total Earnings</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id || i} className="border-t border-gray-800/50 hover:bg-white/[0.03] transition">
                      <td className="px-5 py-4 text-gray-300 font-bold">{u?.rank?.position || i + 1}</td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-black/40 border border-gray-800/60 flex items-center justify-center text-gray-200 font-black">
                            {(u?.name || "U").slice(0, 1).toUpperCase()}
                          </div>
                          <div className="text-white font-semibold truncate max-w-[220px]">
                            {u?.name || "—"}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`text-xs font-black px-3 py-1 rounded-2xl border ${badge(u?.rank?.title)}`}>
                          {u?.rank?.title || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-white font-bold">{u?.level ?? 0}</td>
                      <td className="px-5 py-4 text-green-400 font-black">{money(u?.totalEarnings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!users.length && (
                <div className="px-5 py-10 text-center text-gray-500">No leaderboard data found.</div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}