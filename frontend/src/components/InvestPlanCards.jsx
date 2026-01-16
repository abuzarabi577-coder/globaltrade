import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCoins, FaOilCan, FaBrain, FaCheckCircle, FaBolt, FaUsers } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const fmt = (n) => Number(n || 0).toLocaleString();

export default function InvestPlanCards() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [investAmount, setInvestAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  const goToInvestment = (payload) => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/investment", planPayload: payload } });
      return;
    }
    navigate("/investment", { state: payload });
  };

  // ✅ Add details per plan here (daily ranges + referral example)
  const plans = [
    {
      id: 1,
      planKey: "plan1",
      icon: FaCoins,
      title: "Core Growth",
      investment: 100,
      monthlyROI: "20%",
      dailyMinPct: 1.5, // %
      dailyMaxPct: 2.5, // %
      directReferralPct: 8, // %
      bullets: [
        "Daily tasks unlock profit credit",
        "Withdrawals processed securely",
        "Dashboard + ROI history included",
        "Best for new investors",
      ],
    },
    {
      id: 2,
      planKey: "plan2",
      icon: FaOilCan,
      title: "Institutional Blend",
      investment: 5000,
      monthlyROI: "30% + capital insurance",
      dailyMinPct: 0.9,
      dailyMaxPct: 1.3,
      directReferralPct: 8,
      bullets: [
        "Oil strategy exposure (Brent/WTI)",
        "Capital protection layer (policy-based)",
        "Priority support + faster handling",
        "Structured profit distribution",
      ],
    },
    {
      id: 3,
      planKey: "plan3",
      icon: FaBrain,
      title: "Founder’s Syndicate",
      investment: 25000,
      monthlyROI: "35% + equity bonuses",
      dailyMinPct: 0.7,
      dailyMaxPct: 1.1,
      directReferralPct: 8,
      bullets: [
        "AI strategy engine execution",
        "Higher tier rewards + bonuses",
        "Team + ROI optimized reporting",
        "Founder-level priority access",
      ],
    },
  ];

  const calcDailyRange = (amount, minPct, maxPct) => {
    const min = (amount * minPct) / 100;
    const max = (amount * maxPct) / 100;
    return { min, max };
  };

  const calcDirectReferral = (amount, pct) => (amount * pct) / 100;

  return (
    <>
      {/* ✅ Investment Plans */}
      <section className="min-h-[420px] backdrop-blur-sm py-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12 text-white"
        >
          Investment Plans
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            const { min, max } = calcDailyRange(plan.investment, plan.dailyMinPct, plan.dailyMaxPct);
            const directRef = calcDirectReferral(plan.investment, plan.directReferralPct);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 hover:border-yellow-500/50 transition-all overflow-hidden"
              >
                {/* subtle glow */}
                <div className="absolute -top-14 -right-14 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl" />

                {/* ICON + TITLE */}
                <div className="text-center mb-4 relative">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
                    <Icon className="w-8 h-8 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wide">
                    {plan.title}
                  </h3>
                  <div className="text-xs text-gray-400 mt-2">
                    Minimum Investment
                  </div>
                  <div className="text-3xl font-black text-green-400 mt-1">
                    ${fmt(plan.investment)}
                  </div>
                </div>

                {/* ROI Summary */}
                <div className="bg-black/30 border border-gray-800/60 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300 font-bold">Monthly ROI</span>
                    <span className="text-green-300 font-black">{plan.monthlyROI}</span>
                  </div>

                  {/* NEW: daily earnings */}
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <FaBolt className="text-yellow-400" />
                        <span className="font-bold">Daily Earnings (Est.)</span>
                      </div>
                      <div className="font-black text-green-400">
                        ${min.toFixed(2)} – ${max.toFixed(2)}
                      </div>
                    </div>

                    {/* NEW: referral earnings */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <FaUsers className="text-yellow-400" />
                        <span className="font-bold">Direct Referral (Level 1)</span>
                      </div>
                      <div className="font-black text-yellow-300">
                        ${directRef.toFixed(2)} ({plan.directReferralPct}%)
                      </div>
                    </div>
                  </div>
                </div>

                {/* NEW: Points list (3-4 points) */}
                <div className="space-y-2 mb-5">
                  {plan.bullets.slice(0, 4).map((b, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 bg-black/25 border border-gray-800/60 rounded-2xl px-4 py-2.5"
                    >
                      <FaCheckCircle className="text-green-400 mt-0.5 shrink-0" />
                      <div className="text-sm text-gray-300 leading-relaxed">{b}</div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  className="w-full py-3 px-4 text-sm bg-gradient-to-r from-yellow-500 to-yellow-600 font-black uppercase rounded-2xl border border-yellow-500 hover:brightness-110 transition-all shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  onClick={() =>
                    goToInvestment({
                      amount: String(plan.investment),
                      name: plan.planKey, // plan1/plan2/plan3
                      displayTitle: plan.title,
                    })
                  }
                >
                  Start Plan
                </motion.button>

                {/* tiny note */}
                <div className="text-[11px] text-gray-500 text-center mt-3">
                  Earnings depend on daily task completion & plan rules.
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* (Your custom modal code can stay same below) */}
      {/* showCustomModal ... */}
    </>
  );
}
