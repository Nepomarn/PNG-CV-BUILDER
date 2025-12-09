"use client";

import { Bird } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  language: "en" | "tp";
  onLanguageToggle: () => void;
}

const translations = {
  en: {
    title: "Papua New Guinea's #1 AI Resume & Cover Letter Builder",
    subtitle: "Create professional resumes and cover letters in minutes",
  },
  tp: {
    title: "Namba Wan AI Resume na Cover Letter Builder bilong PNG",
    subtitle: "Wokim gutpela resume na cover letter kwiktaim",
  },
};

export default function HeroSection({ language, onLanguageToggle }: HeroSectionProps) {
  const t = translations[language];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative py-16 md:py-24 px-6 md:px-12 text-center"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 mb-8 bg-png-orange rounded-full"
        >
          <Bird className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-syne font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight"
        >
          {t.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-inter text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
        >
          {t.subtitle}
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={onLanguageToggle}
          className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 border-2 border-white/30 rounded-lg font-inter font-medium transition-all duration-200 active:scale-95"
        >
          {language === "en" ? "🇵🇬 Switch to Tok Pisin" : "🇵🇬 Switch to English"}
        </motion.button>
      </div>
    </motion.section>
  );
}
