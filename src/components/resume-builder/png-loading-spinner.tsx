"use client";

import { motion } from "framer-motion";

interface PNGLoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function PNGLoadingSpinner({ size = "md", text }: PNGLoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        {/* PNG Flag-inspired spinner */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Red section */}
          <path
            d="M50 0 A50 50 0 0 1 100 50 L50 50 Z"
            fill="#D32F2F"
          />
          {/* Black section */}
          <path
            d="M100 50 A50 50 0 0 1 50 100 L50 50 Z"
            fill="#0A0A0A"
          />
          {/* Orange section */}
          <path
            d="M50 100 A50 50 0 0 1 0 50 L50 50 Z"
            fill="#FF6F00"
          />
          {/* Red section 2 */}
          <path
            d="M0 50 A50 50 0 0 1 50 0 L50 50 Z"
            fill="#D32F2F"
          />
          {/* Center circle */}
          <circle cx="50" cy="50" r="15" fill="white" />
          {/* Bird silhouette in center */}
          <path
            d="M50 40 C55 42 58 45 55 50 C58 52 56 55 50 55 C44 55 42 52 45 50 C42 45 45 42 50 40"
            fill="#FF6F00"
          />
        </svg>
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-inter text-white text-center"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
