import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

import {
  FaHome, FaTasks, FaCoins, FaChartLine, FaWallet, FaUserCircle,
  FaRocket, FaCheckCircle, FaOilCan, FaBrain, FaHistory, FaCog, FaSignOutAlt,
  FaTelegram, FaTwitter, FaDiscord, FaTrophy,
  FaSignInAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import UserDashboard from './UserDashboard';
import { useAuth } from '../context/AuthContext';
import InvestPlanCards from './InvestPlanCards';

export default function Mainpage() {
const navigate =useNavigate()
  const { authLoading,isLoggedIn ,me} = useAuth();

  const historyData = [
    { amount: '$2,350', user: 'Ali Khan', time: '2h ago', wallet: 'BTC', avatar: 'AK' },
    { amount: '$1,870', user: 'Sara Malik', time: '4h ago', wallet: 'USDT', avatar: 'SM' },
    { amount: '$4,120', user: 'Ahmed R.', time: '6h ago', wallet: 'ETH', avatar: 'AR' },
    { amount: '$1,920', user: 'Fatima S.', time: '8h ago', wallet: 'TRX', avatar: 'FS' },
  ];

  const goalsData = [
    { goal: 'Starter Plan', target: '$100', achieved: '$100', progress: 100, icon: FaCoins },
    { goal: 'Oil Trader', target: '$250', achieved: '$150', progress: 60, icon: FaOilCan },
    { goal: 'AI Pro', target: '$500', achieved: '$320', progress: 64, icon: FaBrain },
  ];

const location = useLocation();
const isPlansRoute = location.pathname === "/plans";

useEffect(() => {
  if (location.pathname === "/plans") {
    setTimeout(() => {
      document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }
}, [location.pathname]);

  return (

   <>

   
     <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      {/* Subtle Trading Chart Background */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(75,85,99,0.4)_1px,transparent_1px),linear-gradient(rgba(75,85,99,0.4)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Top Navbar */}
     



      <div className="h-16 pt-4" />

      {/* SCROLLABLE SECTIONS - All visible now */}
      <div className="max-w-7xl mx-auto px-6 pb-32 space-y-20">
        

 {!authLoading && isLoggedIn ? (
          <UserDashboard me={me} />
        ) : (
          <>
            {/* ✅ yahan aap apna existing hero + marketing sections paste kar do */}
            {/* ... */}
        





        {/* 1. Hero Section */}
    {/* 1. Hero Section */}
<section className="min-h-[80vh] flex items-start md:items-center pt-6 md:pt-10">
  <div className="grid md:grid-cols-2 gap-10 w-full items-start">
    {/* LEFT: investing line + button */}
    <div className="text-left mt-8 md:mt-0">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }}
        className="text-sm uppercase tracking-wider text-gray-400 font-medium mb-4"
      >
        Professional investing and earning platform
      </motion.h2>
      
      <motion.h1  
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-black mb-6 leading-tight"
      >
        Invest <span className="text-yellow-400 block text-3xl md:text-4xl">$100</span>
        <span className="block text-xl md:text-2xl text-gray-300 font-light">
          Earn $1.50–$2.50 daily
        </span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }}
        className="text-base md:text-lg max-w-xl mb-8 text-gray-400 leading-relaxed"
      >
        Automated strategies across crypto, oil and AI markets with institutional‑grade execution.
      </motion.p>
      
      <motion.button   onClick={() => navigate("/plans#plans")}
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }}
        className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-base md:text-lg font-bold rounded-2xl border border-yellow-500 hover:bg-yellow-500/90 transition-all shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.02 }}
      >
        Start Investing
      </motion.button>
    </div>

    {/* RIGHT: coins list (rows) + full candle chart under it, NO buy/sell buttons */}
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="w-full flex justify-center md:justify-end mt-6 md:mt-0"
    >
      <div className="w-full max-w-md bg-[#020617] border border-gray-800 rounded-3xl p-4 shadow-2xl">
        {/* COINS PRICE ROWS */}
        <div className="space-y-2 mb-4 text-[11px]">
          <div className="grid grid-cols-3 gap-2 items-center bg-white/5 rounded-lg px-3 py-2">
            <div className="font-semibold text-white">BTC / USDT</div>
            <div className="text-right text-gray-300">$62,350.25</div>
            <div className="text-right text-green-400 font-medium">+2.34%</div>
          </div>
          <div className="grid grid-cols-3 gap-2 items-center bg-white/5 rounded-lg px-3 py-2">
            <div className="font-semibold text-white">ETH / USDT</div>
            <div className="text-right text-gray-300">$3,180.50</div>
            <div className="text-right text-green-400 font-medium">+1.12%</div>
          </div>
          <div className="grid grid-cols-3 gap-2 items-center bg-white/5 rounded-lg px-3 py-2">
            <div className="font-semibold text-white">USDT / USD</div>
            <div className="text-right text-gray-300">$1.00</div>
            <div className="text-right text-gray-400 font-medium">0.00%</div>
          </div>
        </div>

        {/* PROFESSIONAL-STYLE CANDLE CHART */}
        <div className="relative bg-black rounded-2xl h-56 overflow-hidden border border-gray-800">
          {/* grid */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#111_1px,transparent_1px),linear-gradient(#111_1px,transparent_1px)] bg-[size:24px_18px] opacity-40" />

          {/* y-axis labels */}
          <div className="absolute left-1 top-2 bottom-6 flex flex-col justify-between text-[9px] text-gray-500">
            <span>63k</span>
            <span>62.5k</span>
            <span>62k</span>
            <span>61.5k</span>
            <span>61k</span>
          </div>

          {/* x-axis time labels */}
          <div className="absolute bottom-0 left-6 right-0 h-6 bg-gradient-to-t from-black to-transparent flex items-end px-3 pb-1 text-[9px] text-gray-500">
            <div className="flex justify-between w-full">
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
            </div>
          </div>

          {/* candles – full width */}
<div className="absolute inset-0 left-6 right-2 flex items-end space-x-0.5 pt-4">
  {/* 30 SUPER TALL CANDLES - Red candles mixed in green sequence */}
  {[
    // 1-8: Uptrend with red pullbacks (green dominant)
    {wick: 100, body: 80, color: 'bg-green-500'},
    {wick: 110, body: 85, color: 'bg-red-500'},  // red pullback
    {wick: 115, body: 92, color: 'bg-green-500'},
    {wick: 118, body: 95, color: 'bg-green-500'},
    {wick: 120, body: 98, color: 'bg-green-500'},
    {wick: 105, body: 82, color: 'bg-red-500'},  // red dip
    {wick: 112, body: 90, color: 'bg-green-500'},
    {wick: 108, body: 88, color: 'bg-green-500'},
    
    // 9-15: Consolidation (more red mixed)
    {wick: 106, body: 30, color: 'bg-red-500'},
    {wick: 115, body: 65, color: 'bg-green-500'},
    {wick: 102, body: 25, color: 'bg-red-500'},
    {wick: 110, body: 55, color: 'bg-green-500'},
    {wick: 108, body: 70, color: 'bg-green-500'},
    {wick: 98, body: 20, color: 'bg-red-500'},
    {wick: 112, body: 75, color: 'bg-green-500'},
    
    // 16-22: Bearish with green bounces
    {wick: 105, body: 60, color: 'bg-red-500'},
    {wick: 95, body: 72, color: 'bg-red-500'},
    {wick: 90, body: 68, color: 'bg-red-500'},
    {wick: 85, body: 50, color: 'bg-green-500'}, // green bounce
    {wick: 92, body: 55, color: 'bg-red-500'},
    {wick: 88, body: 62, color: 'bg-red-500'},
    {wick: 82, body: 45, color: 'bg-green-500'}, // small green
    
    // 23-30: Massive recovery (green with 1 red fakeout)
    {wick: 85, body: 50, color: 'bg-green-500'},
    {wick: 95, body: 70, color: 'bg-green-500'},
    {wick: 98, body: 78, color: 'bg-red-500'},  // fakeout red
    {wick: 105, body: 85, color: 'bg-green-500'},
    {wick: 110, body: 92, color: 'bg-green-500'},
    {wick: 115, body: 96, color: 'bg-green-500'},
    {wick: 118, body: 98, color: 'bg-green-500'},
    {wick: 120, body: 100, color: 'bg-green-500'}
  ].map((candle, idx) => (
    <div key={idx} className="flex-1 flex items-end justify-center">
      <div 
        className="w-[1.2px] bg-gray-400" 
        style={{ height: `${candle.wick}px` }}
      />
      <div 
        className={`${candle.color} rounded-sm -ml-[0.6px]`}
        style={{ width: '5px', height: `${candle.body}px` }}
      />
    </div>
  ))}
</div>

        </div>
      </div>
    </motion.div>
  </div>
</section>

{/* 3.5. NEW OIL TRADING SECTION - Real Oil Price Charts + Attractive Goals */}
<section className="min-h-[500px] bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl rounded-3xl p-8 md:p-12">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    
    {/* LEFT: Attractive Oil Trading Goals + Button */}
    <motion.div 
      initial={{ opacity: 0, x: -30 }} 
      whileInView={{ opacity: 1, x: 0 }}
      className="text-center lg:text-left space-y-6"
    >
      <div className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-3xl border border-emerald-500/40 backdrop-blur-sm">
        <span className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">Oil Trading</span>
      </div>
      
<motion.h2
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  className="text-2xl md:text-4xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent leading-tight"
>
  Oil Market Performance<br />
  <span className="text-2xl md:text-3xl font-light text-gray-300 block">
    Institutional-style execution
  </span>
</motion.h2>

<motion.p
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  className="text-lg text-gray-400 max-w-lg leading-relaxed mb-8"
>
  Track Brent & WTI moves and benefit from structured strategies designed for steady daily returns.
</motion.p>
       
      <motion.button  onClick={() => navigate("/plans#plans")}
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }}
        className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-lg font-bold rounded-3xl border border-emerald-500 hover:from-emerald-600 hover:to-green-700 transition-all shadow-2xl hover:shadow-emerald-500/25 text-white"
        whileHover={{ scale: 1.05 }}
      >
        Start Oil Trading
      </motion.button>
    </motion.div>

    {/* RIGHT: Real Oil Price Chart Images */}
    <motion.div 
      initial={{ opacity: 0, x: 30 }} 
      whileInView={{ opacity: 1, x: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Oil Chart 1 - Brent Crude */}
      <div className="relative bg-[#0a0f1a] border border-gray-800 rounded-2xl p-4 shadow-2xl h-48 md:h-56 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl opacity-20" />
        <div className="h-full bg-gradient-to-br from-emerald-400/10 via-transparent to-green-500/5 rounded-xl relative overflow-hidden">
          {/* Chart simulation */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#1a3a2a_1px,transparent_1px),linear-gradient(rgba(26,58,42,0.3)_1px,transparent_1px)] bg-[size:28px_20px] opacity-60" />
          
          {/* Price line */}
          <div className="absolute top-1/2 left-8 right-4 h-px bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg" />
          
          {/* Candles */}
          <div className="absolute inset-y-8 left-10 right-4 flex items-center space-x-1.5">
            <div className="flex-1 h-20 bg-emerald-500/80 rounded-sm" />
            <div className="flex-1 h-16 bg-emerald-400/60 rounded-sm" />
            <div className="flex-1 h-28 bg-green-500 rounded-sm" />
            <div className="flex-1 h-12 bg-emerald-500/70 rounded-sm" />
            <div className="flex-1 h-24 bg-green-600 rounded-sm" />
          </div>
          
          {/* Labels */}
          <div className="absolute top-3 left-3 text-xs font-mono text-emerald-300">BRENT</div>
          <div className="absolute bottom-3 right-3 text-sm font-bold text-white">$78.45</div>
          <div className="absolute bottom-3 left-3 text-xs text-gray-400">+2.8%</div>
        </div>
      </div>

      {/* Oil Chart 2 - WTI Crude */}
      <div className="relative bg-[#0f1a0a] border border-gray-800 rounded-2xl p-4 shadow-2xl h-48 md:h-56 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl opacity-20" />
        <div className="h-full bg-gradient-to-br from-amber-400/10 via-transparent to-yellow-500/5 rounded-xl relative overflow-hidden">
          {/* Chart grid */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#2a2a1a_1px,transparent_1px),linear-gradient(rgba(42,42,26,0.3)_1px,transparent_1px)] bg-[size:28px_20px] opacity-60" />
          
          {/* Price line */}
          <div className="absolute top-2/3 left-8 right-4 h-px bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg" />
          
          {/* Candles */}
          <div className="absolute inset-y-10 left-10 right-4 flex items-center space-x-1.5">
            <div className="flex-1 h-16 bg-amber-500/80 rounded-sm" />
            <div className="flex-1 h-24 bg-yellow-500/60 rounded-sm" />
            <div className="flex-1 h-14 bg-amber-400 rounded-sm" />
            <div className="flex-1 h-28 bg-yellow-600 rounded-sm" />
            <div className="flex-1 h-20 bg-amber-500 rounded-sm" />
          </div>
          
          {/* Labels */}
          <div className="absolute top-3 left-3 text-xs font-mono text-amber-300">WTI</div>
          <div className="absolute bottom-3 right-3 text-sm font-bold text-white">$74.20</div>
          <div className="absolute bottom-3 left-3 text-xs text-gray-400">+1.4%</div>
        </div>
      </div>
    </motion.div>
  </div>
</section>
{/* 5. AI TRADING DASHBOARD SECTION */}
<section className="min-h-[500px] bg-gradient-to-r from-indigo-900/30 to-purple-900/30 backdrop-blur-xl rounded-3xl p-8 md:p-12 my-20">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    {/* LEFT */}
    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl border border-indigo-500/40">
        <span className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">AI Powered</span>
      </div>
     
<h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-300 to-white bg-clip-text text-transparent">
  AI Strategy Engine<br />
  <span className="text-2xl font-light text-gray-300 block">
Founder’s Syndicate  </span>
</h2>

<p className="text-lg text-gray-400 max-w-lg">
  Our system analyzes market signals and optimizes execution—so you can earn without manual trading.
</p>
      <motion.button  onClick={() => navigate("/plans#plans")}
        className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-lg font-bold rounded-3xl border border-indigo-500 hover:from-indigo-600 hover:to-purple-700 shadow-2xl"
        whileHover={{ scale: 1.05 }}
      >

        Start AI Trade 
      </motion.button>
    </motion.div>

    {/* RIGHT: Real AI Dashboard Image */}
    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}>
      <div className="relative bg-gradient-to-br  rounded-3xl p-6 shadow-2xl overflow-hidden">
        <img 
          src="image/aiimage.jfif" 
          alt="AI Trading Dashboard"
          className="w-full h-full object-cover rounded-2xl shadow-2xl"
        />
       
      </div>
    </motion.div>
  </div>
</section>

{/* 6. REFERRAL EARNINGS SECTION */}
<section className="min-h-[500px] bg-gradient-to-r from-emerald-900/30 to-teal-900/30 backdrop-blur-xl rounded-3xl p-8 md:p-12 my-20">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    {/* LEFT */}
    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl border border-emerald-500/40">
        <span className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">Passive Income</span>
      </div>
     
<h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-400 to-white bg-clip-text text-transparent">
  Build Your Network<br />
  <span className="text-2xl font-light text-gray-300 block">
    Earn from direct & team rewards
  </span>
</h2>

<p className="text-lg text-gray-400 max-w-lg">
  Share your referral link and earn commissions as your team invests and grows across levels.
</p>
      <motion.button 
        className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-lg font-bold rounded-3xl border border-emerald-500 hover:from-emerald-600 hover:to-teal-700 shadow-2xl"
        whileHover={{ scale: 1.05 }}
      >
          <Link to={'/login'}>

        Share Referral Link
        </Link>
      </motion.button>
    </motion.div>

    {/* RIGHT: Real Referral Dashboard Image */}
    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}>
      <div className="relative bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-800/50 rounded-3xl p-6 shadow-2xl overflow-hidden">
        <img 
          src="/image/referalimage.webp" 
          alt="Referral Earnings Dashboard"
          className="w-full h-80 object-cover rounded-2xl shadow-2xl"
        />
        <div className="absolute top-4 right-4 bg-emerald-500/90 text-white px-4 py-2 rounded-2xl text-sm font-bold">
          $24,750 Earned
        </div>
      </div>
    </motion.div>
  </div>
</section>

{/* 7. PORTFOLIO ANALYTICS SECTION */}


{/* 8. MOBILE TRADING SECTION */}
{/* CRYPTO MOBILE TRADING SECTION */}
<section className="min-h-[500px] bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-xl rounded-3xl p-8 md:p-12 my-20">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    {/* LEFT */}
    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-3xl border border-purple-500/40">
        <span className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Crypto On-the-Go</span>
      </div>
      
<h2 className="text-4xl md:text-4xl font-black bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent">
  Crypto Market Exposure<br />
  <span className="text-2xl font-light text-gray-300 block">
    Track trends, earn daily
  </span>
</h2>

<p className="text-lg text-gray-400 max-w-lg">
  Stay connected to market performance with a clean dashboard and profit-focused investing plans.
</p>
      <motion.button   onClick={() => navigate("/plans#plans")}
        className="px-10 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-lg font-bold rounded-3xl border border-purple-500 hover:from-purple-600 hover:to-indigo-700 shadow-2xl text-white"
        whileHover={{ scale: 1.05 }}
      >
        Start Crypto Trade
      </motion.button>
    </motion.div>

    {/* RIGHT: Real Crypto Mobile App Image */}
    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}>
      <div className="relative bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border border-purple-800/50 rounded-3xl p-6 shadow-2xl overflow-hidden">
        <img 
          src="image/cryptoimage.avif" 
          alt="Crypto Mobile Trading App"
          className="w-full h-80 object-cover rounded-2xl shadow-2xl"
        />
        <div className="absolute top-4 left-4 bg-purple-500/90 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center">
          <span>🪙</span> BTC $62,350
        </div>
        <div className="absolute bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold">
          +3.2% 24h
        </div>
      </div>
    </motion.div>
  </div>
</section>


        
      

        {/* 4. Investment Plans */}
{/* Investment Plans card show rules */}

    <div id="plans">
      {(!isLoggedIn || isPlansRoute) && <InvestPlanCards />}
    </div>

  </>
        )}
      </div>

      {/* Fixed Bottom Navigation */}
     {/* ✅ ABOUT SECTION */}
<section className="bg-black/40 border border-gray-800/60 backdrop-blur-xl rounded-3xl p-6 md:p-10">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
    {/* LEFT */}
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="space-y-5"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/25 text-yellow-300 text-xs font-bold uppercase tracking-wider">
        About 1C Trader
      </div>

      <h2 className="text-2xl md:text-4xl font-black leading-tight">
        Built for{" "}
        <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          consistent earning
        </span>{" "}
        & clean investing.
      </h2>

      <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-xl">
        1C Trader is a professional investing and earning platform designed to
        keep things simple: choose a plan, complete daily tasks, and track your
        progress with transparent stats. Our goal is to provide structured market
        exposure across crypto, oil and AI strategies — with clear dashboards and
        smooth user experience.
      </p>

      {/* points */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-black/40 border border-gray-800/60 rounded-2xl p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            Transparent System
          </div>
          <div className="text-sm font-bold text-white mt-1">
            Earnings, ROI & team rewards clearly shown
          </div>
        </div>

        <div className="bg-black/40 border border-gray-800/60 rounded-2xl p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            Professional UX
          </div>
          <div className="text-sm font-bold text-white mt-1">
            Clean dashboards + easy investing flow
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate("/plans#plans")}
          className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-black border border-yellow-500 shadow-lg hover:shadow-yellow-500/30"
          type="button"
        >
          View Plans
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate("/login")}
          className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-white/5 border border-gray-800/70 text-gray-200 font-black hover:bg-white/10"
          type="button"
        >
          Sign In
        </motion.button>
      </div>
    </motion.div>

    {/* RIGHT */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="relative"
    >
      <div className="relative overflow-hidden rounded-3xl border border-gray-800/60 bg-black/30 p-3">
        <img
        src="/image/man-woman-making-deal-work.jpg"
          alt="About 1C Trader"
          className="w-full h-72 md:h-96 object-cover rounded-2xl"
        />
        <div className="absolute top-5 left-5 bg-black/60 backdrop-blur-xl border border-gray-800/60 rounded-2xl px-4 py-2">
          <div className="text-[10px] uppercase tracking-wider text-gray-400">
            Professional Platform
          </div>
          <div className="text-sm font-black text-white">1C Trader</div>
        </div>
      </div>
    </motion.div>
  </div>
</section>


{/* ✅ HAPPY & PROFITABLE PEOPLE SECTION */}
<section className="bg-gradient-to-r from-gray-900/40 to-black/50 border border-gray-800/60 backdrop-blur-xl rounded-3xl p-6 md:p-10">
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
    <div>
      <div className="text-xs uppercase tracking-wider text-gray-500">
        Community Proof
      </div>
      <h2 className="text-2xl md:text-4xl font-black text-white mt-1">
        Happy people.{" "}
        <span className="text-yellow-400">Profitable results.</span>
      </h2>
      <p className="text-sm md:text-base text-gray-400 mt-2 max-w-2xl">
        Members are growing with structured investing, daily task consistency and
        transparent team rewards.
      </p>
    </div>

    {/* stats chips */}
    <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
      <div className="rounded-2xl border border-gray-800/60 bg-black/40 p-3 text-center">
        <div className="text-[10px] text-gray-500 uppercase">Daily ROI</div>
        <div className="text-sm font-black text-green-400">Stable</div>
      </div>
      <div className="rounded-2xl border border-gray-800/60 bg-black/40 p-3 text-center">
        <div className="text-[10px] text-gray-500 uppercase">Dashboard</div>
        <div className="text-sm font-black text-yellow-300">Clear</div>
      </div>
      <div className="rounded-2xl border border-gray-800/60 bg-black/40 p-3 text-center">
        <div className="text-[10px] text-gray-500 uppercase">Support</div>
        <div className="text-sm font-black text-white">24/7</div>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* image card 1 */}
    <div className="lg:col-span-1 overflow-hidden rounded-3xl border border-gray-800/60 bg-black/30">
      <img
        src="/image/happy-businessman.jpg"
        alt="Happy people"
        className="w-full h-56 lg:h-full object-cover"
      />
    </div>

    {/* testimonials */}
    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        {
          name: "Elon john",
          tag: "Consistent daily returns",
          text: "Dashboard is clean, tasks are simple, and ROI tracking is transparent. I can see my progress daily.",
          profit: "+$1.8k",
        },
        {
          name: "Sara Malik",
          tag: "Easy plan system",
          text: "Plans are clear and the earning flow is smooth. I like the referral structure and team tracking.",
          profit: "+$42.4k",
        },
        {
          name: "George ",
          tag: "Professional UI",
          text: "Everything looks professional. I can check profits and history without confusion.",
          profit: "+$30.1k",
        },
        {
          name: "Fatima S.",
          tag: "Team growth",
          text: "Referral system helped me grow a team. Commissions and stats are always visible.",
          profit: "+$26.0k",
        },
      ].map((t, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="bg-black/40 border border-gray-800/60 rounded-3xl p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-black text-white truncate">{t.name}</div>
              <div className="text-[11px] text-gray-500 mt-1">{t.tag}</div>
            </div>
            <div className="shrink-0 px-3 py-1 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-black">
              {t.profit}
            </div>
          </div>
          <p className="text-sm text-gray-300 mt-4 leading-relaxed">
            “{t.text}”
          </p>
        </motion.div>
      ))}
    </div>
  </div>

  {/* profitable image strip */}
  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="rounded-3xl overflow-hidden border border-gray-800/60 bg-black/30">
      <img
          src="image/confident-handsome-hispanic-financial-broker-showing-fist-computer-screen-while-trading-from-home.jpg"

        alt="Profitable people"
        className="w-full h-44 object-cover"
      />
    </div>

    <div className="rounded-3xl border border-gray-800/60 bg-black/40 p-5 md:col-span-2">
      <div className="text-xs uppercase tracking-wider text-gray-500">
        Why members stay
      </div>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-black/40 border border-gray-800/60 p-4">
          <div className="text-[10px] text-gray-500 uppercase">Plans</div>
          <div className="text-sm font-black text-white mt-1">Simple & clear</div>
        </div>
        <div className="rounded-2xl bg-black/40 border border-gray-800/60 p-4">
          <div className="text-[10px] text-gray-500 uppercase">Tasks</div>
          <div className="text-sm font-black text-white mt-1">Daily routine</div>
        </div>
        <div className="rounded-2xl bg-black/40 border border-gray-800/60 p-4">
          <div className="text-[10px] text-gray-500 uppercase">Rewards</div>
          <div className="text-sm font-black text-white mt-1">Team + ROI</div>
        </div>
      </div>
    </div>
  </div>
</section>




<footer className="w-full border-t border-gray-800/60 bg-black/40 backdrop-blur-xl">
  <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
    {/* Brand */}
    <div>
      <div className="text-xl font-black text-white">
        1C{" "}
        <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          TRADER
        </span>
      </div>
      <p className="text-sm text-gray-400 mt-3 leading-relaxed max-w-xs">
        Professional investing & earning platform with transparent rewards, clean dashboards,
        and daily progress tracking.
      </p>

     
    </div>

    {/* Quick Links */}
    <div>
      <div className="text-xs uppercase tracking-wider text-gray-500 mb-4">Quick Links</div>
      <div className="space-y-2 text-sm">
        <Link className="text-gray-300 hover:text-yellow-400 transition" to="/plans">
          Plans
        </Link>
        <div />
        <Link className="text-gray-300 hover:text-yellow-400 transition" to="/login">
          Login
        </Link>
        <div />
        <Link className="text-gray-300 hover:text-yellow-400 transition" to="/">
          Dashboard
        </Link>
      </div>
    </div>

    {/* Resources */}
    <div>
      <div className="text-xs uppercase tracking-wider text-gray-500 mb-4">Resources</div>
      <div className="space-y-2 text-sm text-gray-300">
        <button
          onClick={() => document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" })}
          className="text-left hover:text-yellow-400 transition"
          type="button"
        >
          Start Investing
        </button>
        <div />
        <a className="hover:text-yellow-400 transition" href="#">
          Help Center
        </a>
        <div />
        <a className="hover:text-yellow-400 transition" href="#">
          FAQ
        </a>
      </div>
    </div>

    {/* Community */}
   

      <div className="mt-4 bg-black/30 border border-gray-800/60 rounded-2xl p-4">
        <div className="text-xs uppercase tracking-wider text-gray-500">Support</div>
        <div className="text-sm text-gray-300 mt-1">support@1cglobal.ch</div>
        <div className="text-xs text-gray-500 mt-1">Response within 24 hours</div>
      </div>
    </div>
  

  <div className="border-t border-gray-800/60">
    <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="text-xs text-gray-500">
        © {new Date().getFullYear()} 1C Trader. All rights reserved.
      </div>

      <div className="flex items-center gap-4 text-xs">
        <Link to="/terms" className="text-gray-500 hover:text-yellow-400 transition">
          Terms
        </Link>
        <Link to="/privacy" className="text-gray-500 hover:text-yellow-400 transition">
          Privacy
        </Link>
      </div>
    </div>
  </div>
</footer>

    </div>
   
    {/* // COMPACT RESPONSIVE MODAL - Existing Theme Match */}






   </>
  )
}
