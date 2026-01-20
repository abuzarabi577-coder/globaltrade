import React from "react";
import { motion } from "framer-motion";

export default function LoadingInlineLogo({ showText = true, text = "Syncing...." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <LogoLoader />
      {showText && (
        <div className="text-xs  font-semibold text-gray-400">{text}</div>
      )}
    </div>
  );
}

function LogoLoader() {
  return (
    <svg
      className="h-12 w-100 "
      viewBox="0 0 300 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="1C Trader Loading"
    >
      <defs>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="45%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shadow line */}
      <path
        d="M 28 54 L 44 42 L 56 47 L 70 36 L 84 41 L 98 30 L 112 34"
        stroke="#ffffff"
        strokeOpacity="0.12"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Animated draw */}
      <motion.path
        d="M 28 54 L 44 42 L 56 47 L 70 36 L 84 41 L 98 30 L 112 34"
        stroke="url(#gold)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#softGlow)"
        initial={{ pathLength: 0, opacity: 0.95 }}
        animate={{ pathLength: [0, 1, 0] }}
        transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Break ticks */}
      <motion.path
        d="M 44 42 L 44 38"
        stroke="url(#gold)"
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
      />
      <motion.path
        d="M 70 36 L 70 32"
        stroke="url(#gold)"
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
      />
      <motion.path
        d="M 98 30 L 98 26"
        stroke="url(#gold)"
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut", delay: 0.55 }}
      />

      {/* Points (subtle pulse) */}
      {[
        { cx: 28, cy: 54, d: 0.0 },
        { cx: 44, cy: 42, d: 0.1 },
        { cx: 56, cy: 47, d: 0.2 },
        { cx: 70, cy: 36, d: 0.3 },
        { cx: 84, cy: 41, d: 0.4 },
        { cx: 98, cy: 30, d: 0.5 },
        { cx: 112, cy: 34, d: 0.6 },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r="2.2"
          fill="#f59e0b"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut", delay: p.d }}
        />
      ))}

      {/* Arrow */}
      <motion.path
        d="M 112 34 L 118 30"
        stroke="url(#gold)"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#softGlow)"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut", delay: 0.85 }}
      />

      {/* 1C TRADER text */}
     {/* 1C TRADER text (fit inside widened viewBox) */}
<text
  x="135"
  y="45"
  fontFamily="Inter, Roboto, sans-serif"
  fontSize="30"
  fontWeight="900"
  fill="#ffffff"
  letterSpacing="-0.6"
>
  1C
</text>

<text
  x="185"
  y="48"
  fontFamily="Inter, Roboto, sans-serif"
  fontSize="24"
  fontWeight="800"
  fill="url(#gold)"
  letterSpacing="1"
>
  Global
</text>

    </svg>
  );
}
