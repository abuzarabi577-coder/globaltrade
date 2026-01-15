// CoinRainTask.jsx - STICKER STYLE (MORE COMPACT)
export default CoinRainTask = ({ onClose }) => {
  const [showGame, setShowGame] = useState(false);

  if (showGame) return <CoinRainGame />;

  return (
    <motion.div className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-[9999] flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-[240px] h-[180px] bg-slate-900/95 border border-orange-500/70 rounded-xl shadow-lg overflow-hidden"
      >
        {/* STICKER HEADER */}
        <div className="h-[62%] px-2 pt-2 flex flex-col items-center justify-center text-center border-b border-slate-700">
          <div className="w-7 h-7 mb-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow">
            <span className="text-[11px] font-black text-white">₿</span>
          </div>

          <h2 className="text-[11px] font-bold text-white leading-tight">
            BTC Rain
          </h2>

          <div className="text-[9px] text-slate-300 leading-tight mt-0.5">
            <p>Coins rain</p>
            <p className="text-orange-400 font-bold">Orange BTC</p>
            <p>100pts / 60s</p>
          </div>
        </div>

        {/* STICKER BUTTON */}
        <div className="h-[38%] flex items-center justify-center px-3 pb-4">
          <motion.button
            onClick={() => setShowGame(true)}
            className="px-4 py-1.5 text-[10px] bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full shadow border border-orange-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 START
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
