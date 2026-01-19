// src/components/AboutUs.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaBolt,
  FaGlobe,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import TopNavbar from "./TopNavbar";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

 export default function AboutUs() {
 const navigate = useNavigate();

  return (

    <>
    <TopNavbar/>
    <div className="min-h-screen w-full mt-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      {/* subtle grid */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(75,85,99,0.35)_1px,transparent_1px),linear-gradient(rgba(75,85,99,0.35)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20 space-y-12">
        {/* HERO */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl rounded-3xl border border-gray-800/60 overflow-hidden"
        >
          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs font-bold">
                About 1C Global TRADER
              </div>

              <h1 className="text-3xl md:text-5xl font-black leading-tight">
                Built for{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  professional investing
                </span>{" "}
                and steady earning.
              </h1>
<p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl">
  1C TRADER is a structured investing & earning platform designed for users who want a clean,
  trackable routine. You choose a plan, complete daily tasks, and your daily ROI credit is calculated
  on your plan amount and recorded in a transparent ledger. Every credit, every day, stays visible
  inside your dashboard—so you can measure progress instead of guessing.
</p>


              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/plans")}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-black border border-yellow-500 hover:opacity-95 transition inline-flex items-center justify-center gap-2"
                >
                  View Plans <FaArrowRight />
                </button>

                <Link
                  to="/login"
                  className="px-8 py-4 rounded-2xl bg-black/40 border border-gray-800/60 text-white font-bold hover:border-yellow-500/40 hover:bg-black/60 transition inline-flex items-center justify-center"
                >
                  Create Account
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
                <MiniKpi label="Transparent Credits" value="Daily" />
                <MiniKpi label="Dashboard" value="Real-time" />
                <MiniKpi label="Support" value="24/7" />
              </div>
            </div>

            {/* right visual */}
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-56 h-56 rounded-[40px] bg-gradient-to-br from-yellow-500/30 to-yellow-600/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-[40px] bg-gradient-to-br from-emerald-500/15 to-transparent blur-2xl" />

              <div className="relative bg-black/40 border border-gray-800/60 rounded-3xl p-6 shadow-2xl">
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  Execution Snapshot
                </div>

                <div className="mt-4 space-y-3">
                  <StatRow title="Plan Tracking" value="Live" />
                  <StatRow title="Task Validation" value="Secure" />
                  <StatRow title="Credits Ledger" value="Auditable" />
                </div>

                <div className="mt-6 bg-black/30 border border-gray-800/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-gray-200">Performance Bar</div>
                    <div className="text-xs text-gray-500">Example</div>
                  </div>

                  <div className="mt-3 h-3 w-full bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-3 w-[72%] bg-gradient-to-r from-yellow-400 to-yellow-600" />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>Stable progress</span>
                    <span className="text-yellow-300 font-bold">72%</span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Tag text="Low-noise UI" />
                  <Tag text="Fast workflows" />
                  <Tag text="Clean ledger" />
                  <Tag text="Pro feel" />
                </div>
              </div>
            </div>
          </div>









          
        </motion.section>

        {/* VALUES */}
      <motion.section
  variants={fadeUp}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.25 }}
  className="bg-black/40 border border-gray-800/60 rounded-3xl p-8 md:p-12"
>
  <div className="flex items-end justify-between gap-4 flex-wrap">
    <div>
      <div className="text-xs uppercase tracking-wider text-gray-500">Why choose us</div>
      <h2 className="text-2xl md:text-3xl font-black mt-2">
        Designed to feel professional — built to stay transparent
      </h2>
      <p className="text-gray-400 mt-3 max-w-3xl leading-relaxed">
        Many platforms show numbers but hide the logic. We focus on clarity: plan amount, ROI%, daily credit,
        and full history inside your dashboard. You always understand how profit was credited and where each
        earning source came from.
      </p>
    </div>

    <button
      onClick={() => navigate("/contact")}
      className="px-5 py-3 rounded-2xl bg-black/40 border border-gray-800/60 text-white font-bold hover:border-yellow-500/40 hover:bg-black/60 transition inline-flex items-center gap-2"
    >
      Contact Support <FaArrowRight />
    </button>
  </div>

  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <WhyCard title="Transparent ledger" desc="Every daily credit is recorded with date + ROI%." />
    <WhyCard title="Clean dashboard" desc="Professional UI with clear earnings breakdown." />
    <WhyCard title="Routine-based earning" desc="Tasks build consistency and accountability." />
    <WhyCard title="Network rewards" desc="Referral + team benefits shown separately." />
  </div>
</motion.section>

        {/* HOW IT WORKS */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl rounded-3xl border border-gray-800/60"
        >
          <div className="p-8 md:p-12">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  How it works
                </div>
                <h2 className="text-2xl md:text-3xl font-black mt-2">
                  Simple flow. Professional outcome.
                </h2>
              <p className="text-gray-400 mt-3 max-w-2xl">
  Your plan profit is calculated daily based on your plan amount and the configured ROI% for that plan.
  After tasks completion, the system credits your earnings and stores it in the plan ledger (date + amount + ROI%),
  so you always know how the number was made.
</p>

              </div>

              <button
                onClick={() => navigate("/plans")}
                className="px-5 py-3 rounded-2xl bg-black/40 border border-gray-800/60 text-white font-bold hover:border-yellow-500/40 hover:bg-black/60 transition inline-flex items-center gap-2"
              >
                Explore Plans <FaArrowRight />
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Step
                n="01"
                title="Select a plan"
                desc="Pick an amount-based plan. Your dashboard tracks principal, daily rate, and plan profit."
              />
              <Step
                n="02"
                title="Complete daily tasks"
                desc="A clear checklist unlocks daily credit eligibility—simple routine, consistent progress."
              />
              <Step
                n="03"
                title="Get credited"
                desc="Credits appear inside the plan ledger and earnings breakdown—no confusion, no hidden logic."
              />
            </div>
          </div>
        </motion.section>

       
        <motion.section
  variants={fadeUp}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.25 }}
  className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl rounded-3xl border border-gray-800/60"
>
  <div className="p-8 md:p-12">
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <div className="text-xs uppercase tracking-wider text-gray-500">Earnings & calculation</div>
        <h2 className="text-2xl md:text-3xl font-black mt-2">
          Clear profit logic — recorded day by day
        </h2>
        <p className="text-gray-400 mt-3 max-w-3xl leading-relaxed">
          We don’t hide your numbers. Your dashboard shows plan amount, daily ROI%, credited profit, and total profit.
          Credits are only added when your daily routine is completed, so your earning path stays disciplined and consistent.
        </p>
      </div>
    </div>

    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calculation Card */}
      <div className="bg-black/40 border border-gray-800/60 rounded-3xl p-7">
        <div className="text-xs uppercase tracking-wider text-gray-500">Example calculation</div>
        <div className="mt-3 text-lg font-black text-white">
          Daily Profit = Plan Amount × (ROI% / 100)
        </div>

        <div className="mt-4 space-y-3 text-sm text-gray-300">
          <div className="bg-black/30 border border-gray-800/60 rounded-2xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Example</div>
            <div className="mt-2">
              If Plan Amount = <span className="text-yellow-300 font-bold">$100</span> and Daily ROI ={" "}
              <span className="text-yellow-300 font-bold">2%</span>
            </div>
            <div className="mt-2">
              Daily Profit = 100 × (2/100) = <span className="text-green-300 font-black">$2.00</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 leading-relaxed">
            ROI% depends on the plan configuration. Your ledger stores {`{ date, amount, roiPct }`} for audit clarity.
          </div>
        </div>
      </div>

      {/* Benefits Card */}
      <div className="bg-black/40 border border-gray-800/60 rounded-3xl p-7">
        <div className="text-xs uppercase tracking-wider text-gray-500">User benefits</div>
        <div className="mt-3 text-xl font-black text-white">More control. Less confusion.</div>

        <div className="mt-5 space-y-3">
          <BenefitLine text="Daily profit is visible immediately after credit." />
          <BenefitLine text="Your earnings are broken into ROI, referrals, and team rewards." />
          <BenefitLine text="Plan ledger keeps records of every day credit." />
          <BenefitLine text="A simple routine builds consistency and long-term discipline." />
        </div>
      </div>

      {/* Good Effects Card */}
      <div className="bg-black/40 border border-gray-800/60 rounded-3xl p-7">
        <div className="text-xs uppercase tracking-wider text-gray-500">Good effect on user</div>
        <div className="mt-3 text-xl font-black text-white">A structured earning lifestyle</div>

        <p className="text-gray-400 mt-3 leading-relaxed">
          Users often fail in investing because they act without tracking. Our platform creates a consistent system:
          routine tasks, verified actions, and recorded outputs. This improves financial discipline and keeps your
          decisions data-driven instead of emotional.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MiniKpi label="Routine" value="Daily" />
          <MiniKpi label="Tracking" value="Ledger" />
          <MiniKpi label="Clarity" value="High" />
          <MiniKpi label="Control" value="Better" />
        </div>
      </div>
    </div>
  </div>
</motion.section>
{/* TEAM SECTION */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="relative"
        >
          <div className="text-center space-y-3 mb-12">
            <div className="text-xs uppercase tracking-wider text-yellow-500 font-bold">Expert Minds</div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Meet Our Team</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Behind 1C Global TRADER is a dedicated team of analysts, developers, and support specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <TeamCard 
              name="Alex Rivera" 
              role="Chief Strategist" 
              img="image/Alex Rivera.avif" 
            />
            <TeamCard 
              name="Sarah Chen" 
              role="Lead Developer" 
              img="image/Sarah Chen.avif" 
            />
            <TeamCard 
              name="Marcus Thorne" 
              role="Risk Analyst" 
              img="image/Marcus Thorne.avif" 
            />
            <TeamCard 
              name="Elena Petrova" 
              role="Operations Head" 
              img="image/Elena Petrova.avif" 
            />
            <TeamCard 
              name="David Smith" 
              role="Support Lead" 
              img="image/David Smith.avif" 
            />
          </div>
        </motion.section>
      </div>
      <footer className="w-full border-t border-gray-800/60 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="text-xl font-black text-white">
              1C Global{" "}
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
              © {new Date().getFullYear()} 1C Global Trader. All rights reserved.
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
    
  </>
  );
}

// {/* /* -------------------- small components -------------------- */ */}

function MiniKpi({ label, value }) {
  return (
    <div className="bg-black/30 border border-gray-800/60 rounded-2xl px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-gray-500">{label}</div>
      <div className="text-sm font-black text-white mt-1">{value}</div>
    </div>
  );
}

function StatRow({ title, value }) {
  return (
    <div className="bg-black/30 border border-gray-800/60 rounded-2xl px-4 py-3 flex items-center justify-between">
      <div className="text-sm font-bold text-gray-200">{title}</div>
      <div className="text-xs font-black text-yellow-300">{value}</div>
      </div>
  );
}

function Tag({ text }) {
  return (
    <div className="text-[11px] text-gray-300 bg-black/30 border border-gray-800/60 rounded-2xl px-3 py-2">
      {text}
    </div>
  );
}

function ValueCard({ icon: Icon, title, desc, accent = "yellow" }) {
  const accentWrap =
    accent === "green"
      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
      : accent === "blue"
      ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
      : "bg-yellow-500/10 border-yellow-500/20 text-yellow-300";

  return (
    <div className="bg-black/40 border border-gray-800/60 rounded-3xl p-7 md:p-8">
      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${accentWrap}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="mt-4 text-xl font-black text-white">{title}</div>
      <div className="mt-2 text-sm text-gray-400 leading-relaxed">{desc}</div>
    </div>
  );
}

function Step({ n, title, desc }) {
  return (
    <div className="bg-black/40 border border-gray-800/60 rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div className="text-xs font-black text-yellow-300">{n}</div>
        <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/20" />
      </div>
      <div className="mt-4 text-lg font-black text-white">{title}</div>
      <div className="mt-2 text-sm text-gray-400 leading-relaxed">{desc}</div>
    </div>
  );
}

function Bullet({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 w-5 h-5 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-green-400" />
      </div>
      <div className="text-sm text-gray-300 leading-relaxed">{text}</div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="bg-black/30 border border-gray-800/60 rounded-2xl px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-gray-500">{label}</div>
      <div className="text-sm font-black text-white mt-1">{value}</div>
    </div>

);
}
function BenefitLine({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 w-6 h-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
        <FaCheckCircle className="text-yellow-300 w-3.5 h-3.5" />
      </div>
      <div className="text-sm text-gray-300 leading-relaxed">{text}</div>
    </div>
  );
}
function WhyCard({ title, desc }) {
  return (
    <div className="bg-black/30 border border-gray-800/60 rounded-3xl p-6">
      <div className="text-lg font-black text-white">{title}</div>
      <div className="mt-2 text-sm text-gray-400 leading-relaxed">{desc}</div>
    </div>
  );
}
function TeamCard({ name, role, img }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-black/40 border border-gray-800/60 rounded-3xl p-5 text-center group transition-all hover:border-yellow-500/30"
    >
      <div className="relative w-24 h-24 mx-auto mb-4">
        <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <img 
          src={img} 
          alt={name} 
          className="relative w-full h-full object-cover rounded-2xl border-2 border-gray-800 group-hover:border-yellow-500/50 transition-colors"
        />
      </div>
      <div className="font-black text-white text-sm tracking-tight">{name}</div>
      <div className="text-[11px] text-gray-500 uppercase mt-1 font-bold group-hover:text-yellow-400 transition-colors">
        {role}
      </div>
    </motion.div>
  );
}