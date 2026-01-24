// src/App.js
import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Mainpage from './components/mainpage';
import AuthModal from './components/LoginSignUP';
import Dashboard from './components/dashboard';
import InvestmentPage from './components/investmentpage';
import CoinRainTaskModal from './task/CoinRainTaskModal';
import EmailVerification from './components/verificationEmail';
import   AdminLayout  from './Admin/adminpanel';

import LoadingInlineLogo from './components/loading';
import { useAppContext } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import AboutUs from './components/aboutUs';
import ContactUs from './components/contact';
import { useAdmin } from './context/AdminContext';
import AdminLoginPage from './Admin/Adminloginpage';
import AdminProtectedRoute from './Admin/AdminProtectedRoute';
import ForgetPassword from './components/ForgetPassword';
import ForgetOtp from './components/ForgetOtp';
import ResetPassword from './components/ResetPassword';
import MaintenanceModal from './components/maintainceModal';

const App = () => {
    const { loading} = useAppContext();
    const { authLoading} = useAuth();
  const {
Adminloading} = useAdmin();
const MAINTENANCE=process.env.REACT_Maintance ==='true'
  return (

    <>
       {/* ✅ FULL SCREEN LOADING OVERLAY */}
    {(authLoading || loading || Adminloading) && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-md">
    <LoadingInlineLogo />
  </div>
)}
     <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<AuthModal />} />
      <Route path="/investment" element={<InvestmentPage />} />
      <Route path="/coin-game" element={<CoinRainTaskModal />} />
      <Route path="/verify-email" element={<EmailVerification />} />
<Route path="/plans" element={<Dashboard />} />
 {/* Admin Routes */}
 <Route path="/1cglobal_admin_hoon_yaar/login" element={<AdminLoginPage />} />
  <Route
  path="/1cglobal_admin_hoon_yaar/*"
  element={
    <AdminProtectedRoute>
      <AdminLayout />
    </AdminProtectedRoute>
  }
/>
    <Route path="/about" element={<AboutUs />} />
    <Route path="/contact" element={<ContactUs />} />



<Route path="/forget-password" element={<ForgetPassword />} />


<Route path="/forget-otp" element={<ForgetOtp />} />

<Route path="/reset-password" element={<ResetPassword />} />




    </Routes>





    </>



  );
};

export default App;
