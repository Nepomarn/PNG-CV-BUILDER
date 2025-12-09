"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface AppFooterProps {
  language: "en" | "tp";
}

const translations = {
  en: {
    madeWith: "Made with",
    forPNG: "for Papua New Guinea",
    copyright: "© 2024 Tempo AI. All rights reserved.",
  },
  tp: {
    madeWith: "Wokim wantaim",
    forPNG: "bilong Papua New Guinea",
    copyright: "© 2024 Tempo AI. Olgeta raits i stap.",
  },
};

export default function AppFooter({ language }: AppFooterProps) {
  const t = translations[language];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="relative py-12 px-6 mt-12"
    >
      {/* Bilum texture overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              60deg,
              transparent,
              transparent 5px,
              rgba(255,111,0,0.3) 5px,
              rgba(255,111,0,0.3) 10px
            )
          `,
        }}
      />
      
      <div className="relative max-w-4xl mx-auto text-center">
        <p className="font-inter text-lg text-white flex items-center justify-center gap-2 mb-4">
          {t.madeWith}
          <Heart className="w-5 h-5 text-png-red fill-png-red animate-pulse" />
          {t.forPNG}
        </p>
        <p className="font-inter text-sm text-gray-400">
          {t.copyright}
        </p>
        
        {/* PNG Flag Colors Bar */}
        <div className="mt-8 flex justify-center gap-1">
          <div className="w-16 h-2 bg-png-red rounded-full" />
          <div className="w-16 h-2 bg-png-black rounded-full border border-white/20" />
          <div className="w-16 h-2 bg-png-orange rounded-full" />
        </div>
      </div>
    </motion.footer>
  );
}
