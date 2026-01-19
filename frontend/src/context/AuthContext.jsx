// AuthContext.jsx (LOADING FIXED)
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  walletAddress: "",
  network: "ERC20",
  ReferralCode: "",
  showPassword: false,
  showConfirmPassword: false,
  termsAccepted: false,
};

export const AuthProvider = ({ children }) => {
  const [formData, setFormData] = useState(initialForm);
  const [RegisterUser, setRegisterUser] = useState("");
  const [alert, setAlert] = useState({ isOpen: false, type: "", message: "" });

  const navigate = useNavigate();
  const backendURL = "http://localhost:5000";

  const [mode, setMode] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [me, setMe] = useState(null);

  const [authLoading, setloading] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ isOpen: true, type, message });
    setTimeout(() => setAlert({ isOpen: false, type: "", message: "" }), 4000);
  };
  const [email, setEmail] = useState("");

  // ✅ SEND VERIFY CODE
  const sendVerifyCode = useCallback(
    async (userId) => {
      setloading(true);
      try {
        const response = await fetch(`${backendURL}/api/auth/req-verify-code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const result = await response.json();

        if (result.success) showAlert("success", result.message);
        else showAlert("error", result.message || "Failed to send code");
      } catch (error) {
        //console.error("SendVerifyCode error:", error);
        showAlert("error", "Failed to send verification code!");
      } finally {
        setloading(false);
      }
    },
    [backendURL]
  );

  // ✅ REGISTER
  const handleSubmitRegister = useCallback(
    async (e) => {
      e.preventDefault();
      setloading(true);

      try {
        const response = await fetch(`${backendURL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!result.success) {
          showAlert("error", result.message || "Registration failed!");
          return;
        }

        showAlert("success", result.message);
        setRegisterUser(formData.email);

        // code request
        await sendVerifyCode(result._id);

        // ✅ reset form properly
        setFormData(initialForm);

        setTimeout(() => {
          navigate(`/verify-email?userId=${result._id}`);
        }, 500);
      } catch (error) {
        //console.error("Register error:", error);
        showAlert("error", "Registration failed!");
      } finally {
        setloading(false);
      }
    },
    [backendURL, formData, navigate, sendVerifyCode]
  );

  // ✅ LOGIN
  const handleSubmitLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setloading(true);

      try {
        const response = await fetch(`${backendURL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          showAlert("error", result.message || "Invalid credentials");
          return;
        }

        showAlert("success", "Login successful! Redirecting...");
        setFormData(initialForm);

        // ✅ update auth state (optional but good)
        const meRes = await checkAuth();
        setIsLoggedIn(!!meRes?.success);
        setMe(meRes?.user || null);

        setTimeout(() => {
          navigate("/");
        }, 500);
      } catch (error) {
        //console.error("Login error:", error);
        showAlert("error", "Login failed!");
      } finally {
        setloading(false);
      }
    },
    [backendURL, formData.email, formData.password, navigate]
  );

  // ✅ VERIFY CODE
  const handleVerifyCode = useCallback(
    async (userId, code) => {
      if (!code || code.length !== 6) return;
      setloading(true);

      try {
        const response = await fetch(`${backendURL}/api/auth/verify-code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, code }),
        });

        const result = await response.json();

        if (!result.success) {
          showAlert("warning", result.message || "Invalid code!");
          return;
        }

        showAlert("success", result.message);
        setMode("login");
        navigate("/login");
      } catch (error) {
        //console.error("Verify error:", error);
        showAlert("error", "Verification failed!");
      } finally {
        setloading(false);
      }
    },
    [backendURL, navigate]
  );

  // ✅ CHECK AUTH (ME)
  const checkAuth = useCallback(async () => {
    setloading(true);
    try {
      const res = await fetch(`${backendURL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      return data?.success ? data : null;
    } catch (e) {
      return null;
    } finally {
      setloading(false);
    }
  }, [backendURL]);

  // ✅ LOGOUT
  const logoutUser = useCallback(async () => {
    setloading(true);
    try {
      localStorage.removeItem("completedTasks");
      localStorage.removeItem("taskIdsObj");
      localStorage.removeItem("totalPoints");
      localStorage.removeItem("tasksDate");

      const res = await fetch(`${backendURL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const result = await res.json(); // ✅ await

      if (result?.success) showAlert("success", result.message || "Logged out");

      setIsLoggedIn(false);
      setMe(null);
      navigate("/login");
    } catch (e) {
      navigate("/login");
    } finally {
      setloading(false);
    }
  }, [backendURL, navigate]);

  // ✅ INIT AUTH (on mount)
  useEffect(() => {
    let mounted = true;

    (async () => {
      const res = await checkAuth();
      if (!mounted) return;

      setIsLoggedIn(!!res?.success);
      setMe(res?.user || null);
    })();

    return () => {
      mounted = false;
    };
  }, [checkAuth]);






const requestForgotOtp = useCallback(async (email) => {
  setloading(true);
  try {
    const res = await fetch(`${backendURL}/api/auth/forgot/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      showAlert("error", data?.message || "OTP send failed");
      return false;
    }

    showAlert("success", data.message || "OTP sent");
    localStorage.setItem("forgotEmail", email.trim().toLowerCase());
navigate("/forget-otp");

    return true;
  } catch (e) {
    showAlert("error", "OTP send failed");
    return false;
  } finally {
    setloading(false);
  }
}, [backendURL]);


const verifyForgotOtp = useCallback(async (email, otp) => {
  setloading(true);
  try {
    const res = await fetch(`${backendURL}/api/auth/forgot/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      showAlert("error", data?.message || "OTP verify failed");
      return null;
    }

    showAlert("success", data.message || "OTP verified");

    localStorage.setItem(
      "resetSession",
      JSON.stringify({
        email,
        resetToken: data.resetToken,
        expiresAt: Date.now() + 10 * 60 * 1000,
      })
    );

    navigate("/reset-password");
    return data; // ✅ MUST return
  } catch (e) {
    showAlert("error", "OTP verify failed");
    return null;
  } finally {
    setloading(false);
  }
}, [backendURL, navigate]);



const resetForgotPassword = useCallback(async (newPassword) => {
  setloading(true);
  try {
    const s = JSON.parse(localStorage.getItem("resetSession") || "{}");
    if (!s?.email || !s?.resetToken) {
      showAlert("error", "Session expired. Please request OTP again.");
      return false;
    }

    const res = await fetch(`${backendURL}/api/auth/forgot/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: s.email,
        newPassword,
        resetToken: s.resetToken,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      showAlert("error", data?.message || "Password update failed");
      return false;
    }

    showAlert("success", data.message || "Password updated");
    localStorage.removeItem("resetSession");
    localStorage.removeItem("forgotEmail");
    return true;
  } catch (e) {
    showAlert("error", "Password update failed");
    return false;
  } finally {
    setloading(false);
  }
}, [backendURL]);

  return (
    <AuthContext.Provider
      value={{
        formData,
        setFormData,
        handleSubmitRegister,
        alert,
        showAlert,
        setAlert,
        RegisterUser,
        mode,
        setMode,
        handleSubmitLogin,
        handleVerifyCode,
        sendVerifyCode,
        logoutUser,
        checkAuth,
        authLoading,
        isLoggedIn,
        me,setEmail,email,requestForgotOtp,verifyForgotOtp,resetForgotPassword

      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
