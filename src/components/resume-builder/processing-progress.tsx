"use client";

import { motion } from "framer-motion";
import { FileText, Scan, Brain, FileCheck, CheckCircle } from "lucide-react";
import PNGLoadingSpinner from "./png-loading-spinner";

interface ProcessingProgressProps {
  language: "en" | "tp";
  currentStep: number;
  totalFiles: number;
}

const translations = {
  en: {
    title: "Processing Your Documents",
    steps: [
      "Preparing files...",
      "Uploading documents...",
      "Scanning content...",
      "Analyzing information...",
      "Generating CV & Cover Letter...",
      "Complete!",
    ],
    filesProcessing: "files being processed",
  },
  tp: {
    title: "Wokim Ol Dokumen Bilong Yu",
    steps: [
      "Redim ol fayl...",
      "Putim ol dokumen...",
      "Lukim ol samting...",
      "Skelim ol infomesen...",
      "Wokim CV na Cover Letter...",
      "Pinis!",
    ],
    filesProcessing: "fayl i wok long proses",
  },
};

const stepIcons = [FileText, FileText, Scan, Brain, FileCheck, CheckCircle];

export default function ProcessingProgress({
  language,
  currentStep,
  totalFiles,
}: ProcessingProgressProps) {
  const t = translations[language];
  const progress = Math.min((currentStep / 5) * 100, 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-6 md:px-12 py-8"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-png-charcoal/80 backdrop-blur-sm border-4 border-png-orange rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="font-syne font-bold text-2xl text-white mb-2">
              {t.title}
            </h3>
            <p className="font-inter text-white/70">
              {totalFiles} {t.filesProcessing}
            </p>
          </div>

          {/* Spinner */}
          <div className="flex justify-center mb-8">
            <PNGLoadingSpinner size="lg" />
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-3 bg-black/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-png-orange to-png-red"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-inter text-sm text-white/60">0%</span>
              <span className="font-inter text-sm text-white/60">100%</span>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {t.steps.map((step, index) => {
              const Icon = stepIcons[index];
              const isActive = index === currentStep;
              const isComplete = index < currentStep;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: isComplete || isActive ? 1 : 0.4,
                    x: 0 
                  }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-png-orange/20 border border-png-orange"
                      : isComplete
                      ? "bg-green-500/10"
                      : "bg-black/20"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isComplete
                        ? "bg-green-500"
                        : isActive
                        ? "bg-png-orange"
                        : "bg-white/10"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-white/50"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`font-inter ${
                      isActive
                        ? "text-white font-medium"
                        : isComplete
                        ? "text-green-400"
                        : "text-white/50"
                    }`}
                  >
                    {step}
                  </span>
                  {isActive && (
                    <motion.div
                      className="ml-auto"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 bg-png-orange rounded-full" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
