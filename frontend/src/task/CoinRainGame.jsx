// CoinRainGame.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import CoinRainUI from './CoinRainUI';
import WinModal from './WinModal';

const CoinRainGame = () => {
  const [coins, setCoins] = useState([]);
  const [points, setPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [showWinModal, setShowWinModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const gameRef = useRef(null);
  const [screenSize, setScreenSize] = useState('mobile'); // ← ADD THIS LINE

  // Responsive detection
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setIsMobile(true);
        setScreenSize('mobile');
      } else if (width < 1280) {
        setIsMobile(false);
        setScreenSize('tablet');
      } else {
        setIsMobile(false);
        setScreenSize('desktop');
      }
    };
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);
  // GAME END LOGIC - 100 points OR time up
  useEffect(() => {
    if (points >= 100 || timeLeft <= 0) {
      setGameActive(false);
      setTimeout(() => setShowWinModal(true), 500);
    }
  }, [points, timeLeft]);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && gameActive) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameActive]);

 // Spawn coins - INITIAL SPAWN ON MOUNT
useEffect(() => {
  if (!gameActive) return;
  
  const interval = setInterval(() => {
    setCoins(prev => [...prev.slice(-10), {
      id: Date.now() + Math.random(),
      x: Math.random() * (screenSize === 'mobile' ? 280 : screenSize === 'tablet' ? 500 : 800), // ← USE screenSize
      y: -100,
      type: ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'][Math.floor(Math.random() * 5)],
      size: 0.75 + Math.random() * 0.3
    }].slice(-12));
  }, 1000);
  return () => clearInterval(interval);
}, [gameActive, screenSize]); // ← Remove isMobile dependency


  // BTC Click Handler
  // CoinRainGame.jsx - PERFECT CLICK ON EVERY COIN
const handleBTCTap = useCallback((coinId) => {
  if (!gameActive) return;
  
  // IMMEDIATE coin removal + points
  setCoins(prev => {
    const newCoins = prev.filter(coin => coin.id !== coinId);
    setPoints(p => Math.min(p + 8, 100)); // SEPARATE setPoints
    return newCoins;
  });
}, [gameActive]);


  return (
    <>
      <CoinRainUI 
        coins={coins}
        points={points}
        timeLeft={timeLeft}
                screenSize={screenSize}  // ← NEW PROP

        isMobile={isMobile}
        gameActive={gameActive}
        onBTCTap={handleBTCTap}

      />
      {showWinModal && (
        <WinModal points={points} onClaim={() => window.location.reload()} />
      )}
    </>
  );
};

export default CoinRainGame;
