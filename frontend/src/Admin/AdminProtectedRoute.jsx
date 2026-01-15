import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function AdminProtectedRoute({ children }) {
  const { adminUser, authLoading, checkAdminSession } = useAdmin();

  useEffect(() => {
    checkAdminSession();
  }, [checkAdminSession]);

  if (authLoading) return null; // simple (you can show loader)
  if (!adminUser) return <Navigate to="/1cglobal_admin_hoon_yaar/login" replace />;

  return children;
}
