import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaHeadset,
  FaUserCheck,
  FaLock,
  FaCoins,
  FaUsers,
  FaChevronDown,
  FaArrowRight,
  FaGlobe
} from "react-icons/fa";
import TopNavbar from "./TopNavbar";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function ContactUs() {
  const navigate = useNavigate();

  const faqs = [
    {
      icon: FaUserCheck,
      q: "How do I create an account on 1C TRADER?",
      a: "Go to the Login page and switch to Register. Fill your details, accept terms, and submit. You will receive a verification code—verify your email to complete account setup.",
    },
    {
      icon: FaLock,
      q: "I’m having an account/login problem. What should I do?",
      a: "First confirm you verified your email. Then check your password and network connection. If you still see an error or session issue, contact support with your registered email and a screenshot of the error.",
    },
    {
      icon: FaCoins,
      q: "How do I get daily profits / ROI credits?",
      a: "Your plan must be active and daily tasks must be completed. After completion, the system credits your daily ROI based on your plan settings and records it in your plan ledger (date, amount, ROI%).",
    },
    {
      icon: FaUsers,
      q: "How do I refer a member and earn referral rewards?",
      a: "Open your dashboard and copy your referral link or code. Share it with the user before they register. When they join and activate a plan, your referral rewards will appear in your earnings breakdown.",
    },
    {
      icon: FaHeadset,
      q: "How long does support take to respond?",
      a: "We typically respond within 24 hours. For faster handling, include your registered email, issue details, and screenshots (if any).",
    },
  ];

  return (
    <>
      <TopNavbar />

      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden font-sans">
        {/* subtle grid background */}
        <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(75,85,99,0.35)_1px,transparent_1px),linear-gradient(rgba(75,85,99,0.35)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20 space-y-16">
          
          {/* HERO SECTION */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl rounded-3xl border border-gray-800/60 overflow-hidden"
          >
            <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs font-bold">
                  Contact & Support
                </div>
                <h1 className="text-3xl md:text-5xl font-black leading-tight">
                  Need help?{" "}
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    We’ve got you.
                  </span>
                </h1>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl">
                  No forms, no confusion. Check the common FAQs below or reach our support email.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-black border border-yellow-500 hover:opacity-95 transition inline-flex items-center justify-center gap-2"
                  >
                    View FAQs <FaArrowRight />
                  </button>
                  <button
                    onClick={() => navigate("/plans")}
                    className="px-8 py-4 rounded-2xl bg-black/40 border border-gray-800/60 text-white font-bold hover:border-yellow-500/40 hover:bg-black/60 transition inline-flex items-center justify-center"
                  >
                    Explore Plans
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <MiniKpi label="Response Time" value="≤ 24h" />
                  <MiniKpi label="Support" value="Email" />
                  <MiniKpi label="Help" value="FAQs" />
                </div>
              </div>

              <div className="relative">
                <div className="relative bg-black/40 border border-gray-800/60 rounded-3xl p-6 shadow-2xl">
                  <div className="text-xs uppercase tracking-wider text-gray-500">Support channel</div>
                  <div className="mt-4 bg-black/30 border border-gray-800/60 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                        <FaEnvelope className="text-yellow-300" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-black text-white">Email Support</div>
                        <a className="text-sm text-gray-300 hover:text-yellow-300 transition break-all" href="mailto:support@1cglobal.ch">
                          support@1cglobal.ch
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* GLOBAL CONTACT SECTION - FULLY RESPONSIVE */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-10"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-800/60 pb-8 text-center md:text-left">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.2em] text-yellow-500 font-black">Local Contact</div>
                <h2 className="text-3xl md:text-4xl font-black text-white">Global Presence</h2>
              </div>
              <p className="text-gray-500 max-w-sm text-sm leading-relaxed mx-auto md:mx-0">
                Direct access to our regional departments for localized assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <LocalContactCard flagImg="https://flagcdn.com/w160/de.png" country="Germany" email="germany@1cglobal.ch" />
              <LocalContactCard flagImg="https://flagcdn.com/w160/tr.png" country="Turkey" email="turkey@1cglobal.ch" />
              <LocalContactCard flagImg="https://flagcdn.com/w160/gb.png" country="London (UK)" email="london@1cglobal.ch" />
              <LocalContactCard flagImg="https://flagcdn.com/w160/id.png" country="Indonesia" email="indonesia@1cglobal.ch" />
              <LocalContactCard flagImg="https://flagcdn.com/w160/ru.png" country="Russia" email="russia@1cglobal.ch" />
            </div>
          </motion.section>

          {/* FAQ SECTION */}
          <motion.section
            id="faq"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl rounded-3xl border border-gray-800/60 p-8 md:p-12"
          >
            <h2 className="text-2xl md:text-3xl font-black mb-8">Common Questions</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {faqs.map((item, idx) => (
                <FaqCard key={idx} icon={item.icon} q={item.q} a={item.a} />
              ))}
            </div>
          </motion.section>

          {/* FOOTER */}
          <div className="border-t border-gray-800/60 pt-8 text-xs text-gray-500 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <div>© {new Date().getFullYear()} 1C Trader. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link className="hover:text-yellow-300 transition" to="/terms">Terms</Link>
              <Link className="hover:text-yellow-300 transition" to="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- HELPER COMPONENTS ---------------- */

function LocalContactCard({ flagImg, country, email }) {
  return (
    <div className="group relative bg-gradient-to-b from-gray-900/40 to-black/60 border border-gray-800/60 rounded-[2rem] p-6 transition-all duration-500 hover:border-yellow-500/50 hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.25)] flex flex-col items-center text-center">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <FaGlobe className="text-5xl text-white" />
      </div>
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-yellow-500/50 transition-all duration-500 mb-4 mx-auto shadow-xl">
          <img src={flagImg} alt={country} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
        </div>
        <h3 className="text-base font-black text-white group-hover:text-yellow-400 transition-colors uppercase tracking-tight">{country}</h3>
        <div className="w-6 h-1 bg-yellow-500/20 rounded-full my-3 mx-auto group-hover:w-12 group-hover:bg-yellow-500 transition-all duration-500" />
        <a href={`mailto:${email}`} className="text-[11px] text-gray-400 hover:text-white transition-colors block break-all font-mono underline underline-offset-4 decoration-gray-800 group-hover:decoration-yellow-500/50">
          {email}
        </a>
      </div>
    </div>
  );
}

function MiniKpi({ label, value }) {
  return (
    <div className="bg-black/30 border border-gray-800/60 rounded-2xl px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-gray-500">{label}</div>
      <div className="text-sm font-black text-white mt-1">{value}</div>
    </div>
  );
}

function FaqCard({ icon: Icon, q, a }) {
  return (
    <details className="group bg-black/40 border border-gray-800/60 rounded-3xl p-6 hover:border-yellow-500/30 transition">
      <summary className="list-none cursor-pointer flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
          <Icon className="text-yellow-300" />
        </div>
        <div className="flex-1">
          <div className="text-sm md:text-base font-black text-white leading-snug">{q}</div>
        </div>
        <FaChevronDown className="text-gray-300 group-open:rotate-180 transition-transform mt-1" />
      </summary>
      <div className="mt-4 text-sm text-gray-400 leading-relaxed pl-16">{a}</div>
    </details>
  );
}