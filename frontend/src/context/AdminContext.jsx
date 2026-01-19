// src/context/AdminContext.jsx
import React, { createContext, useContext, useCallback, useMemo, useState } from "react";

const AdminContext = createContext(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
};

const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedLoading, setSelectedLoading] = useState(false);

  const [adminLoading, setAdminLoading] = useState(false);

  const [leaderboardUsers, setLeaderboardUsers] = useState([]);
  const [leaderboardError, setLeaderboardError] = useState("");
const [withdraws, setWithdraws] = useState([]);
   const [adminUser, setAdminUser] = useState(null);

  const [alert, setAlert] = useState({ isOpen: false, type: '', message: '' });
  
  const showAlert = (type, message) => {
    setAlert({ isOpen: true, type, message });
    setTimeout(() => setAlert({ isOpen: false, type: '', message: '' }), 2000);
  };
  // ✅ fetch all users (supports server-side search)
  const fetchUsers = useCallback(async (search = "") => {
    try {
      setUsersLoading(true);
      setUsersError("");

      const q = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await fetch(`${backendURL}/api/admin/users${q}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to fetch users");
      }

      setUsers(Array.isArray(data.users) ? data.users : []);
      return data.users || [];
    } catch (e) {
      setUsersError(e?.message || "Failed to fetch users");
      setUsers([]);
      return [];
    } finally {
      setUsersLoading(false);
    }
  }, []);

  // ✅ fetch single user details (optional)
  const fetchUserDetails = useCallback(async (userId) => {
    if (!userId) return null;
    try {
      setSelectedLoading(true);

      const res = await fetch(`${backendURL}/api/admin/users/${userId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to fetch user details");
      }

      setSelectedUser(data.user || null);
      return data.user || null;
    } catch (e) {
      setSelectedUser(null);
      return null;
    } finally {
      setSelectedLoading(false);
    }
  }, []);

  // ✅ LEADERBOARD (renamed to avoid collision with component)
  const fetchLeaderboard = useCallback(async (limit = 50) => {
    try {
      setAdminLoading(true);
      setLeaderboardError("");

      const res = await fetch(`${backendURL}/api/admin/leaders?limit=${limit}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to load leaderboard");
      }

      setLeaderboardUsers(Array.isArray(data.users) ? data.users : []);
      return data.users || [];
    } catch (e) {
      setLeaderboardError(e?.message || "Failed to load leaderboard");
      setLeaderboardUsers([]);
      return [];
    } finally {
      setAdminLoading(false);
    }
  }, []);




const fetchWithdrawRequests = useCallback(async (status = "pending") => {
  try {
    setAdminLoading(true);

    const q = status ? `?status=${encodeURIComponent(status)}` : "";
    const res = await fetch(`${backendURL}/api/admin/withdraws${q}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || "Failed to fetch withdraw requests");
    }

    setWithdraws(Array.isArray(data.list) ? data.list : []);
    return data.list || [];
  } catch (e) {
    setWithdraws([]);
    showAlert( "error", e.message || "Failed to fetch withdraw requests");
    return [];
  } finally {
    setAdminLoading(false);
  }
}, []);

const approveWithdrawRequest = useCallback(async (id) => {
  if (!id) return false;
  try {
    setAdminLoading(true);

    const res = await fetch(`${backendURL}/api/admin/withdraws/${id}/approve`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || "Approve failed");
    }

    // ✅ refresh list
    await fetchWithdrawRequests("pending");
    return true;
  } catch (e) {
    return false;
  } finally {
    setAdminLoading(false);
  }
}, [fetchWithdrawRequests]);

const rejectWithdrawRequest = useCallback(async (id, note = "") => {
  if (!id) return false;
  try {
    setAdminLoading(true);

    const res = await fetch(`${backendURL}/api/admin/withdraws/${id}/reject`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || "Reject failed");
    }

    await fetchWithdrawRequests("pending");
    return true;
  } catch (e) {
    return false;
  } finally {
    setAdminLoading(false);
  }
}, [fetchWithdrawRequests]);


const createDummyUser = useCallback(async (payload) => {
  try {
    setAdminLoading(true);

    const res = await fetch(`${backendURL}/api/admin/dummyusers/create`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || "Create user failed");
    }

    showAlert("success", "User created");
    await fetchUsers(""); // refresh users list
    return true;
  } catch (e) {
    showAlert("error", e.message || "Create user failed");
    return false;
  } finally {
    setAdminLoading(false);
  }
}, [fetchUsers]);


  const checkAdminSession = useCallback(async () => {
    try {
      setAdminLoading(true);
      const res = await fetch(`${backendURL}/api/admin/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        setAdminUser(data.admin || null);
      } else {
        setAdminUser(null);
      }
    } catch {
      setAdminUser(null);
    } finally {
      setAdminLoading(false);
    }
  }, []);

  const loginAdmin = useCallback(async (username, password) => {
    try {
      setAdminLoading(true);
      const res = await fetch(`${backendURL}/api/admin/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Login failed");

      setAdminUser(data.admin || { username });
      showAlert("success", "Admin logged in");
      return true;
    } catch (e) {
      showAlert("error", e.message || "Login failed");
      return false;
    } finally {
      setAdminLoading(false);
    }
  }, []);

  const logoutAdmin = useCallback(async () => {
    try {
      setAdminLoading(true);
      await fetch(`${backendURL}/api/admin/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setAdminUser(null);
      setAdminLoading(false);
    }
  }, []);

const toggleUserStatus = useCallback(async (userId, currentStatus) => {
  try {
    setAdminLoading(true);
    // Backend endpoint assumes a toggle or specific path
    const res = await fetch(`${backendURL}/api/admin/users/${userId}/toggle-status`, {
      method: "PATCH", // Ya POST jo aapke backend par set ho
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentStatus }),
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || "Failed to update status");
    }

    showAlert("success", `User ${!currentStatus ? 'Activated' : 'Suspended'} successfully`);
    await fetchUsers(""); // Refresh the list
    return true;
  } catch (e) {
    showAlert("error", e.message || "Operation failed");
    return false;
  } finally {
    setAdminLoading(false);
  }
}, [fetchUsers]);
  const value = useMemo(
    () => ({
      // users
      users,
      usersLoading,
      usersError,
      fetchUsers,
alert,showAlert,
      // selected
      selectedUser,
      setSelectedUser,
      selectedLoading,
      fetchUserDetails,
fetchWithdrawRequests, approveWithdrawRequest, rejectWithdrawRequest,withdraws,
      // leaderboard
      adminLoading,
      leaderboardUsers,
      leaderboardError,
      fetchLeaderboard,createDummyUser,adminUser,
checkAdminSession,
loginAdmin,
logoutAdmin,toggleUserStatus

    }),
    [
      users,
      usersLoading,
      usersError,
      fetchUsers,
      selectedUser,
      selectedLoading,
      fetchUserDetails,
      adminLoading,
      leaderboardUsers,
      leaderboardError,
      fetchLeaderboard,showAlert,alert
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
