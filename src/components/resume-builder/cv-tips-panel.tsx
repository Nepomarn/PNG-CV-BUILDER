"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lightbulb, ChevronDown, ChevronUp, CheckCircle2, 
  Target, FileText, Users, Award, Briefcase 
} from "lucide-react";

interface CVTipsPanelProps {
  language: "en" | "tp";
}

const translations = {
  en: {
    title: "CV Tips for PNG Job Seekers",
    subtitle: "Free tips to help you stand out",
    tips: [
      {
        icon: Target,
        title: "Tailor Your CV",
        content: "Customize your CV for each job application. Highlight skills and experience that match the job requirements."
      },
      {
        icon: FileText,
        title: "Keep It Concise",
        content: "Aim for 1-2 pages maximum. PNG employers prefer clear, focused CVs that highlight key achievements."
      },
      {
        icon: Award,
        title: "Highlight Achievements",
        content: "Use numbers and percentages to show impact. Example: 'Increased sales by 15%' is better than 'Improved sales'."
      },
      {
        icon: Users,
        title: "Include Community Work",
        content: "PNG employers value community involvement. Include church, village, or volunteer leadership roles."
      },
      {
        icon: Briefcase,
        title: "Local References",
        content: "Include 2-3 referees from PNG who can vouch for your work. Always ask permission first."
      },
    ],
    showMore: "Show More Tips",
    showLess: "Show Less",
  },
  tp: {
    title: "CV Tips Bilong Ol PNG Wokman",
    subtitle: "Fri tips bilong helpim yu",
    tips: [
      {
        icon: Target,
        title: "Senisim CV Bilong Yu",
        content: "Senisim CV bilong yu long olgeta wok aplikesen. Soim ol skil na ekspiriens we i matim wok."
      },
      {
        icon: FileText,
        title: "Mekim Sotpela",
        content: "Traim long 1-2 pes tasol. Ol PNG bos i laikim klia na fokus CV we i soim ol bikpela samting."
      },
      {
        icon: Award,
        title: "Soim Ol Gutpela Wok",
        content: "Yusim namba bilong soim impak. Eksampol: 'Mekim sales i go antap 15%' i gutpela moa."
      },
      {
        icon: Users,
        title: "Putim Komuniti Wok",
        content: "Ol PNG bos i laikim komuniti wok. Putim sios, ples, o volantia lida wok bilong yu."
      },
      {
        icon: Briefcase,
        title: "Lokal Referi",
        content: "Putim 2-3 referi long PNG husat inap toktok gut long wok bilong yu. Askim ol pastaim."
      },
    ],
    showMore: "Soim Moa Tips",
    showLess: "Haitim",
  },
};

export default function CVTipsPanel({ language }: CVTipsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = translations[language];
  const visibleTips = isExpanded ? t.tips : t.tips.slice(0, 2);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="px-6 md:px-12 py-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-png-charcoal/90 to-black/80 backdrop-blur-sm border-2 border-png-orange/30 rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-png-orange/20 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-png-orange" />
            </div>
            <div>
              <h3 className="font-syne font-bold text-lg text-white">{t.title}</h3>
              <p className="font-inter text-sm text-white/60">{t.subtitle}</p>
            </div>
          </div>

          {/* Tips Grid */}
          <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
              {visibleTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 p-4 bg-black/30 rounded-xl border border-white/5 hover:border-png-orange/30 transition-colors"
                  >
                    <div className="w-8 h-8 bg-png-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-png-orange" />
                    </div>
                    <div>
                      <h4 className="font-inter font-semibold text-white text-sm mb-1">
                        {tip.title}
                      </h4>
                      <p className="font-inter text-white/60 text-sm leading-relaxed">
                        {tip.content}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Show More/Less Button */}
          {t.tips.length > 2 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 w-full py-2 flex items-center justify-center gap-2 text-png-orange font-inter text-sm hover:bg-png-orange/10 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  {t.showLess}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  {t.showMore}
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
