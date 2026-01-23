import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes, FaTrophy, FaCrown } from "react-icons/fa";

export default function WinnerAnnouncementModal({ autoCloseMs = 5000 }) {
  const [open, setOpen] = useState(false);
  const [winners, setWinners] = useState([]);

  // 🔹 open modal + auto close
  useEffect(() => {
    setOpen(true);
    const t = setTimeout(() => setOpen(false), autoCloseMs);
    return () => clearTimeout(t);
  }, [autoCloseMs]);

  // 🔹 fetch real users from backend
  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/top-rankers`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (data?.success && Array.isArray(data.users)) {
          setWinners(data.users.slice(0, 3)); // ✅ ONLY FIRST 3
        }
      } catch (err) {
        console.error("Failed to load winners", err);
      }
    };

    fetchWinners();
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-lg rounded-3xl border border-yellow-500/30 bg-gradient-to-b from-[#070b14] via-black to-[#070b14] shadow-2xl p-6">

              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-black/40 border border-gray-800 text-gray-200 hover:text-yellow-400"
              >
                <FaTimes />
              </button>

              {/* Header */}
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs font-black uppercase">
                  <FaTrophy />
                  Weekly Winners
                </div>

                <h3 className="text-2xl font-black text-white mt-3">
                  🎉 iPhone Winners
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Top 3 high achievers of this week
                </p>
      <div className="flex justify-center mb-4">
  <img
    src="/image/iphone.png.jpeg"
    alt="iPhone Reward"
    className="w-24 md:w-32 drop-shadow-2xl"
  />
  <img
    src="/image/iphone17.png.jpeg"
    alt="iPhone Reward"
    className="w-24 md:w-32 drop-shadow-2xl"
  />
</div>


              </div>

              {/* Winners */}
              <div className="space-y-3">
                {winners.map((u, idx) => (
                  <div
                    key={u._id || idx}
                    className="flex items-center justify-between gap-4 bg-black/40 border border-gray-800/60 rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-300 font-black">
                        #{idx + 1}
                      </div>

                      <div className="min-w-0">
                        <div className="text-white font-black truncate flex items-center gap-2">
                          <FaCrown className="text-yellow-400" />
                          {u.name}
                        </div>
                        <div className="text-[11px] text-gray-500">
Level {u.level} • ${Math.round(u.totalEarnings).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-black px-3 py-1 rounded-2xl border border-yellow-500/30 text-yellow-300">
                      iPhone
                    </span>
                  </div>
                ))}

                {!winners.length && (
                  <div className="text-center text-gray-500 py-6">
                    Loading winners...
                  </div>
                )}
              </div>

              <div className="text-[11px] text-gray-500 mt-4 text-center">
                Auto closes in {autoCloseMs / 1000}s
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}