import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmInvestmentModal({ open, onClose, onProceed, plan, loading }) {

    const PLAN_NAME_MAP = {
  plan1: "Core Growth",
  plan2: "Institutional Blend",
  plan3: "Founder’s Syndicate",
};
const getPlanDisplayName = (planKey) => {
  if (!planKey) return "";
  return PLAN_NAME_MAP[planKey.toLowerCase()] || planKey;
};
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 via-black to-slate-900 p-5 text-white shadow-2xl"
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
          >
            <h3 className="text-xl font-bold">Confirm Investment</h3>
            <p className="text-sm text-slate-400 mt-2">
              You are about to generate a payment invoice for:
            </p>

            <div className="mt-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
<div className="text-sm font-semibold text-white">
  {getPlanDisplayName(plan?.name)}
</div>
              <div className="text-2xl font-black text-white mt-1">${plan?.amount}</div>
              <div className="text-[11px] text-slate-400 mt-2">Network: ERC20 • Asset: USDT</div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:bg-slate-700"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={onProceed}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold border border-yellow-500/50 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Generating..." : "Proceed"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
