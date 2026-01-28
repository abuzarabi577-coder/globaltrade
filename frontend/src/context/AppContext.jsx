// AuthContext.jsx - PERFECT Tasks API
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppcontextProvider = ({ children }) => {
  const navigate = useNavigate();
  const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  
  const [FetchAdminTasks, setFetchAdminTasks] = useState([]); // idle, loading, success, error
  const [FetchUserTask, setFetchUserTask] = useState([]); // idle, loading, success, error
  const [FetchUserData, setFetchUserData] = useState(null); // idle, loading, success, error
  const [loading, setloading] = useState(false); 
  const [PaymentINV, setPaymentINV] = useState(); 
const [withdrawHistory, setWithdrawHistory] = useState([]);
  
  const [alert, setAlert] = useState({ isOpen: false, type: '', message: '' });
  
  const showAlert = (type, message) => {
    setAlert({ isOpen: true, type, message });
    setTimeout(() => setAlert({ isOpen: false, type: '', message: '' }), 2000);
  };
const [publicLeaderboard, setPublicLeaderboard] = useState([]);
const [publicLeaderboardLoading, setPublicLeaderboardLoading] = useState(false);
const [publicLeaderboardError, setPublicLeaderboardError] = useState("");
const [publicAnnouncements, setPublicAnnouncements] = useState([]);
const [publicAnnouncementsLoading, setPublicAnnouncementsLoading] = useState(false);
  // ✅ FIXED: Tasks IDs ONLY (No points)
  const syncTasksToBackend = async (taskIds) => {
    setloading(true)
    if (!taskIds || taskIds.length !== 5) {
      showAlert('error', 'Exactly 5 task IDs required!');
      return false;
    }

    try {
      // const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      // const userId = userProfile._id || userProfile.userId || userProfile.id;
      
      // ////console.log('🚀 SYNC DEBUG:', { taskIds, userId });
      
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; 


      const response = await fetch(`${backendURL}/api/user/complete-tasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
              "x-user-tz": Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        credentials: 'include',
        body: JSON.stringify({
          taskIds,        // ["1","2","3","4","5"] ✅ Array only
          // ✅ NO totalPoints!
        })
      });
      
      const result = await response.json();
      ////console.log('📡 API Response:', result);
      
      if (result.success) {
    setloading(false)

        showAlert('success', result.message || 'Tasks saved successfully!');
        return true;
      } else {
        showAlert('error', result.message || 'Tasks failed!');
        setloading(false)
        return false;
      }
    } catch (error) {
      ////console.error('💥 API Error:', error);
      showAlert('error', 'Network error - Check backend!');
      return false;
    }
  };

 


// 🔥 NEW: ADMIN TASKS API
  const saveAdminTasks = async (tasksData) => {
    setloading(true)

    // setTasksStatus('loading');
    try {
      const response = await fetch(`${backendURL}/api/admin/savetasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          tasks: tasksData,           // Complete tasks array
        })
      });
      
      const result = await response.json();
      if (result.success) {
    setloading(false)

       showAlert("success",result.message)      
      } else {
        // setTasksStatus('error');
        showAlert('error', result.message || 'Save failed');
        return false;
      }
    } catch (error) {
      // setTasksStatus('error');
      ////console.error('💥 Admin Tasks Error:', error);
      showAlert('error', 'Network error');
      return false;
    }
  };

  // 🔥 NEW: LOAD ADMIN TASKS FROM BACKEND
  const HandleFetchAdminTasks = async () => {
    try {
    setloading(true)

      const response = await fetch(`${backendURL}/api/admin/fetch-tasks`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const result = await response.json();
      if (result.success && result.tasks) {
    setloading(false)

      setFetchAdminTasks(result.tasks)    
  }
      return [];
    } catch (error) {
  showAlert("error", error?.message || String(error));
  return [];
}

  };



const updateAdminTask = async (taskId, taskData) => {
  try {
    setloading(true)

    const response = await fetch(`${backendURL}/api/admin/update-task/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...taskData })
    });
    
    const result = await response.json();
    if (result.success) {
    setloading(false)

      showAlert("success", "Task updated successfully!");
      return true;
    } else {
      showAlert('error', result.message || 'Update failed');
      return false;
    }
  } catch (error) {
    ////console.error('💥 Update error:', error);
    showAlert('error', 'Network error');
    return false;
  }
};


// 🔥 DELETE ADMIN TASK
const deleteAdminTask = async (taskId) => {
  try {
    setloading(true)

    ////console.log(taskId);
    
    const response = await fetch(
      `${backendURL}/api/admin/delete-task/${taskId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );

    const result = await response.json();

    if (result.success) {
    setloading(false)

      showAlert('success', 'Task deleted successfully');
      return true;
    } else {
      showAlert('error', result.message || 'Delete failed');
      return false;
    }
  } catch (error) {
    ////console.error('💥 Delete error:', error);
    showAlert('error', 'Network error');
    return false;
  }
};



// 🔥 NEW: LOAD ADMIN TASKS FROM BACKEND
  const HandleFetchUserTasks = async () => {
    try {
      const response = await fetch(`${backendURL}/api/user/fetch-tasks`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const result = await response.json();
      if (result.success && result.tasks) {
      setFetchUserTask(result.tasks)    
      
  }
      return [];
    } catch (error) {
  showAlert("error", error?.message || "Failed to load user data");
  return [];
}

  };






const fetchTodayTaskStatus = async () => {
  try {
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const userId = userProfile._id || userProfile.userId || userProfile.id;

    if (!userId) return null;

    const response = await fetch(`${backendURL}/api/user/check-sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userId })
    });

    const result = await response.json();
    if (result.success) return result;

    return null;
  } catch (err) {
    return null;
  }
};



// fetch user 
//  FROM BACKEND
 const HandleFetchUserData = useCallback(async () => {    try {
      const response = await fetch(`${backendURL}/api/user/fetch-user-data`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const result = await response.json();
      if (result.success && result.user) {
      setFetchUserData(result.user)    
      ////console.log('data',result.user);
      
  }
      return [];
    } catch (error) {
      return [];
    }
}, [])




// HandleCreateInvestmentPlan

const HandleCreateInvestmentPlan = async (planData) => {
  try {
    setloading(true)

    const res = await fetch(`${backendURL}/api/payram/create-invoice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name:planData.name,
        amount:planData.amount
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      showAlert("error", data.message || "Failed to create investment plan");
      setloading(false)
      return false;
    }
    setloading(false)

    showAlert("success", data.message || "Plan saved successfully!");
    ////console.log(data.invoice);
    setPaymentINV(data.invoice)
    // ✅ refresh user data so UI updates
    await HandleFetchUserData();
    return true;
  } catch (err) {
    showAlert("error", err.message || "Network error");
    return false;
  }
};



const fetchLatestInvoice = async () => {
  try {
    setloading(true)
    const res = await fetch(`${backendURL}/api/payram/latest-invoice`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
    setloading(false)

      setPaymentINV(data.invoice);
      return data.invoice;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const createWithdraw = async (amount) => {
  try {
    setloading(true);
    const res = await fetch(`${backendURL}/api/user/withdraw/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      "x-user-tz": Intl.DateTimeFormat().resolvedOptions().timeZone, // ✅ add this
      credentials: "include",
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();
    setloading(false);

    if (!res.ok || !data.success) {
      showAlert("error", data.message || "Withdraw failed");
      return false;
    }

    showAlert("success", data.message || "Withdraw request sent");
    await HandleFetchUserData(); // refresh balance if you deduct instantly
    return true;
  } catch (e) {
    setloading(false);
    showAlert("error", e.message || "Network error");
    return false;
  }
};


const fetchWithdrawHistory = useCallback(async () => {
  try {
    setloading(true);

    const res = await fetch(`${backendURL}/api/user/withdraw/myhistory`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || "Failed to fetch withdraw history");
    }

    setWithdrawHistory(Array.isArray(data.list) ? data.list : []);
    return data.list || [];
  } catch (e) {
    setWithdrawHistory([]);
    return [];
  } finally {
    setloading(false);
  }
}, [backendURL]);

// AppContext.jsx mein ye function add karein
const checkInvoiceStatus = async (referenceId) => {
  try {
    setloading(true);
    const res = await fetch(`${backendURL}/api/payram/invoice/${referenceId}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setloading(false);

    if (data.success) {
      if (data.status === "confirmed") {
        showAlert("success", "Payment confirmed! Plan activated.");
        await HandleFetchUserData(); // Refresh dashboard data
      } else {
        showAlert("error", "Payment not detected yet. Please wait.");
      }
      return data;
    }
    return null;
  } catch (e) {
    setloading(false);
    showAlert("error", "Network error checking status");
    return null;
  }
};

const handleRefreshStatus = async (withdrawId) => {
  try {
    setloading(true); 
    // Is line ko check karein: Agar backend par withdraw route ke andar hai to theek, 
    // warna '/api/user/check-status/' use karein
    const res = await fetch(`${backendURL}/api/user/withdraw/check-status/${withdrawId}`, {
      method: "GET",
      credentials: "include",
    });

    const result = await res.json();

    if (result.success) {
      showAlert('success', `Status updated: ${result.status}`);
      await fetchWithdrawHistory(); // List update karne ke liye
    } else {
      // 400 error yahan message dikhayega
      showAlert('error', result.message || "Failed to sync status");
    }
  } catch (err) {
    //console.error("Refresh failed", err);
    showAlert('error', "Network error or timeout");
  } finally {
    setloading(false); 
  }
};

const fetchPublicLeaderboard = useCallback(async (limit = 10) => {
  try {
    setPublicLeaderboardLoading(true);
    setPublicLeaderboardError("");

    const res = await fetch(`${backendURL}/api/user/leaderboard/top?limit=${limit}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      throw new Error(data?.message || "Failed to fetch public leaderboard");
    }

    setPublicLeaderboard(Array.isArray(data.users) ? data.users : []);
    return data.users || [];
  } catch (e) {
    setPublicLeaderboard([]);
    setPublicLeaderboardError(e.message || "Error");
    return [];
  } finally {
    setPublicLeaderboardLoading(false);
  }
}, [backendURL]);

const fetchPublicAnnouncements = useCallback(async () => {
  try {
    setPublicAnnouncementsLoading(true);

    const res = await fetch(`${backendURL}/api/user/fetch-annocuments`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || "Failed to fetch announcements");
    }

    setPublicAnnouncements(Array.isArray(data.list) ? data.list : []);
    return data.list || [];
  } catch (e) {
    setPublicAnnouncements([]);
    return [];
  } finally {
    setPublicAnnouncementsLoading(false);
  }
}, [backendURL]);
  return (
    <AppContext.Provider value={{
      syncTasksToBackend,    // ✅ Main function
      alert,
      showAlert,saveAdminTasks,
      HandleFetchAdminTasks,FetchAdminTasks,loading, setloading,
      updateAdminTask,deleteAdminTask,HandleFetchUserTasks,FetchUserTask,fetchTodayTaskStatus,FetchUserData,HandleFetchUserData,HandleCreateInvestmentPlan
      ,loading,PaymentINV,fetchLatestInvoice,createWithdraw,fetchWithdrawHistory,withdrawHistory,checkInvoiceStatus,handleRefreshStatus
,
      publicLeaderboard,
publicLeaderboardLoading,
publicLeaderboardError,
fetchPublicLeaderboard,publicAnnouncements,
publicAnnouncementsLoading,
fetchPublicAnnouncements,

    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;