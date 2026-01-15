import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaCoins,
  FaTasks,
  FaWallet,
  FaChartLine,
  FaArrowRight,
  FaHistory,
  FaCrown,
  FaArrowLeft,FaStar
} from "react-icons/fa";
import { useNavigate,useLocation, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import InvestPlanCards from "./InvestPlanCards"; // ✅ add
import Alert from "./Alert";
import { FaUserFriends } from "react-icons/fa"; // ✅ new icon
import ReferralSection from "./ReferralSection"; // ✅ new component
import Analytics from "./analytics";
import Wallet from "./wallet";


export default function UserDashboard({ me }) {
  const navigate = useNavigate();
  const { FetchUserData, HandleFetchUserData ,showAlert ,alert} = useAppContext();
//console.log(FetchUserData);
  const location = useLocation();
  const [showPlans, setShowPlans] = useState(false); // ✅ toggle
//console.log('FetchUserData',FetchUserData);
const [showReferral, setShowReferral] = useState(false);

const [showAnalytics, setShowAnalytics] = useState(false);
const [searchParams] = useSearchParams();
useEffect(() => {
  const tab = searchParams.get("tab");

  setShowAnalytics(tab === "analytics");
  setShowWallet(tab === "wallet");

  // agar wallet ya analytics open ho to plans/referral close (optional)
  if (tab === "wallet" || tab === "analytics") {
    setShowPlans(false);
    setShowReferral(false);
  }
}, [searchParams]);

  // ✅ Fetch once / safe (recommended)
  useEffect(() => {
     HandleFetchUserData();
  }, [ HandleFetchUserData]);

  // ✅ URL se control: /plans => plans open
  useEffect(() => {
    if (location.pathname === "/plans") {
      setShowPlans(true);
    } else {
      setShowPlans(false);
    }
  }, [location.pathname]);
  const stats = useMemo(() => {
     const activePlanArr = Array.isArray(FetchUserData?.activePlan)
    ? FetchUserData.activePlan
    : [];
    return {
      name: FetchUserData?.name || me?.email || "Investor",
      email: FetchUserData?.email || "",
      walletConnected: !!FetchUserData?.walletAddress,
      points: FetchUserData?.TotalPoints ?? 0,
      totalEarnings: FetchUserData?.totalEarnings ?? 0,
      todayTasks: FetchUserData?.todayTasksCompleted ?? 0,
isActivePlan: !!FetchUserData?.isActivePlan,
isActive: !!FetchUserData?.isActive,   
   activePlan: activePlanArr    ,
level: Number(FetchUserData?.level ?? 0),

  
  
  };
  }, [FetchUserData, me]);
const PLAN_LABELS = {
  plan1: "Core Growth",
  plan2: "Institutional Blend",
  plan3: "Founder’s Syndicate",
};
const [showWallet, setShowWallet] = useState(false);

  const quickActions = useMemo(
    () => [
      {
        icon: FaCoins,
        title: "Start Investment",
        desc: "Choose a plan & invest",
        onClick: () => setShowPlans(true), // ✅ was navigate("/investment")
      },
       {
      icon: FaUserFriends,
      title: "Referral Program",
      desc: "Invite friends & earn rewards",
      onClick: () => setShowReferral(true),
    },
      {
        icon: FaWallet,
        title: "Wallet",
        desc: "Balance & history",
        onClick: () => navigate("?tab=wallet"),
      },
      {
        icon: FaChartLine,
        title: "Analytics",
        desc: "ROI & performance",
        onClick: () => navigate("?tab=analytics"),
      },
    ],
    [navigate]
  );

  const recentActivity = useMemo(
    () => [
      { title: "Daily Task Completed", meta: "+20 points • Today", badge: "Task" },
      { title: "Investment Pending", meta: "USDT deposit verification", badge: "Invest" },
      { title: "Referral Bonus", meta: "+$5.00 • Yesterday", badge: "Referral" },
    ],
    []
  );

  const progressPercent = Math.min(100, (stats.todayTasks / 5) * 100);

  
 const planName = useMemo(() => {
  if (!stats.isActivePlan) return "No plan select";
  const last = stats.activePlan?.[stats.activePlan.length - 1];
  return ('$'+ last?.plan?.amount )|| "Active";
}, [stats.isActivePlan, stats.activePlan]);

  // ✅ If plans open -> only show InvestPlanCards
  if (showPlans) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPlans(false)}
            className="px-5 py-3 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-200 font-bold"
          >
            <FaArrowLeft className="inline mr-2" />
            Back to Dashboard
          </motion.button>

         
        </div>

        <InvestPlanCards />
      </div>
    );
  }
if (showReferral) {
  return (
    <div className="space-y-6">
      <ReferralSection
        code={FetchUserData?.referralCode || FetchUserData?._id}
        onBack={() => setShowReferral(false)}
      />
    </div>
  );
}
if (showAnalytics) {
  return (
    <div className="space-y-6">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/")} // back to dashboard
        className="px-5 py-3 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-200 font-bold"
      >
        <FaArrowLeft className="inline mr-2" />
        Back to Dashboard
      </motion.button>

      <Analytics />
    </div>
  );
}
if (showWallet) {
  return (
    <div className="space-y-6">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/")} // back dashboard (clears query)
        className="px-5 py-3 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-200 font-bold"
      >
        <FaArrowLeft className="inline mr-2" />
        Back to Dashboard
      </motion.button>

      <Wallet />
    </div>
  );
}

  // ✅ Normal dashboard
  return (
    <>
{/* Alert Component */}
      <div>

  <Alert  className="mt-24"
            type={alert.type} 
            message={alert.message} 
            isOpen={alert.isOpen}
            onClose={() => showAlert({ isOpen: false, type: '', message: '' })}
          />
      </div>
   


    <div className="space-y-12">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/60 backdrop-blur-xl border border-gray-800/60 rounded-3xl p-6 md:p-8 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/25">
              <FaUserCircle className="w-8 h-8 text-gray-900" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-500">
                Welcome back
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
                {stats.name}
              </h1>
              <div className="text-sm text-gray-400 mt-1">
                {stats.isActive ? "online" : "offline"} • Wallet:{" "}
                <span className="text-yellow-400 font-semibold">
                  {stats.walletConnected ? "Connected" : "Not Connected"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {!stats.isActivePlan &&   <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPlans(true)} // ✅ changed
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-black border border-yellow-500 shadow-lg shadow-yellow-500/20"
            >
              Invest Now <FaArrowRight className="inline ml-2" />
            </motion.button>
            }

            
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <StatCard title="Level" value={stats.level} icon={FaCrown} />
          <StatCard
            title="Total Earnings"
            value={`$${Number(stats.totalEarnings).toFixed(2)}`}
            icon={FaCoins}
          />
 <StatCard
    title="Points"
    value={stats.points}
    icon={FaStar} // ya koi aur icon (FaTrophy)
  />         <StatCard
  title= {`Plan Status: ${stats.isActivePlan ? "Active" : "Inactive"}`}
  value={planName}
  icon={FaChartLine}
/>

        </div>

        {/* Progress */}
        <div className="mt-6 bg-black/40 border border-gray-800/60 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold text-gray-200">Today Progress</div>
            <div className="text-xs text-gray-500">{Math.round(progressPercent)}%</div>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Complete 5 tasks to unlock today’s rewards.
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <section>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-black text-white mb-6"
        >
          Quick Actions
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((a, idx) => (
            <motion.button
              key={idx}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              onClick={a.onClick}
              className="text-left bg-black/55 backdrop-blur-xl border border-gray-800/60 rounded-3xl p-6 hover:border-yellow-500/40 transition-all shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center mb-4">
                <a.icon className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="font-black text-white">{a.title}</div>
              <div className="text-sm text-gray-400 mt-1">{a.desc}</div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      {/* <section>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-black text-white mb-6 flex items-center gap-2"
        >
          <FaHistory className="text-yellow-400" /> Recent Activity
        </motion.h2>

        <div className="bg-black/55 backdrop-blur-xl border border-gray-800/60 rounded-3xl p-6">
          <div className="space-y-4">
            {recentActivity.map((x, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 bg-black/40 border border-gray-800/50 rounded-2xl p-4"
              >
                <div>
                  <div className="font-bold text-white">{x.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{x.meta}</div>
                </div>
                <div className="px-3 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-bold">
                  {x.badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
    </>

  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-black/40 border border-gray-800/60 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-gray-500">{title}</div>
        <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center">
          <Icon className="w-4 h-4 text-yellow-400" />
        </div>
      </div>
      <div className="text-2xl font-black text-white mt-3">{value}</div>
      {/* <div className="text-xs text-gray-500 mt-1">Updated just now</div> */}
    </div>


  );
}
