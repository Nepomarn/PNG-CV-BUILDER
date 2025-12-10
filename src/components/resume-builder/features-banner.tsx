"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Globe, Clock, FileCheck, Sparkles } from "lucide-react";

interface FeaturesBannerProps {
  language: "en" | "tp";
}

const translations = {
  en: {
    features: [
      { icon: Zap, text: "Instant CV Generation" },
      { icon: Shield, text: "ATS-Optimized Format" },
      { icon: Globe, text: "Bilingual Support" },
      { icon: Clock, text: "Ready in 30 Seconds" },
      { icon: FileCheck, text: "Professional Templates" },
      { icon: Sparkles, text: "100% Free" },
    ],
  },
  tp: {
    features: [
      { icon: Zap, text: "Wokim CV Kwiktaim" },
      { icon: Shield, text: "ATS-Optimized Format" },
      { icon: Globe, text: "Tupela Tok Ples" },
      { icon: Clock, text: "Redi Long 30 Sekon" },
      { icon: FileCheck, text: "Profesnol Templet" },
      { icon: Sparkles, text: "100% Fri" },
    ],
  },
};

export default function FeaturesBanner({ language }: FeaturesBannerProps) {
  const t = translations[language];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="px-6 md:px-12 py-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {t.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
              >
                <Icon className="w-4 h-4 text-png-orange" />
                <span className="font-inter text-sm text-white/80">{feature.text}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
