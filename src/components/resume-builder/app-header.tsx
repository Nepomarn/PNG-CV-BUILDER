"use client";

import { Bird, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface AppHeaderProps {
  language: "en" | "tp";
  onLanguageToggle: () => void;
}

const translations = {
  en: {
    brand: "Tempo AI",
  },
  tp: {
    brand: "Tempo AI",
  },
};

export default function AppHeader({ language, onLanguageToggle }: AppHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const t = translations[language];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-png-black/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-png-orange rounded-full flex items-center justify-center">
            <Bird className="w-6 h-6 text-white" />
          </div>
          <span className="font-syne font-bold text-lg text-white hidden sm:block">
            {t.brand}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language Toggle with Flags */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onLanguageToggle}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={language}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2"
              >
                {language === "en" ? (
                  <>
                    <span className="text-lg">🇬🇧</span>
                    <span className="font-inter text-sm text-white font-medium">English</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">🇵🇬</span>
                    <span className="font-inter text-sm text-white font-medium">Tok Pisin</span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-white" />
              )
            ) : (
              <div className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
