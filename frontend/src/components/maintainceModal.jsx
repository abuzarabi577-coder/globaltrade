import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTools, FaTimes, FaClock } from "react-icons/fa";

export default function UnderMaintenanceModal({
  openByDefault = true,
  lockSite = true,           // true => user click/scroll background nahi kar sakta
  showClose = true,          // false => close button hide
  messageTitle = "Website Under Maintenance",
  messageText = "We’re upgrading our systems for a better experience. Please check back shortly.",
  supportText = "If you need urgent help, contact: support@1cglobal.ch",
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (openByDefault) setOpen(true);
  }, [openByDefault]);

  // lock body scroll
  useEffect(() => {
    if (!lockSite) return;
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open, lockSite]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-gray-800/70 bg-gradient-to-b from-[#070b14] via-black to-[#070b14] shadow-2xl">
              {/* Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/10 blur-3xl rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full" />

              {/* Close */}
              {showClose && (
                <button
                  onClick={() => setOpen(false)}
                  type="button"
                  aria-label="Close"
                  className="absolute top-4 right-4 w-11 h-11 rounded-2xl bg-black/40 border border-gray-800/70 flex items-center justify-center text-gray-200 hover:border-yellow-500/40 hover:text-yellow-300 transition"
                >
                  <FaTimes />
                </button>
              )}

              {/* Header */}
              <div className="relative p-6 border-b border-gray-800/60">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs font-black uppercase tracking-wider">
                  <FaTools />
                  Maintenance Mode
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-white mt-3">
                  {messageTitle}
                </h2>

                <p className="text-sm text-gray-400 mt-2">
                  {messageText}
                </p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="rounded-2xl bg-black/40 border border-gray-800/60 p-4">
                  <div className="flex items-center gap-2 text-gray-200 font-bold">
                    <FaClock className="text-yellow-400" />
                    Expected Back Soon
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    We’re applying updates, security patches, and performance improvements.
                  </p>
                </div>

                <div className="text-xs text-gray-500">
                  {supportText}
                </div>

                {/* Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  {showClose ? (
                    <button
                      onClick={() => setOpen(false)}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-black border border-yellow-500 shadow-lg hover:shadow-yellow-500/30 transition"
                      type="button"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/5 border border-gray-800/70 text-gray-200 font-black"
                      type="button"
                      disabled
                    >
                      Maintenance Active
                    </button>
                  )}

                  <a
                    href="mailto:support@1cglobal.ch"
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/5 border border-gray-800/70 text-gray-200 font-black hover:bg-white/10 transition text-center"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}