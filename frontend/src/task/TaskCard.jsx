import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaTwitter, FaTelegramPlane, FaYoutube, FaShareAlt, FaGamepad, FaUserCircle
} from 'react-icons/fa';
 export default function  TaskCard({ task, onStart }) {
   const isCompleted = task.status === 'completed';
 const Icon = task.icon || FaShareAlt;
 
   return (
 
 
     
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
       whileHover={{ y: -4 }}
       className="bg-black/70 backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-gray-800/60 hover:border-yellow-500/60 transition-all shadow-lg hover:shadow-xl"
     >
       <div className="flex items-start justify-between gap-4 mb-5">
         <div className="flex items-center gap-3">
           <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${
             isCompleted 
               ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/40' 
               : 'bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-yellow-500/40'
           }`}>
 <Icon className="w-5 h-5 text-gray-900" />
           </div>
           <div>
             <h3 className="text-lg md:text-xl font-semibold text-white tracking-wide">
               {task.title}
             </h3>
             <p className="text-xs md:text-sm text-gray-400">
               {task.description}
             </p>
           </div>
         </div>
         <div className="text-right">
           <div className="text-[11px] uppercase tracking-wider text-gray-500">
             Reward
           </div>
           <div className={`text-xl font-black ${isCompleted ? 'text-green-400' : 'text-yellow-400'}`}>
             +${task.reward}
           </div>
         </div>
       </div>
 
       {/* Progress bar */}
       <div className="mb-4">
         <div className="text-xs text-gray-500 mb-1 flex justify-between">
           <span>Progress</span>
           <span>{isCompleted ? '100%' : '0%'}</span>
         </div>
         <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
           <motion.div
             className={`h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}
             initial={{ width: 0 }}
             animate={{ width: isCompleted ? '100%' : '0%' }}
             transition={{ duration: 0.5 }}
           />
         </div>
       </div>
 
       <div className="flex items-center justify-between">
         <span className={`text-xs md:text-sm font-semibold ${
           isCompleted ? 'text-green-400' : 'text-gray-400'
         }`}>
           {isCompleted ? '✓ Completed' : 'Ready to complete'}
         </span>
         <motion.button
           disabled={isCompleted}
           onClick={() => !isCompleted && onStart(task)}
           whileHover={!isCompleted ? { scale: 1.05 } : {}}
           className={`px-4 py-1.5 rounded-xl text-xs md:text-sm font-semibold border transition-all ${
             isCompleted
               ? 'border-green-500 text-green-300 bg-green-500/10 cursor-default'
               : 'border-yellow-500 text-yellow-300 bg-yellow-500/10 hover:bg-yellow-500/20 shadow-md shadow-yellow-500/20'
           }`}
         >
           {isCompleted ? 'Completed ✓' : 'Start Task'}
         </motion.button>
       </div>
     </motion.div>
   );
 }

