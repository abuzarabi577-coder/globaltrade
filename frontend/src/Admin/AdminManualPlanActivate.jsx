import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaBolt } from "react-icons/fa";
import Alert from "../components/Alert";
import { useAdmin } from "../context/AdminContext";

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

export default function AdminManualPlanActivate() {
  const { showAlert, alert, users, fetchUsers, manualActivatePlan } = useAdmin();

  const [q, setQ] = useState("");
  const [picked, setPicked] = useState(null);

  const [form, setForm] = useState({
    planName: "plan1",
    amountUSD: "",
    dailyROIPct: "",
    asset: "USDT",
    network: "ERC20",
  });

  const dailyRoiAmount = useMemo(() => {
    const amt = Number(form.amountUSD || 0);
    const pct = Number(form.dailyROIPct || 0);
    if (!amt || !pct) return 0;
    return round2((amt * pct) / 100);
  }, [form.amountUSD, form.dailyROIPct]);

  const canSubmit = useMemo(() => {
    if (!picked?._id) return false;
    if (!form.planName?.trim()) return false;
    if (Number(form.amountUSD) <= 0) return false;
    if (Number(form.dailyROIPct) <= 0) return false;
    return true;
  }, [picked, form]);

  const onSearch = async () => {
    await fetchUsers(q); // admin context should hit backend: /api/admin/users?q=
  };

  const onActivate = async () => {
    if (!canSubmit) return;

    const payload = {
      userId: picked._id,
      planName: form.planName.trim(),
      amountUSD: Number(form.amountUSD),
      dailyROIPct: Number(form.dailyROIPct),
      asset: form.asset,
      network: form.network,
    };

    const ok = await manualActivatePlan(payload);
    if (ok) {
      setForm((p) => ({ ...p, amountUSD: "", dailyROIPct: "" }));
      setPicked(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-16 px-4 pb-24">
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => showAlert({ isOpen: false, type: "", message: "" })}
      />

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white">
          Manual <span className="text-yellow-400">Plan Activation</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Search a user → enter investment + ROI → activate plan instantly.
        </p>
      </div>

      {/* Search user */}
      <div className="bg-black/60 border border-gray-800/60 rounded-3xl p-4 md:p-5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-black/50 border border-gray-800/60 flex items-center justify-center">
              <FaSearch className="text-gray-400" />
            </div>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name/email/userId..."
              className="w-full bg-transparent outline-none text-white placeholder:text-gray-500 text-sm"
            />

            <button
              onClick={onSearch}
              className="px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 font-bold text-sm hover:bg-yellow-500/15 transition"
              type="button"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {(users || []).slice(0, 6).map((u) => (
            <button
              key={u._id}
              onClick={() => setPicked(u)}
              type="button"
              className={`text-left rounded-2xl p-4 border transition ${
                picked?._id === u._id
                  ? "bg-yellow-500/10 border-yellow-500/30"
                  : "bg-black/40 border-gray-800/60 hover:bg-white/[0.03]"
              }`}
            >
              <div className="text-white font-bold">{u.name || "—"}</div>
              <div className="text-xs text-gray-400">{u.email || "—"}</div>
              <div className="text-xs text-gray-500 mt-1">
                Level: <span className="text-gray-200 font-bold">{u.level ?? 0}</span> • Earnings:{" "}
                <span className="text-emerald-300 font-bold">${Number(u.totalEarnings || 0).toFixed(2)}</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                Plan:{" "}
                <span className={u.isActivePlan ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                  {u.isActivePlan ? "Active" : "Inactive"}
                </span>
              </div>
            </button>
          ))}

          {!users?.length && (
            <div className="text-sm text-gray-500 p-4 rounded-2xl border border-gray-800/60 bg-black/40">
              Search users to select one.
            </div>
          )}
        </div>
      </div>

      {/* Activation form */}
      <div className="mt-6 bg-black/60 border border-gray-800/60 rounded-3xl p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500">Selected User</div>
            <div className="text-white font-black text-lg">
              {picked ? `${picked.name} (${picked.email})` : "—"}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500">Daily ROI Amount</div>
            <div className="text-xl font-black text-emerald-400">${dailyRoiAmount.toFixed(2)}</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Plan Name">
            <input
              value={form.planName}
              onChange={(e) => setForm((p) => ({ ...p, planName: e.target.value }))}
              className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
              placeholder="plan1"
            />
          </Field>

          <Field label="Investment Amount (USD)">
            <input
              value={form.amountUSD}
              onChange={(e) => setForm((p) => ({ ...p, amountUSD: e.target.value }))}
              type="number"
              min="1"
              step="0.01"
              className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
              placeholder="100"
            />
          </Field>

          <Field label="Daily ROI %">
            <input
              value={form.dailyROIPct}
              onChange={(e) => setForm((p) => ({ ...p, dailyROIPct: e.target.value }))}
              type="number"
              min="0.01"
              step="0.01"
              className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
              placeholder="0.67"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Network">
              <select
                value={form.network}
                onChange={(e) => setForm((p) => ({ ...p, network: e.target.value }))}
                className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
              >
                <option value="ERC20">ERC20</option>
                <option value="TRC20">TRC20</option>
              </select>
            </Field>

            <Field label="Asset">
              <select
                value={form.asset}
                onChange={(e) => setForm((p) => ({ ...p, asset: e.target.value }))}
                className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
              >
                <option value="USDT">USDT</option>
              </select>
            </Field>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          disabled={!canSubmit}
          onClick={onActivate}
          type="button"
          className="mt-5 w-full py-4 rounded-2xl font-black text-black bg-gradient-to-r from-yellow-500 to-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <FaBolt />
          Activate Plan Now
        </motion.button>

        <div className="mt-3 text-xs text-gray-500">
          * This will save plan in user.activePlan and mark user.isActivePlan = true.
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">{label}</div>
      {children}
    </div>
  );
}