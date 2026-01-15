// EmailVerification.jsx - SIMPLE ONLY
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate ,useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from './Alert';

const EmailVerification = () => {

    const { handleVerifyCode,sendVerifyCode,alert,showAlert} = useAuth();

const [code, setCode] = useState('');
const navigate = useNavigate();
const [searchParams] = useSearchParams();
const userId = searchParams.get('userId'); // ✅ URL se userId lo

  const handleVerify = () => {
handleVerifyCode(userId,code)
  };

  const handleResend = () => {
    // Empty function - backend handle karega
sendVerifyCode(userId)
  };


  return (

<>
   {/* Alert Component */}
      <Alert
        type={alert.type} 
        message={alert.message} 
        isOpen={alert.isOpen}
        onClose={() => showAlert({ isOpen: false, type: '', message: '' })}
      />

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-950 px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full space-y-8 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 shadow-2xl"
      >
        {/* Icon */}
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-3xl flex items-center justify-center border-2 border-yellow-500/30 shadow-xl">
          <span className="text-4xl">📧</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Enter Code
          </h1>
          <p className="text-slate-400 text-lg">6-digit code sent to your email</p>
        </div>

        {/* CODE INPUT */}
        <input
          type="text"
          maxLength="6"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="000000"
          className="w-full p-6 bg-slate-800/50 border-2 border-slate-700 rounded-3xl text-3xl font-black text-center text-yellow-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
        />

        {/* VERIFY BUTTON */}
        <motion.button
          onClick={handleVerify}
          disabled={code.length !== 6}
          className="w-full py-5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-black text-xl rounded-3xl shadow-2xl hover:shadow-yellow-500/50 border border-yellow-400/50 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
        >
          Verify Code
        </motion.button>

        {/* RESEND */}
        <motion.button
          onClick={handleResend}
          className="w-full py-4 bg-slate-800/50 hover:bg-slate-700 text-slate-300 font-semibold text-lg rounded-2xl border-2 border-slate-700 hover:border-slate-600 transition-all"
          whileHover={{ scale: 1.01 }}
        >
          📧 Resend Code
        </motion.button>

        <button 
          onClick={() => navigate('/login')}
          className="text-sm text-slate-400 hover:text-white underline"
        >
          ← Back to Login
        </button>
      </motion.div>
    </div>
</>
  );
};

export default EmailVerification;
