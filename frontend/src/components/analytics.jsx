import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaCoins,
  FaStar,
  FaCrown,
  FaUsers,
  FaBolt,
  FaWallet,
  FaCheckCircle,
} from "react-icons/fa";
import { useAppContext } from "../context/AppContext";

const fmt2 = (n) => Number(n || 0).toFixed(2);

const PLAN_LABELS = {
  plan1: "Core Growth",
  plan2: "Institutional Blend",
  plan3: "Founder’s Syndicate",
};

export default function Analytics() {
  const { FetchUserData, HandleFetchUserData } = useAppContext();

  useEffect(() => {
    HandleFetchUserData?.();
  }, [HandleFetchUserData]);

  const stats = useMemo(() => {
    const u = FetchUserData || {};
    const earnings = u.earnings || {};

    const activePlanArr = Array.isArray(u.activePlan) ? u.activePlan : [];
    const last = activePlanArr.length ? activePlanArr[activePlanArr.length - 1] : null;
    const plan = last?.plan || null;

    const rawPlanName = String(plan?.name || "").toLowerCase().trim();
    const planName = PLAN_LABELS[rawPlanName] || plan?.name || "Inactive";

    const todayDone = Number(u?.todayTasksCompleted ?? 0);
    const totalTasks = 5;
    const progressPct = Math.max(0, Math.min(100, (todayDone / totalTasks) * 100));

    const principal = Number(plan?.amount || 0);
    const dailyROIPct = Number(plan?.dailyROIPct || 0);
    const todayRoiEstimate = principal > 0 ? (principal * dailyROIPct) / 100 : 0;

    const totalEarnings = Number(u.totalEarnings || 0);

    const roi = Number(earnings.roi || 0);
    const referral = Number(earnings.referralCommission || 0);
    const team = Number(earnings.teamProfitShare || 0);
    const other = Number(earnings.other || 0);

    const parts = [
      { key: "roi", label: "ROI Earnings", value: roi },
      { key: "ref", label: "Referral Commission", value: referral },
      { key: "team", label: "Team Profit Share", value: team },
      { key: "other", label: "Other", value: other },
    ];

    const sumParts = parts.reduce((s, x) => s + x.value, 0) || 1;

    const credits = Array.isArray(plan?.credits) ? plan.credits : [];
    const recentCredits = credits.slice(-5).reverse();

    return {
      name: u.name || "Investor",
      level: Number(u.level || 0),
      points: Number(u.TotalPoints || 0),

      totalEarnings,
      roi,
      referral,
      team,
      other,

      planActive: !!u.isActivePlan,
      planName,
      principal,
      dailyROIPct,
      todayRoiEstimate,
      planProfit: Number(plan?.totalProfit || 0),

      todayDone,
      totalTasks,
      progressPct,

      parts,
      sumParts,
      recentCredits,
    };
  }, [FetchUserData]);

  return (
    <div className="w-full mt-14 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* ✅ responsive padding + not forcing min-h-screen on small phones */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-16 sm:pb-28 space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl">
            Track your performance, earnings breakdown, ROI progress and daily
            task completion.
          </p>
        </motion.div>

        {/* Top KPIs */}
        {/* ✅ 1 col mobile, 2 col tablets, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <KpiCard
            title="Total Earnings"
            value={`$${fmt2(stats.totalEarnings)}`}
            icon={FaCoins}
            accent="green"
          />
          <KpiCard
            title="ROI Earnings"
            value={`$${fmt2(stats.roi)}`}
            icon={FaChartLine}
            accent="yellow"
          />
          <KpiCard
            title="Referral Earnings"
            value={`$${fmt2(stats.referral)}`}
            icon={FaUsers}
            accent="yellow"
          />
          <KpiCard
            title="Team Earnings"
            value={`$${fmt2(stats.team)}`}
            icon={FaWallet}
            accent="yellow"
          />
        </div>

        {/* Performance Split + Plan */}
        {/* ✅ stack on mobile, 3 cols on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Earnings Breakdown */}
          <div className="lg:col-span-2 bg-black/70 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-gray-800/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
              <div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500">
                  Performance
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white mt-1">
                  Earnings Breakdown
                </h2>
              </div>
              <div className="w-full sm:w-auto px-3 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-[11px] sm:text-xs font-bold text-center">
                Updated from wallet
              </div>
            </div>

            {/* bar */}
            <div className="bg-black/40 border border-gray-800/60 rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                <div className="text-sm font-bold text-gray-200">Distribution</div>
                <div className="text-xs text-gray-500">
                  Total: ${fmt2(stats.totalEarnings)}
                </div>
              </div>

              {/* ✅ overflow safe on tiny screens */}
              <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
                {stats.parts.map((p) => {
                  const w = (p.value / stats.sumParts) * 100;
                  return (
                    <div
                      key={p.key}
                      className="h-3 inline-block"
                      style={{
                        width: `${w}%`,
                        background:
                          p.key === "roi"
                            ? "linear-gradient(90deg, rgba(250,204,21,0.9), rgba(245,158,11,0.9))"
                            : p.key === "ref"
                            ? "linear-gradient(90deg, rgba(34,197,94,0.85), rgba(16,185,129,0.85))"
                            : p.key === "team"
                            ? "linear-gradient(90deg, rgba(59,130,246,0.65), rgba(99,102,241,0.65))"
                            : "linear-gradient(90deg, rgba(148,163,184,0.55), rgba(100,116,139,0.55))",
                      }}
                    />
                  );
                })}
              </div>

              {/* legend */}
              {/* ✅ 1 col mobile, 2 col on md */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {stats.parts.map((p) => (
                  <div
                    key={p.key}
                    className="bg-black/40 border border-gray-800/60 rounded-2xl px-4 sm:px-5 py-4 flex items-center justify-between gap-3"
                  >
                    <div className="text-sm font-bold text-gray-200">
                      {p.label}
                    </div>
                    <div className="text-base sm:text-lg font-black text-green-400 whitespace-nowrap">
                      ${fmt2(p.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* profile strip */}
            {/* ✅ 1 col mobile, 3 col md+ */}
            <div className="mt-4 sm:mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
              <MiniStat label="Level" value={`Level ${stats.level}`} icon={FaCrown} />
              <MiniStat label="Points" value={`${stats.points}`} icon={FaStar} />
              <MiniStat
                label="Today ROI Est."
                value={`$${fmt2(stats.todayRoiEstimate)}`}
                icon={FaBolt}
              />
            </div>
          </div>

          {/* Plan Card */}
          <div className="bg-black/70 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-gray-800/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500">
                  Investment
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                  Plan Summary
                </h2>
              </div>

              <div
                className={`w-full sm:w-auto px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold border text-center ${
                  stats.planActive
                    ? "bg-green-500/10 border-green-500/30 text-green-300"
                    : "bg-gray-500/10 border-gray-500/30 text-gray-300"
                }`}
              >
                {stats.planActive ? "Active" : "Inactive"}
              </div>
            </div>

            <div className="space-y-3">
              <Row label="Plan" value={stats.planName} />
              <Row label="Principal" value={`$${fmt2(stats.principal)}`} />
              <Row label="Daily ROI" value={`${fmt2(stats.dailyROIPct)}%`} />
              <Row label="Plan Profit" value={`$${fmt2(stats.planProfit)}`} />

              <div className="mt-3 sm:mt-4 p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 text-xs sm:text-sm text-gray-300">
                <span className="text-yellow-300 font-semibold">Tip:</span>{" "}
                Complete daily tasks to unlock profit credit.
              </div>
            </div>

            {/* Recent credits */}
            <div className="mt-4 sm:mt-5">
              <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mb-2">
                Recent ROI Credits
              </div>

              {stats.recentCredits.length ? (
                <div className="space-y-2">
                  {stats.recentCredits.map((c, i) => (
                    <div
                      key={i}
                      className="bg-black/40 border border-gray-800/60 rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
                    >
                      <div className="text-[11px] sm:text-xs text-gray-400 truncate min-w-0">
                        {c.date}
                      </div>
                      <div className="text-sm font-black text-green-400 whitespace-nowrap">
                        +${fmt2(c.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-black/40 border border-gray-800/60 rounded-2xl p-4 text-sm text-gray-400">
                  No credits yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tasks Progress */}
        <div className="bg-black/70 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-gray-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500">
                Daily Tasks
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white mt-1">
                Today Progress
              </h2>
            </div>

            <div className="w-full sm:w-auto px-3 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-[11px] sm:text-xs font-bold text-center">
              {stats.todayDone}/{stats.totalTasks}
            </div>
          </div>

          <div className="bg-black/40 border border-gray-800/60 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold text-gray-200">Completion</div>
              <div className="text-xs text-gray-500">
                {Math.round(stats.progressPct)}%
              </div>
            </div>

            <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                style={{ width: `${stats.progressPct}%` }}
              />
            </div>

            {/* ✅ 1 col mobile, 3 col md */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <TaskChip label="Done" value={`${stats.todayDone}`} ok />
              <TaskChip
                label="Remaining"
                value={`${Math.max(0, stats.totalTasks - stats.todayDone)}`}
              />
              <TaskChip
                label="Status"
                value={stats.todayDone >= 5 ? "Completed" : "Pending"}
                ok={stats.todayDone >= 5}
              />
            </div>

            {stats.todayDone >= 5 && (
              <div className="mt-4 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-xs sm:text-sm text-green-200 flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                Tasks completed — profit credit is eligible.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI bits (responsive) ---------- */

function KpiCard({ title, value, icon: Icon, accent = "yellow" }) {
  const accentCls =
    accent === "green"
      ? "from-green-400 to-emerald-500 shadow-green-500/20"
      : "from-yellow-500 to-yellow-600 shadow-yellow-500/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="bg-black/70 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-gray-800/60 shadow-2xl"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 truncate">
            {title}
          </div>
        </div>
        <div
          className={`shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br ${accentCls} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 text-gray-900" />
        </div>
      </div>

      <div className="text-2xl sm:text-3xl font-black text-white mt-3 sm:mt-4 break-words">
        {value}
      </div>
      <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Auto-updated</div>
    </motion.div>
  );
}

function MiniStat({ label, value, icon: Icon }) {
  return (
    <div className="bg-black/40 border border-gray-800/60 rounded-2xl px-4 sm:px-5 py-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500">
          {label}
        </div>
        <div className="text-base sm:text-lg font-black text-white mt-1 truncate">
          {value}
        </div>
      </div>
      <div className="shrink-0 w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center">
        <Icon className="w-5 h-5 text-yellow-400" />
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="bg-black/40 border border-gray-800/60 rounded-2xl px-4 sm:px-5 py-4 flex items-center justify-between gap-3">
      <div className="text-sm font-bold text-gray-200">{label}</div>
      <div className="text-sm font-black text-yellow-300 break-all text-right">
        {value}
      </div>
    </div>
  );
}

function TaskChip({ label, value, ok = false }) {
  return (
    <div
      className={`rounded-2xl px-4 py-3 border bg-black/40 flex items-center justify-between gap-3 ${
        ok ? "border-green-500/30" : "border-gray-800/60"
      }`}
    >
      <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div className={`text-sm font-black ${ok ? "text-green-300" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}
