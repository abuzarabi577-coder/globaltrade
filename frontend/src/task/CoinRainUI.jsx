// CoinRainUI.jsx - CLEAN SINGLE LAYOUT
import React from 'react';
import { motion } from 'framer-motion';

// CoinRainUI.jsx - NO COINS ON RIGHT SCORE CARD
const CoinRainUI = ({ coins, points, timeLeft, screenSize, gameActive, onBTCTap }) => {
  const isMobile = screenSize === 'mobile';
  const isTablet = screenSize === 'tablet';
  const isDesktop = screenSize === 'desktop';

  // LEFT GAME BOUNDARY - Coins sirf left side pe
  const gameWidth = isMobile ? 300 : isTablet ? 600 : 800; // Max game area width

  return (
    <>
      {/* SCORE TOP - Mobile + Tablet */}
      {!isDesktop && (
        <div className="fixed top-0 left-0 right-0 h-20 bg-slate-900/98 backdrop-blur-3xl border-b-2 border-slate-700 z-50 flex items-center justify-center px-4">
          <div className="text-center space-y-1 w-full max-w-md">
            <div className="text-2xl font-black bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              {points}/100
            </div>
            <div className={`text-lg font-bold ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
              {timeLeft}s
            </div>
          </div>
        </div>
      )}

      {/* SINGLE CLEAN LAYOUT */}
      <div className={`fixed inset-0 ${!isDesktop ? 'pt-20' : ''} z-40 overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-950 ${isDesktop ? 'flex' : ''}`}>
        
        {/* GAME AREA - Coins ONLY here */}
        <div className={`
          ${isMobile ? 'w-full h-[calc(100vh-5rem)] px-4 pt-4 relative' : 
            isTablet ? 'w-full h-screen px-6 pt-24 relative' : 
            'w-full xl:w-1/2 h-screen relative px-8 pt-24'
          } overflow-hidden
        `}>
          {/* Instructions */}
          <div className={`absolute ${isMobile ? 'top-4 left-4 text-sm' : 'top-8 left-8 text-lg'} font-bold text-white z-30 pointer-events-none bg-black/50 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-slate-600/50`}>
            🟠 Tap ONLY Orange BTC Coins
          </div>
          
          {/* Coins Canvas - BOUNDARY CHECK */}
          <div className="w-full h-full relative">
            {coins.map(coin => {
              // SKIP coins outside game area
              if (coin.x > gameWidth) return null;
              
              return (    
                <motion.div
                  key={coin.id}
                  className={`absolute shadow-2xl z-20 select-none touch-none cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-150 ${
                    coin.type === 'BTC'
                      ? 'bg-gradient-to-br from-orange-400/95 via-orange-500/98 to-orange-600/95 border-4 border-orange-300/90 shadow-orange-500/80 hover:shadow-orange-600/60'
                      : 'bg-gradient-to-br from-slate-600/80 via-slate-700/85 to-slate-800/80 border-2 border-slate-500/60 shadow-slate-600/50'
                  }`}
                  style={{
                    left: `${coin.x}px`,
                    top: `${coin.y}px`,
                    width: `${(isMobile ? 34 : isTablet ? 38 : 42) * coin.size}px`,
                    height: `${(isMobile ? 34 : isTablet ? 38 : 42) * coin.size}px`,
                    borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%'
                  }}
                  initial={{ y: -120, opacity: 0 }}
                animate={{
                  y: window.innerHeight,
                  opacity: [1, 0.9, 0.7, 0],
                  rotate: [0, 720]
                }}
                transition={{ 
                  y: { duration: 8, ease: "easeOut" },
                  opacity: { duration: 8 },
                  rotate: { duration: 8 }
                }}
                  onClick={() => coin.type === 'BTC' && onBTCTap(coin.id)}
                >
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-xs uppercase drop-shadow-2xl pointer-events-none tracking-wider">
                    {coin.type}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* DESKTOP RIGHT SCORE - NO OVERFLOW */}
        {isDesktop && (
          <div className="hidden xl:flex xl:w-1/2 h-screen bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-3xl border-l-2 border-slate-700/50 flex-col items-center justify-center p-12 pointer-events-none">
            {/* Score content same - pointer-events-none for safety */}
            <div className="text-center space-y-10 w-full max-w-lg z-10">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-500/20 to-orange-400/20 border-4 border-orange-500/40 rounded-3xl flex flex-col items-center justify-center shadow-2xl">
                <div className="text-5xl font-black text-orange-400">₿</div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">BTC Hunter</div>
              </div>
              <div className="space-y-8">
                <div className="text-7xl font-black bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                  {points}<span className="text-5xl">/100</span>
                </div>
                <div className="w-full bg-slate-800/60 backdrop-blur-xl rounded-3xl h-6 overflow-hidden border-2 border-slate-600/50">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-3xl shadow-2xl"
                    initial={{ width: 0 }}
                    animate={{ width: `${(points/100)*100}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </div>
                <div className={`text-6xl font-black ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
                  {timeLeft}s
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CoinRainUI;
