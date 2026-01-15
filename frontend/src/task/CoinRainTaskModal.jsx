// CoinRainTaskModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CoinRainGame from './CoinRainGame';

const CoinRainTaskModal = ({ onClose }) => {
  const [showGame, setShowGame] = useState(false);

  if (showGame) {
    return <CoinRainGame />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        className="bg-slate-900/95 border-2 border-slate-700 rounded-3xl w-full max-w-lg max-h-[90vh] shadow-3xl overflow-hidden"
      >
        <div className="p-8 md:p-10 text-center border-b border-slate-700">
          <div className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-3xl">
            <span className="text-3xl md:text-4xl font-black text-slate-900">₿</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-100 mb-6">BTC Coin Rain</h2>
          <div className="space-y-4 text-slate-300 text-sm md:text-lg leading-relaxed">
            <p>• Coins rain from top continuously</p>
            <p>• <span className="font-bold text-orange-400 text-lg md:text-xl">Tap ONLY orange BTC coins</span></p>
            <p>• First to 100 points OR 60 seconds</p>
            <p className="text-orange-400 font-bold text-xl md:text-2xl pt-2">Max: 100 Points Daily</p>
          </div>
        </div>
        <div className="p-6 md:p-6">
          <motion.button
            onClick={() => setShowGame(true)}
            className="w-full py-6 md:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-slate-900 font-black text-lg md:text-xl rounded-2xl md:rounded-3xl shadow-3xl hover:shadow-orange-500/60 border-2 border-orange-400"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🚀 Start BTC Hunt (60s)
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CoinRainTaskModal;
