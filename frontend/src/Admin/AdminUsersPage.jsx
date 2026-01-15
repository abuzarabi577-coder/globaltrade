import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaTimes, FaSearch, FaPlus } from "react-icons/fa";
import { useAdmin } from "../context/AdminContext";

const money = (n) => {
  const num = Number(n || 0);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num);
};

export default function AdminUsers() {
  const {
    users,
    usersLoading,
    usersError,
    fetchUsers,
    selectedUser,
    setSelectedUser,
    selectedLoading,
    fetchUserDetails,createDummyUser 
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ✅ Dummy users (frontend-only)

  // ✅ modal states
  const [dummyModalOpen, setDummyModalOpen] = useState(false);
  const [dummyForm, setDummyForm] = useState({
  name: "",
  email: "",
  password: "",
  level: 0,
  totalEarnings: 0,
  walletAddress: "dumyuserwallet",
  network: "ETH",
});

  const [dummyError, setDummyError] = useState("");

  useEffect(() => {
    fetchUsers(""); // initial
  }, [fetchUsers]);

 

  // ✅ Client-side filter
  const filtered = useMemo(() => {
  const s = search.trim().toLowerCase();
  if (!s) return users || [];
  return (users || []).filter((u) => {
    const name = (u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    return name.includes(s) || email.includes(s);
  });
}, [users, search]);

 const openUser = async (u) => {
  setDrawerOpen(true);
  setSelectedUser(null);
  await fetchUserDetails(u._id);
};

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  // ✅ Open dummy modal
const openDummyModal = () => {
  setDummyError("");
  setDummyForm({
    name: "",
    email: "",
    password: "",
    level: 0,
    totalEarnings: 0,
    walletAddress: "dumyuserwallet",
    network: "ETH",
  });
  setDummyModalOpen(true);
};


  // ✅ Save dummy user (frontend only)
const saveDummyUser = async () => {
  setDummyError("");

  const payload = {
    name: dummyForm.name.trim(),
    email: dummyForm.email.trim().toLowerCase(),
    password: dummyForm.password,
    level: Number(dummyForm.level || 0),
    totalEarnings: Number(dummyForm.totalEarnings || 0),
    walletAddress: "dumyuserwallet",
    network: "ETH",
  };

  if (!payload.name) return setDummyError("Name is required");
  if (!payload.email || !payload.email.includes("@")) return setDummyError("Valid email is required");
  if (!payload.password || payload.password.length < 8) return setDummyError("Password must be at least 8 characters");
  if (!Number.isFinite(payload.level) || payload.level < 0 || payload.level > 10) return setDummyError("Level must be 0 - 10");
  if (!Number.isFinite(payload.totalEarnings) || payload.totalEarnings < 0) return setDummyError("Total earnings must be 0 or more");

  const ok = await createDummyUser(payload);
  if (ok) {
    setDummyModalOpen(false);
    // list refresh AdminContext karega
  }
};


  return (
    <div className="max-w-7xl mx-auto pt-16">
      {/* Header */}
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-white">
            Users <span className="text-yellow-500">Management</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Search users, view levels, earnings, and full profiles in a professional drawer.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3 text-xs">
          <div className="px-4 py-2 rounded-2xl bg-black/50 border border-gray-800/60 text-gray-300">
Total: <span className="text-white font-bold">{(users || []).length}</span>
          </div>
        </div>
      </div>

      {/* Search + Add Dummy User */}
      <div className="bg-black/60 border border-gray-800/60 rounded-3xl p-4 md:p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-11 h-11 rounded-2xl bg-black/50 border border-gray-800/60 flex items-center justify-center">
              <FaSearch className="text-gray-400" />
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-transparent outline-none text-white placeholder:text-gray-500 text-sm"
            />

            <button
              type="button"
              className="px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm font-bold hover:bg-yellow-500/15 transition"
            >
              Search
            </button>
          </div>

          {/* ✅ Add Dummy User Button */}
          <button
            type="button"
            onClick={openDummyModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 text-yellow-200 font-black text-sm hover:border-yellow-500/60 hover:bg-yellow-500/25 transition"
          >
            <FaPlus />
            Add Dummy User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-black/60 border border-gray-800/60 rounded-3xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800/60 flex items-center justify-between">
          <div className="text-sm font-bold text-white">All Users</div>
          {usersLoading ? (
            <div className="text-xs text-gray-400">Loading...</div>
          ) : usersError ? (
            <div className="text-xs text-red-400">{usersError}</div>
          ) : (
            <div className="text-xs text-gray-400">{filtered.length} results</div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/40">
              <tr className="text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-4 font-semibold">User</th>
                <th className="text-left px-6 py-4 font-semibold">Level</th>
                <th className="text-left px-6 py-4 font-semibold">Total Earnings</th>
                <th className="text-right px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {!usersLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}

              {filtered.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-gray-800/50 hover:bg-white/[0.03] transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-300 font-black">
                        {(u.name || "U").slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-semibold flex items-center gap-2">
                          {u.name || "—"}
                          {u.isDummy && (
                            <span className="text-[10px] px-2 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 font-bold">
                              DUMMY
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{u.email || "—"}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-2xl bg-black/50 border border-gray-800/60 text-gray-200">
                      Level <span className="text-yellow-400 font-bold">{u.level ?? 0}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-green-400 font-bold">
                      {money(u.totalEarnings)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openUser(u)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/50 border border-gray-800/60 text-gray-200 hover:border-yellow-500/40 hover:text-yellow-300 transition"
                      title="View details"
                      type="button"
                    >
                      <FaEye />
                      <span className="hidden sm:inline">View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Dummy User Modal */}
      <AnimatePresence>
        {dummyModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[80]"
              onClick={() => setDummyModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "tween", duration: 0.18 }}
              className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg bg-gradient-to-b from-black via-gray-950 to-black border border-gray-800/70 rounded-3xl overflow-hidden shadow-2xl">
                <div className="px-6 py-5 border-b border-gray-800/70 flex items-center justify-between bg-black/60">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-500">Create</div>
                    <div className="text-white font-black text-lg">Dummy User</div>
                  </div>

                  <button
                    onClick={() => setDummyModalOpen(false)}
                    className="w-11 h-11 rounded-2xl bg-black/50 border border-gray-800/70 hover:border-yellow-500/40 text-gray-200 hover:text-yellow-300 transition flex items-center justify-center"
                    type="button"
                    title="Close"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {dummyError && (
                    <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                      {dummyError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Name">
                      <input
                        value={dummyForm.name}
                        onChange={(e) => setDummyForm((p) => ({ ...p, name: e.target.value }))}
                        className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
                        placeholder="John Doe"
                      />
                    </Field>

                    <Field label="Email">
                      <input
                        value={dummyForm.email}
                        onChange={(e) => setDummyForm((p) => ({ ...p, email: e.target.value }))}
                        className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
                        placeholder="john@example.com"
                      />
                    </Field>

                    <Field label="Set Password">
                      <input
                        type="password"
                        value={dummyForm.password}
                        onChange={(e) => setDummyForm((p) => ({ ...p, password: e.target.value }))}
                        className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
                        placeholder="******"
                      />
                    </Field>

                    <Field label="Level (0 - 10)">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={dummyForm.level}
                        onChange={(e) => setDummyForm((p) => ({ ...p, level: e.target.value }))}
                        className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
                      />
                    </Field>

                    <Field label="Total Earnings (USD)">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={dummyForm.totalEarnings}
                        onChange={(e) => setDummyForm((p) => ({ ...p, totalEarnings: e.target.value }))}
                        className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
                        placeholder="0"
                      />
                    </Field>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={saveDummyUser}
                      className="flex-1 px-5 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black hover:brightness-110 transition"
                      type="button"
                    >
                      Save Dummy User
                    </button>
                    <button
                      onClick={() => setDummyModalOpen(false)}
                      className="px-5 py-3 rounded-2xl bg-black/50 border border-gray-800/70 text-gray-200 hover:border-yellow-500/40 hover:text-yellow-300 transition"
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>

                  
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Drawer (same as your existing) */}
        {/* Drawer */}
           <AnimatePresence>
             {drawerOpen && (
               <>
                 {/* overlay */}
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 0.55 }}
                   exit={{ opacity: 0 }}
                   onClick={closeDrawer}
                   className="fixed inset-0 bg-black z-[60]"
                 />
     
                 {/* panel */}
                 <motion.aside
                   initial={{ x: "100%" }}
                   animate={{ x: 0 }}
                   exit={{ x: "100%" }}
                   transition={{ type: "tween", duration: 0.22 }}
                   className="fixed right-0 top-0 h-screen w-full md:w-1/2 z-[70] bg-gradient-to-b from-black via-gray-950 to-black border-l border-gray-800/70"
                 >
                   <div className="h-full flex flex-col">
                     {/* header */}
                     <div className="px-6 py-5 border-b border-gray-800/70 flex items-center justify-between bg-black/60 backdrop-blur-xl">
                       <div>
                         <div className="text-xs uppercase tracking-wider text-gray-500">User Profile</div>
                         <div className="text-white font-black text-lg">
                           {selectedUser?.name || (selectedLoading ? "Loading..." : "—")}
                         </div>
                       </div>
     
                       <button
                         onClick={closeDrawer}
                         className="w-11 h-11 rounded-2xl bg-black/50 border border-gray-800/70 hover:border-yellow-500/40 text-gray-200 hover:text-yellow-300 transition flex items-center justify-center"
                         type="button"
                         title="Close"
                       >
                         <FaTimes />
                       </button>
                     </div>
     
                     {/* body */}
                     <div className="flex-1 overflow-y-auto p-6 space-y-6">
                       {/* top cards */}
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <MiniCard label="Level" value={String(selectedUser?.level ?? "—")} />
                         <MiniCard label="Total Earnings" value={money(selectedUser?.totalEarnings)} valueClass="text-green-400" />
                         <MiniCard label="Status" value={selectedUser?.isActive ? "Active" : "Disabled"} />
                       </div>
     
                       {/* identity */}
                       <Section title="Account">
                         <InfoRow label="Name" value={selectedUser?.name} />
                         <InfoRow label="Email" value={selectedUser?.email} />
                         <InfoRow label="Wallet" value={selectedUser?.walletAddress || "—"} mono />
                         <InfoRow label="Network" value={selectedUser?.network || "—"} />
                         <InfoRow label="Referral Code" value={selectedUser?.referralCode || "—"} mono />
                         <InfoRow label="Joined" value={selectedUser?.Join ? new Date(selectedUser.Join).toLocaleString() : "—"} />
                       </Section>
     
                       {/* earnings breakdown */}
                       <Section title="Earnings Breakdown">
                         <div className="bg-black/40 border border-gray-800/60 rounded-2xl overflow-hidden">
                           <table className="w-full text-sm">
                             <thead className="bg-black/50">
                               <tr className="text-xs uppercase tracking-wider text-gray-500">
                                 <th className="text-left px-4 py-3">Type</th>
                                 <th className="text-right px-4 py-3">Amount</th>
                               </tr>
                             </thead>
                             <tbody>
                               <BreakRow label="ROI" value={money(selectedUser?.earnings?.roi)} />
                               <BreakRow label="Team Profit Share" value={money(selectedUser?.earnings?.teamProfitShare)} />
                               <BreakRow label="Referral Commission" value={money(selectedUser?.earnings?.referralCommission)} />
                               <BreakRow label="Other" value={money(selectedUser?.earnings?.other)} />
                             </tbody>
                           </table>
                         </div>
                       </Section>
     
                       {/* active plan */}
                       <Section title="Active Plan">
                         <div className="bg-black/40 border border-gray-800/60 rounded-2xl p-4">
                           {!selectedUser?.activePlan?.length ? (
                             <div className="text-gray-500 text-sm">No active plan record.</div>
                           ) : (
                             <div className="space-y-3">
                               {selectedUser.activePlan.slice(0, 3).map((p) => (
                                 <div key={p._id} className="bg-black/40 border border-gray-800/60 rounded-2xl p-4">
                                   <div className="flex items-center justify-between">
                                     <div className="text-white font-bold">{p.plan?.name || "Plan"}</div>
                                     <div className="text-xs text-gray-500">{p.date}</div>
                                   </div>
                                   <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                     <SmallStat label="Amount" value={money(p.plan?.amount)} />
                                     <SmallStat label="Daily ROI %" value={`${p.plan?.dailyROIPct ?? 0}%`} />
                                     <SmallStat label="Total Profit" value={money(p.plan?.totalProfit)} />
                                     <SmallStat label="Closed" value={p.plan?.isClosed ? "Yes" : "No"} />
                                   </div>
                                 </div>
                               ))}
                             </div>
                           )}
                         </div>
                       </Section>
     
                       {/* referral list */}
                       <Section title="Referrals">
                         <div className="bg-black/40 border border-gray-800/60 rounded-2xl overflow-hidden">
                           <table className="w-full text-sm">
                             <thead className="bg-black/50">
                               <tr className="text-xs uppercase tracking-wider text-gray-500">
                                 <th className="text-left px-4 py-3">#</th>
                                 <th className="text-left px-4 py-3">User</th>
                                 <th className="text-left px-4 py-3">Joined</th>
                               </tr>
                             </thead>
                             <tbody>
                               {(selectedUser?.Referal || []).slice(0, 10).map((r, idx) => (
                                 <tr key={idx} className="border-t border-gray-800/60">
                                   <td className="px-4 py-3 text-gray-400">{r.userNumber ?? idx + 1}</td>
                                   <td className="px-4 py-3 text-white">{String(r.userId || "—")}</td>
                                   <td className="px-4 py-3 text-gray-400">
                                     {r.joinedAt ? new Date(r.joinedAt).toLocaleDateString() : "—"}
                                   </td>
                                 </tr>
                               ))}
                               {(!selectedUser?.Referal || selectedUser.Referal.length === 0) && (
                                 <tr>
                                   <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                                     No referrals.
                                   </td>
                                 </tr>
                               )}
                             </tbody>
                           </table>
                         </div>
                       </Section>
     
                       {/* tasks summary */}
                    
                     </div>
     
                     
                   </div>
                 </motion.aside>
               </>
             )}
           </AnimatePresence>
    </div>
  );
}
/* small UI parts */
function Field({ label, children }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">{label}</div>
      {children}
    </div>
  );
}
/* small UI parts */
function Section({ title, children }) {
  return (
    <div className="bg-black/50 border border-gray-800/60 rounded-3xl p-5">
      <div className="text-xs uppercase tracking-wider text-gray-500 mb-4">{title}</div>
      {children}
    </div>
  );
}

function MiniCard({ label, value, valueClass = "text-white" }) {
  return (
    <div className="bg-black/50 border border-gray-800/60 rounded-3xl p-4">
      <div className="text-[10px] uppercase tracking-wider text-gray-500">{label}</div>
      <div className={`text-xl font-black mt-1 ${valueClass}`}>{value}</div>
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-800/40 last:border-b-0">
      <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
      <div className={`text-sm text-gray-200 text-right ${mono ? "font-mono" : ""}`}>
        {value ?? "—"}
      </div>
    </div>
  );
}

function BreakRow({ label, value }) {
  return (
    <tr className="border-t border-gray-800/60">
      <td className="px-4 py-3 text-gray-300">{label}</td>
      <td className="px-4 py-3 text-right text-white font-bold">{value}</td>
    </tr>
  );
}

function SmallStat({ label, value }) {
  return (
    <div className="bg-black/40 border border-gray-800/60 rounded-2xl p-3">
      <div className="text-[10px] uppercase tracking-wider text-gray-500">{label}</div>
      <div className="text-sm font-bold text-white mt-1">{value}</div>
    </div>
  );
}