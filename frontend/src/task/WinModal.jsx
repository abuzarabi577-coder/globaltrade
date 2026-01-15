// WinModal.jsx
import React from 'react';
import { motion } from 'framer-motion';

const WinModal = ({ points, onClaim }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[100] flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 to-slate-950 border-4 border-orange-500/70 rounded-3xl max-w-lg w-full text-center p-12 shadow-3xl backdrop-blur-xl"
      >
        <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-3xl flex items-center justify-center shadow-3xl border-4 border-orange-400/60">
          <div className="text-5xl font-black text-slate-900 drop-shadow-3xl">🏆</div>
        </div>
        
        <h2 className="text-4xl font-black text-slate-100 mb-6">Challenge Complete!</h2>
        <div className="text-6xl font-black bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent mb-8 drop-shadow-4xl">
          {points} Points
        </div>
        
        <p className="text-slate-300 mb-12 text-xl leading-relaxed">
          {points >= 90 ? 'Perfect Score!' : points >= 70 ? 'Excellent!' : 'Great Job!'}
        </p>
        
        <motion.button
          onClick={onClaim}
          className="w-full py-6 bg-gradient-to-r from-orange-500 to-orange-600 text-slate-900 font-black text-2xl rounded-3xl shadow-3xl hover:shadow-orange-600/50 border-2 border-orange-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          💰 Claim {points} Points
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default WinModal;
