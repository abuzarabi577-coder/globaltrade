// src/components/ContactUs.jsx
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

      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
        {/* subtle grid */}
        <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(75,85,99,0.35)_1px,transparent_1px),linear-gradient(rgba(75,85,99,0.35)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20 space-y-10">
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
                  If you’re reporting a problem, include your registered email and a screenshot for faster resolution.
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

              {/* Right card */}
              <div className="relative">
                <div className="absolute -top-10 -right-10 w-56 h-56 rounded-[40px] bg-gradient-to-br from-yellow-500/25 to-yellow-600/10 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-[40px] bg-gradient-to-br from-emerald-500/15 to-transparent blur-2xl" />

                <div className="relative bg-black/40 border border-gray-800/60 rounded-3xl p-6 shadow-2xl">
                  <div className="text-xs uppercase tracking-wider text-gray-500">Support channel</div>

                  <div className="mt-4 bg-black/30 border border-gray-800/60 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                        <FaEnvelope className="text-yellow-300" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-black text-white">Email Support</div>
                        <a
                          className="text-sm text-gray-300 hover:text-yellow-300 transition break-all"
                          href="mailto:support@1ctrader.com"
                        >
                         support@1cglobal.ch
                        </a>
                        <div className="text-xs text-gray-500 mt-1">Include: email + issue + screenshot</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Tag text="Account & Login" />
                    <Tag text="Plan & Earnings" />
                    <Tag text="Referral Help" />
                    <Tag text="Security" />
                  </div>

                  <div className="mt-5 text-xs text-gray-500 leading-relaxed">
                    For urgent issues, mention <span className="text-gray-300 font-bold">“URGENT”</span> in the subject line.
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* FAQ */}
          <motion.section
            id="faq"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl rounded-3xl border border-gray-800/60"
          >
            <div className="p-8 md:p-12">
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-500">FAQ</div>
                  <h2 className="text-2xl md:text-3xl font-black mt-2">Common questions</h2>
                  <p className="text-gray-400 mt-3 max-w-3xl leading-relaxed">
                    Quick answers about account creation, account problems, daily profits, referrals, and support.
                  </p>
                </div>

                <div className="text-xs text-gray-500">
                  Tip: Use your registered email when contacting support.
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {faqs.map((item, idx) => (
                  <FaqCard key={idx} icon={item.icon} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          </motion.section>

          {/* SUPPORT SECTION */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="bg-black/40 border border-gray-800/60 rounded-3xl p-8 md:p-10">
              <div className="text-xs uppercase tracking-wider text-gray-500">Support</div>
              <h3 className="text-2xl font-black mt-2">Contact by email</h3>

              <div className="mt-5 bg-black/30 border border-gray-800/60 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                    <FaHeadset className="text-yellow-300" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">Support Email</div>
                    <a
                      className="text-sm text-gray-300 hover:text-yellow-300 transition"
                      href="mailto:support@1ctrader.com"
                    >
                    support@1cglobal.ch
                    </a>
                    <div className="text-xs text-gray-500 mt-1">Typical response within 24 hours</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-400 leading-relaxed">
                For faster support, send:
                <ul className="mt-3 space-y-2">
                  <Bullet text="Your registered email" />
                  <Bullet text="Issue type (Login / Plan / Earnings / Referral)" />
                  <Bullet text="Screenshot or short screen recording (if applicable)" />
                </ul>
              </div>

            </div>

            <div className="bg-black/40 border border-gray-800/60 rounded-3xl p-8 md:p-10">
              <div className="text-xs uppercase tracking-wider text-gray-500">Quick links</div>
              <h3 className="text-2xl font-black mt-2">Navigate faster</h3>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <QuickLink to="/plans" title="View Plans" desc="Explore plan options and ROI details." />
                <QuickLink to="/login" title="Login / Register" desc="Create account or sign in quickly." />
                <QuickLink to="/" title="Dashboard" desc="Track earnings and plan ledger." />
                <QuickLink to="/about" title="About Platform" desc="How our system works and benefits." />
              </div>

              <div className="mt-6 text-xs text-gray-500 leading-relaxed">
                If you’re stuck on a page, share the page name + screenshot via email.
              </div>
            </div>
          </motion.section>

          {/* Footer mini bar */}
          <div className="border-t border-gray-800/60 pt-8 text-xs text-gray-500 flex flex-col md:flex-row items-center justify-between gap-3">
            <div>© {new Date().getFullYear()} 1C Trader. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link className="hover:text-yellow-300 transition" to="/terms">
                Terms
              </Link>
              <Link className="hover:text-yellow-300 transition" to="/privacy">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- small components ---------------- */

function MiniKpi({ label, value }) {
  return (
    <div className="bg-black/30 border border-gray-800/60 rounded-2xl px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-gray-500">{label}</div>
      <div className="text-sm font-black text-white mt-1">{value}</div>
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

function Bullet({ text }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-1 w-5 h-5 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-green-400" />
      </div>
      <div className="text-sm text-gray-300 leading-relaxed">{text}</div>
    </li>
  );
}

function QuickLink({ to, title, desc }) {
  return (
    <Link
      to={to}
      className="group bg-black/30 border border-gray-800/60 rounded-3xl p-5 hover:border-yellow-500/30 hover:bg-black/40 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-black text-white">{title}</div>
          <div className="mt-1 text-xs text-gray-500 leading-relaxed">{desc}</div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/15 transition">
          <FaArrowRight className="text-yellow-300 w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

function FaqCard({ icon: Icon, q, a }) {
  return (
    <details className="group bg-black/40 border border-gray-800/60 rounded-3xl p-6 hover:border-yellow-500/30 transition">
      <summary className="list-none cursor-pointer flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
          <Icon className="text-yellow-300" />
        </div>

        <div className="flex-1">
          <div className="text-sm md:text-base font-black text-white leading-snug">{q}</div>
          <div className="text-xs text-gray-500 mt-1">Tap to view answer</div>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-black/30 border border-gray-800/60 flex items-center justify-center">
          <FaChevronDown className="text-gray-300 group-open:rotate-180 transition-transform" />
        </div>
      </summary>

      <div className="mt-4 text-sm text-gray-400 leading-relaxed pl-16">{a}</div>
    </details>
  );
}
