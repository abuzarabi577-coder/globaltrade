import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaCopy, FaCheckCircle, FaShareAlt, FaUsers } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";

export default function ReferralSection() {
  const { FetchUserData, showAlert, HandleFetchUserData } = useAppContext();
  const [copiedKey, setCopiedKey] = useState(""); // "code" | "link" | ""

  // ✅ Fetch once / safe
  useEffect(() => {
    HandleFetchUserData?.();
  }, [HandleFetchUserData]);

  // ✅ safe fallback (avoid crash on first render)
  const referralCode = FetchUserData?.referralCode || "—";

  const referralLink = useMemo(() => {
    const origin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "";
    return referralCode && referralCode !== "—"
      ? `${origin}/login?ref=${encodeURIComponent(referralCode)}`
      : `${origin}/login`;
  }, [referralCode]);

  const tiers = [
    { level: 1, pct: "8%" },
    { level: 2, pct: "5%" },
    { level: 3, pct: "4%" },
    { level: 4, pct: "3%" },
    { level: 5, pct: "2%" },
    { level: 6, pct: "1%" },
    { level: 7, pct: "1%" },
    { level: 8, pct: "1%" },
    { level: 9, pct: "0.5%" },
    { level: 10, pct: "0.5%" },
  ];

  const copyText = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      showAlert("success", "Copied!");
      setTimeout(() => setCopiedKey(""), 1200);
    } catch (e) {
      showAlert("error", "Copy failed");
    }
  };

  return (
    <div className="w-full mt-14 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* ✅ responsive spacing (no forced min-h-screen, better on small devices) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-16 sm:pb-24 space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Referral Program
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl">
            Invite new members using your referral link. Earn commission across
            10 levels when your team invests and grows.
          </p>
        </motion.div>

        {/* ✅ Responsive grid layout: on large screens show 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Code Card */}
          <div className="bg-black/70 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-gray-800/60">
            {/* ✅ stack on mobile, row on sm+ */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/25">
                  <FaUsers className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
                </div>

                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500">
                    Your Referral Code
                  </div>
                  {/* ✅ responsive + wrap-safe */}
                  <div className="text-xl sm:text-2xl font-black text-white mt-1 break-all">
                    {referralCode}
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                onClick={() =>
                  referralCode !== "—" && copyText(referralCode, "code")
                }
                disabled={referralCode === "—"}
                className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-yellow-500/10 text-yellow-300 font-bold border border-yellow-500/40 hover:bg-yellow-500/15 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copiedKey === "code" ? <FaCheckCircle /> : <FaCopy />}
                {copiedKey === "code" ? "Copied" : "Copy"}
              </motion.button>
            </div>

            <div className="mt-4 sm:mt-5">
              <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mb-2">
                Referral Link
              </div>

              {/* ✅ keep vertical on mobile, row on md+ */}
              <div className="flex flex-col md:flex-row gap-3 md:items-stretch">
                <div className="flex-1 bg-black/50 border border-gray-800/60 rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-300 break-all">
                  {referralLink}
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => copyText(referralLink, "link")}
                  className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-black border border-yellow-500 shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
                >
                  <FaShareAlt />
                  {copiedKey === "link" ? "Copied" : "Copy Link"}
                </motion.button>
              </div>

              {/* ✅ small helper note for mobile */}
              <div className="mt-3 text-[11px] sm:text-xs text-gray-500">
                Tip: Tap the code/link button to copy instantly.
              </div>
            </div>
          </div>

          {/* Direct Referrals */}
          <div className="bg-black/70 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-gray-800/60">
            {/* ✅ responsive header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-5">
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500">
                  Your Team
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white mt-1">
                  Direct Referrals
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Members you invited directly (Level 1).
                </p>
              </div>

              <div className="w-full sm:w-auto px-3 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-bold text-center">
                Total: {FetchUserData?.Referal?.length || 0}
              </div>
            </div>

            {Array.isArray(FetchUserData?.Referal) &&
            FetchUserData.Referal.length > 0 ? (
              <div className="space-y-3">
                {FetchUserData.Referal.slice()
                  .reverse()
                  .map((r, idx) => {
                    const u = r?.userId;
                    const displayName = u?.name || "Member";
                    const displayLevel = typeof u?.level === "number" ? u.level : 0;

                    return (
                      <motion.div
                        key={String(r?.userNumber || idx)}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        className="bg-black/40 border border-gray-800/60 rounded-2xl px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-black text-white truncate">
                            {displayName}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Joined:{" "}
                            <span className="text-gray-300">
                              {r?.joinedAt
                                ? new Date(r.joinedAt).toLocaleDateString()
                                : "—"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="px-3 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-black whitespace-nowrap">
                            Level {displayLevel}
                          </div>

                          <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_12px_rgba(34,197,94,0.55)]" />
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            ) : (
              <div className="bg-black/40 border border-gray-800/60 rounded-2xl p-5 sm:p-6 text-center">
                <div className="text-sm font-bold text-gray-300">
                  No direct referrals yet
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Share your referral link to start building your team.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Commission Structure */}
        <div className="bg-black/70 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-gray-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500">
                Earnings Structure
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white mt-1">
                10-Level Commission
              </h2>
            </div>

            <div className="w-full sm:w-auto px-3 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-bold text-center">
              Up to 10 levels
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-400 mb-5 sm:mb-6">
            You earn a percentage from each level of your referral network.
            Example: when you add your first member, you earn{" "}
            <span className="text-yellow-300 font-semibold">8%</span> on Level 1.
            As your network grows, you continue earning across deeper levels
            based on the tier rates below.
          </p>

          {/* ✅ responsive grid: 1 col mobile, 2 col sm, 3 col lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tiers.map((t) => (
              <div
                key={t.level}
                className="bg-black/40 border border-gray-800/60 rounded-2xl px-4 sm:px-5 py-4 flex items-center justify-between"
              >
                <div className="text-sm font-bold text-gray-200">
                  Level {t.level}
                </div>
                <div className="text-lg font-black text-green-400">{t.pct}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 sm:mt-6 p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 text-xs sm:text-sm text-gray-300">
            <span className="text-yellow-300 font-semibold">Tip:</span> Share
            your link on WhatsApp, Telegram, Facebook, and YouTube to grow
            faster. More active referrals = more commissions.
          </div>
        </div>
      </div>
    </div>
  );
}
