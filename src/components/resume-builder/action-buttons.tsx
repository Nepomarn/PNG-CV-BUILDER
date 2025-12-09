"use client";

import { motion } from "framer-motion";
import { Sparkles, Download, FileText, Send, Briefcase } from "lucide-react";
import PNGLoadingSpinner from "./png-loading-spinner";

interface ActionButtonsProps {
  language: "en" | "tp";
  isLoading: boolean;
  hasGenerated: boolean;
  canGenerate: boolean;
  onGenerate: () => void;
  onDownloadPDF: () => void;
  onDownloadWord: () => void;
  onApplyToJobs?: () => void;
}

const translations = {
  en: {
    generate: "Generate My CV",
    generating: "Generating your documents...",
    downloadPDF: "Download PDF",
    downloadWord: "Download Word",
    uploadFirst: "Upload documents first",
    applyToJobs: "Apply to 5 Jobs Now",
  },
  tp: {
    generate: "Wokim CV Bilong Mi",
    generating: "Wokim ol dokumen bilong yu...",
    downloadPDF: "Kisim PDF",
    downloadWord: "Kisim Word",
    uploadFirst: "Putim dokumen pastaim",
    applyToJobs: "Aplai long 5 Wok Nau",
  },
};

export default function ActionButtons({
  language,
  isLoading,
  hasGenerated,
  canGenerate,
  onGenerate,
  onDownloadPDF,
  onDownloadWord,
  onApplyToJobs,
}: ActionButtonsProps) {
  const t = translations[language];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="px-6 md:px-12 py-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          {/* Generate Button */}
          {isLoading ? (
            <div className="py-8">
              <PNGLoadingSpinner size="lg" text={t.generating} />
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: canGenerate ? 1.02 : 1 }}
              whileTap={{ scale: canGenerate ? 0.98 : 1 }}
              onClick={onGenerate}
              disabled={!canGenerate}
              className={`relative px-12 py-5 font-syne font-bold text-xl rounded-xl transition-all duration-200 flex items-center gap-3 ${
                canGenerate
                  ? "bg-gradient-to-r from-png-orange to-png-red text-white shadow-lg shadow-png-orange/30 hover:shadow-xl hover:shadow-png-orange/40"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Sparkles className="w-6 h-6" />
              {canGenerate ? t.generate : t.uploadFirst}
            </motion.button>
          )}

          {/* Download & Apply Buttons */}
          {hasGenerated && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Primary Action Row */}
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDownloadPDF}
                  className="px-8 py-4 bg-png-charcoal border-2 border-png-orange text-white font-inter font-semibold rounded-xl flex items-center gap-2 hover:bg-png-orange/10 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  {t.downloadPDF}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDownloadWord}
                  className="px-8 py-4 bg-png-charcoal border-2 border-white/30 text-white font-inter font-semibold rounded-xl flex items-center gap-2 hover:border-white/50 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  {t.downloadWord}
                </motion.button>
              </div>

              {/* Apply to Jobs Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onApplyToJobs}
                className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-syne font-bold text-lg rounded-xl flex items-center gap-3 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all"
              >
                <Briefcase className="w-6 h-6" />
                {t.applyToJobs}
                <Send className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
