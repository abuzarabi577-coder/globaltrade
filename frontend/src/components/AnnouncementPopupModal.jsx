import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBullhorn, FaTimes } from "react-icons/fa";

const AnnouncementPopupModal = ({ open, onClose, list = [], loading }) => {
  const top = useMemo(() => (Array.isArray(list) ? list.slice(0, 5) : []), [list]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-xl rounded-3xl bg-gradient-to-br from-slate-950 to-black border border-yellow-500/25 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                    <FaBullhorn className="text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-white">Announcements</div>
                    <div className="text-xs text-slate-400">Latest updates from 1C Trader</div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center"
                >
                  <FaTimes className="text-slate-300" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                {loading ? (
                  <div className="text-slate-400 text-sm">Loading announcements...</div>
                ) : top.length === 0 ? (
                  <div className="text-slate-400 text-sm">No announcements right now.</div>
                ) : (
                  <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                    {top.map((a) => (
                      <div
                        key={a._id}
                        className="rounded-2xl bg-white/5 border border-white/10 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-white font-black">{a.title}</div>
                          <div className="text-[11px] text-slate-500 whitespace-nowrap">
                            {a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}
                          </div>
                        </div>
                        <div className="text-sm text-slate-300 mt-2 leading-relaxed">
                          {a.description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={onClose}
                    className="h-11 px-5 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black shadow-xl hover:shadow-yellow-500/30 active:scale-95 transition"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementPopupModal;