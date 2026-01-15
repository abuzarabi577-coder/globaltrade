import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NoLoginForTasks = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-950 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full space-y-8"
      >
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl flex items-center justify-center border-2 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <span className="text-4xl text-slate-500">🔒</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-4 leading-tight">
            Login Required
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-sm mx-auto leading-relaxed">
            Please login to access daily tasks and earn rewards
          </p>
        </div>

        <motion.button
          onClick={() => navigate('/login')}
          className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-black text-lg md:text-xl rounded-3xl shadow-2xl hover:shadow-yellow-500/50 border border-yellow-400/50 backdrop-blur-xl transition-all max-w-sm mx-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🔐 Go to Login
        </motion.button>

        <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">
          Secure • Fast • Reliable
        </p>
      </motion.div>
    </div>
  );
};

export default NoLoginForTasks;
