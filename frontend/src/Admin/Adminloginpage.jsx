import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAdmin } from "../context/AdminContext";
import Alert from "../components/Alert";

export default function AdminLoginPage() {
  const { loginAdmin, adminUser, checkAdminSession, alert, showAlert } =
    useAdmin();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const [showPass, setShowPass] = useState(false); // 👁️ toggle

  useEffect(() => {
    checkAdminSession();
  }, [checkAdminSession]);

  useEffect(() => {
    if (adminUser?.username) navigate("/1cglobal_admin_hoon_yaar/dashboard");
  }, [adminUser, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const u = form.username.trim();
    const p = form.password;

    if (!u || !p) return setErr("Username & password required");

    const ok = await loginAdmin(u, p);
    if (ok) navigate("/1cglobal_admin_hoon_yaar/dashboard");
  };

  return (
    <>
      <Alert
        type={alert.type}
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() =>
          showAlert({ isOpen: false, type: "", message: "" })
        }
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-black/60 border border-yellow-500/20 rounded-3xl p-8 shadow-2xl"
        >
          <h1 className="text-3xl font-black text-white text-center">
            Admin <span className="text-yellow-500">Login</span>
          </h1>
          <p className="text-gray-400 text-sm text-center mt-2">
            Enter your admin username & password
          </p>

          {err && (
            <div className="mt-5 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {/* Username */}
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                Username
              </div>
              <input
                value={form.username}
                onChange={(e) =>
                  setForm((p) => ({ ...p, username: e.target.value }))
                }
                className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
                placeholder="admin"
              />
            </div>

            {/* Password with eye */}
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                Password
              </div>

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  className="w-full bg-black/40 border border-gray-800/70 rounded-2xl px-4 pr-12 py-3 text-white outline-none focus:border-yellow-500/40"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              className="w-full mt-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black hover:brightness-110 transition disabled:opacity-60"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
}
