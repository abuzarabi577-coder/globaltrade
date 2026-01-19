import React, { useState } from "react";
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

  const plans = [
    {
      id: 1,
      planKey: "plan1",
      icon: FaCoins,
      title: "Core Growth",
      investment: 100,
      monthlyROI: "20%",
      dailyMinPct: 1.5,
      dailyMaxPct: 2.5,
      directReferralPct: 8,
      bullets: ["Daily tasks unlock profit credit", "Secure withdrawals", "ROI history included", "Best for starters"],
    },
    {
      id: 2,
      planKey: "plan2",
      icon: FaOilCan,
      title: "Institutional Blend",
      investment: 5000,
      monthlyROI: "30% + insurance",
      dailyMinPct: 0.9,
      dailyMaxPct: 1.3,
      directReferralPct: 8,
      bullets: ["Oil exposure (Brent/WTI)", "Protection layer", "Priority support", "Structured distribution"],
    },
    {
      id: 3,
      planKey: "plan3",
      icon: FaBrain,
      title: "Founder’s Syndicate",
      investment: 25000,
      monthlyROI: "35% + bonuses",
      dailyMinPct: 0.7,
      dailyMaxPct: 1.1,
      directReferralPct: 8,
      bullets: ["AI execution engine", "Higher tier rewards", "Team + ROI reporting", "Founder access"],
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
      <section className="py-10">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-black text-center mb-8 text-white"
        >
          Investment Plans
        </motion.h2>

        {/* ✅ tighter grid gap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const { min, max } = calcDailyRange(plan.investment, plan.dailyMinPct, plan.dailyMaxPct);
            const directRef = calcDirectReferral(plan.investment, plan.directReferralPct);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="
                  relative
                  bg-gray-900/35 backdrop-blur-xl
                  rounded-2xl
                  p-4
                  border border-gray-800/60
                  hover:border-yellow-500/40
                  transition-all
                  overflow-hidden
                "
              >
                {/* subtle glow smaller */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-yellow-500/10 rounded-full blur-2xl" />

                {/* Header compact */}
                <div className="flex items-center gap-3 relative">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
                    <Icon className="w-5 h-5 text-gray-900" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-black text-white truncate">{plan.title}</div>
                    <div className="text-[11px] text-gray-500">Min Investment</div>
                  </div>

                  <div className="ml-auto text-right">
                    <div className="text-lg font-black text-green-400 leading-none">${fmt(plan.investment)}</div>
                    <div className="text-[11px] text-gray-500">Monthly {plan.monthlyROI}</div>
                  </div>
                </div>

                {/* Compact stats */}
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <div className="bg-black/30 border border-gray-800/60 rounded-xl px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                        <FaBolt className="text-yellow-400" />
                        <span className="text-[12px] font-bold">Daily Est.</span>
                      </div>
                      <div className="text-[12px] font-black text-green-400">
                        ${min.toFixed(2)} – ${max.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 border border-gray-800/60 rounded-xl px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                        <FaUsers className="text-yellow-400" />
                        <span className="text-[12px] font-bold">Direct Referral</span>
                      </div>
                      <div className="text-[12px] font-black text-yellow-300">
                        ${directRef.toFixed(2)} <span className="text-gray-500 font-semibold">({plan.directReferralPct}%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ bullets: compact chips (3 only) */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {plan.bullets.slice(0, 3).map((b, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/25 border border-gray-800/60"
                    >
                      <FaCheckCircle className="text-green-400 text-[12px]" />
                      <span className="text-[12px] text-gray-300">{b}</span>
                    </div>
                  ))}
                </div>

                {/* CTA compact */}
                <motion.button
                  className="
                    w-full mt-4 h-11
                    text-[13px]
                    bg-gradient-to-r from-yellow-500 to-yellow-600
                    font-black uppercase
                    rounded-2xl
                    border border-yellow-500
                    hover:brightness-110
                    transition-all
                    shadow-lg
                  "
                  whileHover={{ scale: 1.01 }}
                  onClick={() =>
                    goToInvestment({
                      amount: String(plan.investment),
                      name: plan.planKey,
                      displayTitle: plan.title,
                    })
                  }
                >
                  Start Plan
                </motion.button>

                <div className="text-[10px] text-gray-500 text-center mt-2">
                  Earnings depend on daily task completion.
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Custom modal same as before (if you want keep it) */}
    </>
  );
}
