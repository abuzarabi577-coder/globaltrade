import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaHome, FaTasks, FaCoins, FaChartLine, FaWallet, FaUserCircle,
  FaRocket, FaCheckCircle, FaOilCan, FaBrain, FaHistory, FaCog, FaSignOutAlt,
  FaTelegram, FaTwitter, FaDiscord, FaTrophy,
  FaSignInAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function InvestPlanCards() {

const navigate =useNavigate()
  
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [investAmount, setInvestAmount] = useState('');
const [selectedPlan, setSelectedPlan] = useState(''); // crypto, oil, ai
//   const [showInvestmentPage, s/etShowInvestmentPage] = useState(false);
  const { isLoggedIn ,} = useAuth();

  const goToInvestment = (payload) => {
  // ✅ if not logged in -> redirect to login
  if (!isLoggedIn) {
    navigate("/login", { state: { from: "/investment", planPayload: payload } });
    return;
  }

  // ✅ logged in -> go investment
  navigate("/investment", { state: payload });
};
const plans = [
  { id: 1, planKey: "plan1", icon: FaCoins, title: "Core Growth", investment: "100", monthlyROI: "20%" },
  { id: 2, planKey: "plan2", icon: FaOilCan, title: "Institutional Blend", investment: "5000", monthlyROI: "30% + capital insurance" },
  { id: 3, planKey: "plan3", icon: FaBrain, title: "Founder’s Syndicate", investment: "25000", monthlyROI: "35% + equity bonuses" },
];



  return (
    <>
        {/* 4. Investment Plans - REDUCED HEIGHT + MANUAL INVEST */}
    <section className="min-h-[420px]  backdrop-blur-sm py-12"> {/* ← HEIGHT FIXED: 600→420 */}
      <motion.h2 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-12 text-white" // ← mb-20→mb-12
      >
        Investment Plans
      </motion.h2>
      
      {/* 4. Investment Plans - FIXED NAVIGATION */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan, idx) => (
        <motion.div 
          key={idx} 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -8 }}
          className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/40 hover:border-yellow-500/50 transition-all"
        >
          {/* ICON + TITLE */}
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
              <plan.icon className="w-8 h-8 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">
              {plan.title}
            </h3>
          </div>
          
          {/* PRICING */}
          <div className="text-center mb-6">
            <div className="text-3xl font-black text-green-400 mb-2">
              {plan.investment}
            </div>
            <div className="text-lg font-semibold text-green-300 mb-1">
           Monthly ROI   {plan.monthlyROI}
            </div>
            <div className="text-xs uppercase tracking-wider text-gray-400">
            </div>
          </div>
          
         
          
          {/* ✅ FIXED BUTTON - Pass PLAN DATA */}
          <motion.button 
            className="w-full py-3 px-4 text-sm bg-gradient-to-r from-yellow-500 to-yellow-600 font-bold uppercase rounded-xl border border-yellow-500 hover:bg-yellow-500/90 transition-all shadow-lg"
            whileHover={{ scale: 1.02 }}
           onClick={() =>
  goToInvestment({
    amount: plan.investment,     // already numeric string
    name: plan.planKey,          // ✅ plan1/plan2/plan3
    displayTitle: plan.title,    // optional for UI
  })
}
          >
            Start Plan
          </motion.button>
        </motion.div>
      ))}
    </div>
    
    
      {/* MANUAL INVESTMENT OPTION */}
     {/* <div className="mt-12 text-center">
      <motion.button 
        onClick={() => setShowCustomModal(true)}
        className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-lg font-bold rounded-2xl border-2 border-yellow-500 hover:from-yellow-600 hover:to-yellow-700 hover:shadow-yellow-500/50 hover:shadow-2xl transition-all shadow-xl shadow-yellow-500/30 text-gray-900 backdrop-blur-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        💼 Custom Investment Amount
      </motion.button>
      <p className="text-sm text-gray-400 mt-3 font-medium tracking-wide">Enter your own amount • Flexible plans</p>
    </div> */}
    
    </section>
    
{showCustomModal && (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={() => setShowCustomModal(false)}
    className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[9999] flex items-center justify-center p-3 sm:p-4"
  >
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-sm mx-auto max-h-[92vh] bg-gradient-to-b from-gray-900/98 to-black/95 border border-gray-800/60 rounded-2xl shadow-2xl shadow-yellow-500/20 overflow-hidden"
    >
      {/* COMPACT HEADER */}
      <div className="p-4 sm:p-5 border-b border-gray-800/70 bg-gradient-to-r from-gray-900 via-yellow-500/3 to-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <span className="text-lg font-bold text-gray-900">💼</span>
            </div>
            <div className="sm:min-w-0">
              <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent leading-tight truncate">
                Custom Plan
              </h2>
              <p className="text-xs text-yellow-400 font-medium bg-yellow-500/10 px-2 py-0.5 rounded-full mt-0.5">
                Flexible Amount
              </p>
            </div>
          </div>
          
          <motion.button
            onClick={() => setShowCustomModal(false)}
            className="w-9 h-9 rounded-xl bg-gray-800/70 border border-gray-700/70 hover:bg-gray-700/90 hover:border-gray-500 flex items-center justify-center text-gray-400 hover:text-white transition-all shadow-md hover:shadow-gray-500/20 backdrop-blur-sm"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            ×
          </motion.button>  
        </div>
      </div>

      {/* COMPACT RESPONSIVE BODY */}
      <div className="p-4 sm:p-5 space-y-4 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent">
        
        {/* PLAN SELECTION - RESPONSIVE GRID */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
            Strategy
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { id: 'crypto', label: 'Crypto', icon: '₿', color: 'yellow' },
              { id: 'oil', label: 'Oil', icon: '🛢️', color: 'emerald' },
              { id: 'ai', label: 'AI', icon: '🤖', color: 'indigo' }
            ].map(plan => (
              <motion.button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-2.5 sm:p-3 rounded-xl border-2 font-bold text-xs sm:text-sm h-20 sm:h-22 flex flex-col items-center justify-center transition-all backdrop-blur-sm group ${
                  selectedPlan === plan.id
                    ? `bg-gradient-to-br from-${plan.color}-500/95 to-${plan.color}-600/95 text-gray-900 border-${plan.color}-400 shadow-xl shadow-${plan.color}-400/40 ring-1 ring-${plan.color}-400/40`
                    : `bg-gray-800/60 border-gray-700/70 hover:border-${plan.color}-400/70 hover:bg-${plan.color}-500/15 hover:shadow-lg hover:shadow-${plan.color}-400/30 text-gray-300`
                }`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl sm:text-2xl mb-1">{plan.icon}</span>
                <span className="truncate leading-tight">{plan.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* AMOUNT INPUT - COMPACT */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-wider mb-2.5">
            Amount ($)
          </label>
          
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 font-bold text-sm sm:text-base">$</span>
            <input
              type="number"
              value={investAmount}
              onChange={(e) => setInvestAmount(e.target.value)}
              placeholder="100"
              min="50"
              step="1"
              className="w-full pl-8 sm:pl-10 pr-3 py-2.5 sm:py-3 bg-gray-800/80 border-2 border-gray-700/80 rounded-xl text-base sm:text-lg font-bold text-white placeholder-gray-500 focus:border-yellow-400/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/40 transition-all backdrop-blur-sm shadow-md hover:shadow-lg hover:border-gray-600"
            />
          </div>

          {/* QUICK BUTTONS - RESPONSIVE 4-COL MOBILE */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
            {['100', '10000', '20000', '25000'].map((amount, idx) => (
              <motion.button
                key={amount}
                onClick={() => setInvestAmount(amount)}
                className={`py-2 px-1.5 text-xs font-bold rounded-lg border border-gray-700/70 bg-gray-800/60 hover:bg-gradient-to-r hover:from-yellow-500/30 hover:to-yellow-600/30 hover:border-yellow-500/60 hover:shadow-md hover:shadow-yellow-500/30 transition-all text-gray-300 hover:text-yellow-200`}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
              >
                ${parseInt(amount).toLocaleString()}
              </motion.button>
            ))}
          </div>

          {/* COMPACT ROI PREVIEW */}
          {investAmount && (
            <div className="mt-2.5 p-2.5 bg-gradient-to-r from-green-500/8 to-emerald-500/8 border border-green-500/30 rounded-lg">
              <div className="text-xs text-green-400 font-mono uppercase tracking-wider mb-0.5">Daily Est.</div>
              <div className="text-sm sm:text-base font-black text-green-400">
                ${((parseFloat(investAmount || 0) * 0.02)).toFixed(2)} - ${((parseFloat(investAmount || 0) * 0.025)).toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COMPACT FOOTER */}
      <div className="px-4 sm:px-5 py-4 border-t border-gray-800/60 bg-gradient-to-r from-gray-900/95 to-black/90">
        <div className="flex items-center justify-between text-xs text-gray-500 font-mono mb-2.5 tracking-tight">
          <span className="truncate">• Min $100 • Instant</span>
          <span className={investAmount && parseFloat(investAmount) >= 100 ? 'text-green-400 font-bold' : 'text-yellow-400'}>
            ${investAmount || 0}
          </span>
        </div>
        
        <motion.button
          className={`w-full py-3 px-4 text-sm sm:text-base font-black uppercase rounded-xl shadow-xl transition-all flex items-center justify-center gap-1.5 ${
            investAmount && parseFloat(investAmount) >= 100
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-700 border border-yellow-500 text-gray-900 shadow-yellow-500/40 hover:shadow-yellow-500/60 hover:from-yellow-600 hover:to-yellow-800 hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-700/70 border border-gray-600/70 text-gray-400 cursor-not-allowed shadow-gray-600/20'
          }`}
          onClick={() => {
            if (investAmount && parseFloat(investAmount) >= 100) {
              navigate('/investment', { 
                state: { 
                  amount: investAmount,
                  name: `${selectedPlan.toUpperCase()} CUSTOM`,
              
                } 
              });
              setShowCustomModal(false);
            }
          }}
          disabled={!investAmount || parseFloat(investAmount) < 100}
          whileHover={investAmount && parseFloat(investAmount) >= 100 ? { scale: 1.02 } : {}}
          whileTap={{ scale: 0.98 }}
        >
          {investAmount && parseFloat(investAmount) >= 100 ? '🚀 Invest Now' : 'Enter Amount'}
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
)}
    </>
  )
}
