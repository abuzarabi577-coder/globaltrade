import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCopy, FaTimes, FaCheckCircle, FaWallet } from "react-icons/fa";

export default function InvoiceModal({ open, onClose, invoice }) {
  const [copied, setCopied] = useState("");

  const canShow = !!invoice;

  const copy = async (val, key) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopied(key);
      setTimeout(() => setCopied(""), 1200);
    } catch {}
  };

  const shortRef = useMemo(() => {
    if (!invoice?.referenceId) return "";
    return invoice.referenceId.slice(0, 8) + "..." + invoice.referenceId.slice(-6);
  }, [invoice]);

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
            className="w-full max-w-lg rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 via-black to-slate-900 p-5 text-white shadow-2xl"
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">Payment Invoice</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Send exact amount to the address below (network: <span className="text-slate-200 font-semibold">{invoice?.network || "ERC20"}</span>)
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:bg-slate-700"
              >
                <FaTimes />
              </button>
            </div>

            {!canShow ? (
              <div className="mt-6 text-center text-slate-400">No invoice found.</div>
            ) : (
              <div className="mt-6 space-y-4">
                {/* Amount */}
                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                  <div className="text-xs text-slate-400">Amount</div>
                  <div className="text-3xl font-black text-white">
                    ${invoice.amountUSD} <span className="text-sm text-slate-300">{invoice.asset || "USDT"}</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400">
                    Reference: <span className="font-mono text-slate-200">{shortRef}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                      <FaWallet className="text-yellow-400" />
                      Deposit Address
                    </div>
                    <button
                      onClick={() => copy(invoice.address || "", "address")}
                      disabled={!invoice.address}
                      className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 hover:bg-slate-700 text-xs disabled:opacity-40"
                    >
                      {copied === "address" ? (
                        <span className="flex items-center gap-2"><FaCheckCircle className="text-green-400" /> Copied</span>
                      ) : (
                        <span className="flex items-center gap-2"><FaCopy /> Copy</span>
                      )}
                    </button>
                  </div>

                  <p className="mt-3 font-mono text-xs text-slate-200 break-all">
                    {invoice.address || "Address not available"}
                  </p>

                  <p className="mt-3 text-[11px] leading-4 text-slate-500">
                    Important: Send only <b>{invoice.asset || "USDT"}</b> on <b>{invoice.network || "ERC20"}</b>. Wrong network can cause permanent loss.
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/30 p-4">
                  <div>
                    <div className="text-xs text-slate-400">Status</div>
                    <div className="text-sm font-bold text-slate-200 capitalize">{invoice.status || "pending"}</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
    