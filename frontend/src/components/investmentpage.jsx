import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCoins, FaArrowLeft, FaWallet } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import Alert from "./Alert";
import ConfirmInvestmentModal from "./ConfirmInvestmentModal";
import InvoiceModal from "./InvoiceModal";

const InvestmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const {
    HandleFetchUserData,
    FetchUserData,
    HandleCreateInvestmentPlan,
    alert,
    showAlert,
    PaymentINV,
    fetchLatestInvoice,
    invoice,         // ✅ add this in context
    loading          // ✅ add loading in context
  } = useAppContext();

  // ✅ coming from cards
  const { name, amount } = location.state || {};
const baseAmount = Number(amount || 0);

const [customAmount, setCustomAmount] = useState(baseAmount);
  // ✅ plan state
  const [selectedPlan, setSelectedPlan] = useState({
    name: name || "",
    amount: amount || "",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  // ✅ Fetch user + latest invoice once
  useEffect(() => {
    HandleFetchUserData();
    fetchLatestInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ keep plan synced
useEffect(() => {
  const a = Number(amount || 0);
  setSelectedPlan((prev) => ({
    ...prev,
    name: name || prev.name,
    amount: a,
  }));
  setCustomAmount(a);
}, [name, amount]);

  const userWalletAddress = FetchUserData?.walletAddress || "";
  const userNetwork = FetchUserData?.network || "";

  const maskedWallet = useMemo(() => {
    if (!userWalletAddress) return "";
    const first = userWalletAddress.slice(0, 5);
    const stars = "*".repeat(Math.min(10, Math.max(4, userWalletAddress.length - 5)));
    return `${first}...${stars}`;
  }, [userWalletAddress]);

  const handleProceed = async () => {

const payload = {
    ...selectedPlan,
    amount: Number(customAmount || 0),
  };

    const ok = await HandleCreateInvestmentPlan(payload);
    if (ok) {
      await fetchLatestInvoice();   // ✅ ensure latest is in state
      setConfirmOpen(false);
      setInvoiceOpen(true);
    }
  };
const PLAN_NAME_MAP = {
  plan1: "Core Growth",
  plan2: "Institutional Blend",
  plan3: "Founder’s Syndicate",
};
const getPlanDisplayName = (planKey) => {
  if (!planKey) return "";
  return PLAN_NAME_MAP[planKey.toLowerCase()] || planKey;
};
const finalPlan = useMemo(() => ({
  ...selectedPlan,
  amount: Number(customAmount || 0),
}), [selectedPlan, customAmount]);

  // ✅ safety
  if (!name || !amount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="max-w-md w-full bg-slate-900/60 border border-slate-700 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold mb-2">No Plan Selected</h2>
          <p className="text-slate-400 mb-6">Please choose an investment plan first.</p>
          <button
            onClick={() => navigate("/plans")}
            className="px-6 py-3 rounded-xl bg-yellow-500 text-black font-bold"
          >
            Go to Plans
          </button>
        </div>
      </div>
    );
  }

  // ✅ Invoice source (works on refresh too)
  const invoiceData = PaymentINV || invoice || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white p-4 pb-20">
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => showAlert({ isOpen: false, type: "", message: "" })}
      />

      {/* ✅ MODALS */}
      <ConfirmInvestmentModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onProceed={handleProceed}
        plan={finalPlan}
        loading={loading}
      />

      <InvoiceModal
        open={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        invoice={invoiceData}
      />

      <div className="max-w-md mx-auto">
        {/* BACK */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 p-3 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-700 text-slate-300"
          whileHover={{ scale: 1.02 }}
        >
          <FaArrowLeft />
          Back
        </motion.button>

        {/* HEADER */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <FaCoins className="w-10 h-10 text-slate-900" />
          </div>
<h1 className="text-3xl font-bold mb-2">
  {getPlanDisplayName(selectedPlan.name)}
</h1>
          <p className="text-slate-400">Complete payment details</p>
        </motion.div>

        {/* PLAN CARD */}
        <motion.div
          className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-2xl p-6 mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >

<div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-3">
  ${Number(customAmount || 0)}
</div>
<div className="text-xs text-slate-400 mb-2">
  Base Plan: <span className="text-slate-200 font-semibold">${baseAmount}</span>
</div>

       {/* ✅ Increase Investment */}
<div className="mt-4 bg-slate-900/40 border border-slate-700/60 rounded-xl p-4 text-left">
  <div className="flex items-center justify-between gap-2 mb-3">
    <div className="text-sm font-semibold text-slate-200">
      Increase Investment
    </div>
    <div className="text-[11px] text-slate-400">
      Min: <span className="text-slate-200 font-semibold">${baseAmount}</span>
    </div>
  </div>

  <div className="grid grid-cols-[56px_1fr_56px] gap-3 items-center">
    <button
      type="button"
      onClick={() => setCustomAmount((p) => Math.max(baseAmount, Number(p || 0) - 10))}
      className="h-12 w-14 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200 hover:border-yellow-500/40"
    >
      -10
    </button>

    <input
      type="number"
      min={baseAmount}
      step="1"
      value={customAmount}
      onChange={(e) => setCustomAmount(Number(e.target.value || 0))}
      className="h-12 w-full px-4 bg-black/40 border border-slate-700/60 rounded-xl text-white outline-none focus:border-yellow-500/50 text-center font-black"
      placeholder="Enter amount"
    />

    <button
      type="button"
      onClick={() => setCustomAmount((p) => Number(p || 0) + 10)}
      className="h-12 w-14 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200 hover:border-yellow-500/40"
    >
      +10
    </button>
  </div>

  <div className="mt-3 flex items-center justify-between text-xs">
    <span className="text-slate-400">Final Amount</span>
    <span className="text-emerald-400 font-black">${Number(customAmount || 0)}</span>
  </div>

  {Number(customAmount || 0) < baseAmount && (
    <div className="mt-2 text-xs text-red-400">
      Amount cannot be less than base plan amount.
    </div>
  )}
</div>



          {/* Wallet + Network */}
          <div className="mt-4 text-left bg-slate-900/40 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold mb-1">
              <FaWallet className="text-yellow-400" />
              Your Wallet & Network
            </div>

            <div className="text-xs text-slate-400">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Address</span>
                <span className="font-mono text-slate-200 break-all text-right">
                  {maskedWallet || "Not found"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 mt-2">
                <span className="text-slate-500">Network</span>
                <span className="text-slate-200 font-semibold">
                  {userNetwork || "Not set"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CONFIRM BUTTON */}
        <motion.button
          onClick={() => setConfirmOpen(true)}
          type="button"
          className="w-full py-5 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-bold text-lg rounded-2xl shadow-lg hover:shadow-yellow-500/50 border border-yellow-500/50 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          disabled={!maskedWallet || !selectedPlan.amount || loading}
        >
          {loading ? "Generating Invoice..." : "Confirm Investment"}
        </motion.button>

        <div className="text-center mt-8 text-xs text-slate-500">
          <p>🔒 Secure • ⚡ Instant Activation</p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPage;
