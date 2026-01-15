import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const Alert = ({ type = 'success', message, onClose, isOpen }) => {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'error':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'warning':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-4 right-4 z-50 w-96 max-w-sm p-6 rounded-2xl shadow-2xl backdrop-blur-xl border ${getColors()} bg-[#020617]/95 border-opacity-50`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {type === 'success' && <FaCheckCircle className="w-6 h-6" />}
          {type === 'error' && <FaExclamationTriangle className="w-6 h-6" />}
          {type === 'warning' && <FaExclamationTriangle className="w-6 h-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default Alert;
