"use client";

import { motion } from "framer-motion";
import { FileText, CheckCircle, AlertCircle, Scan, Brain } from "lucide-react";

interface DocumentSummaryProps {
  language: "en" | "tp";
  filesProcessed: { name: string; type: string; size: number }[];
  extractedSummary: string;
  isAIPowered: boolean;
}

const translations = {
  en: {
    title: "Document Analysis Summary",
    subtitle: "AI-powered OCR extraction results",
    filesScanned: "Files Scanned",
    extractedInfo: "Extracted Information",
    aiPowered: "Powered by Gemini AI",
    ocrComplete: "OCR Complete",
    documentsProcessed: "documents processed",
    characterExtracted: "characters extracted",
  },
  tp: {
    title: "Dokumen Analisis Samari",
    subtitle: "AI OCR i kisim ol infomesen",
    filesScanned: "Ol Fayl i Sken",
    extractedInfo: "Infomesen i Kisim",
    aiPowered: "Gemini AI i Wok",
    ocrComplete: "OCR i Pinis",
    documentsProcessed: "dokumen i proses",
    characterExtracted: "karakter i kisim",
  },
};

export default function DocumentSummary({
  language,
  filesProcessed,
  extractedSummary,
  isAIPowered,
}: DocumentSummaryProps) {
  const t = translations[language];

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("image") || type.includes("png") || type.includes("jpg")) return "🖼️";
    if (type.includes("word") || type.includes("doc")) return "📝";
    return "📎";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-png-charcoal to-png-black border-2 border-png-orange/30 rounded-xl p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-png-orange to-png-red rounded-lg flex items-center justify-center">
            <Scan className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-syne font-bold text-xl text-white">{t.title}</h3>
            <p className="font-inter text-sm text-gray-400">{t.subtitle}</p>
          </div>
        </div>
        {isAIPowered && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full px-4 py-2"
          >
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="font-inter text-xs text-purple-300">{t.aiPowered}</span>
          </motion.div>
        )}
      </div>

      {/* Files Processed */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-png-orange" />
          <h4 className="font-inter font-semibold text-white">{t.filesScanned}</h4>
          <span className="text-xs text-gray-500">
            ({filesProcessed.length} {t.documentsProcessed})
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filesProcessed.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 bg-white/5 rounded-lg p-3"
            >
              <span className="text-2xl">{getFileIcon(file.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="font-inter text-sm text-white truncate">{file.name}</p>
                <p className="font-inter text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Extracted Summary */}
      {extractedSummary && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h4 className="font-inter font-semibold text-white">{t.extractedInfo}</h4>
            <span className="text-xs text-gray-500">
              ({extractedSummary.length} {t.characterExtracted})
            </span>
          </div>
          <div className="bg-white/5 rounded-lg p-4 max-h-48 overflow-y-auto">
            <p className="font-inter text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
              {extractedSummary.substring(0, 500)}
              {extractedSummary.length > 500 && "..."}
            </p>
          </div>
        </div>
      )}

      {/* OCR Status Badge */}
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2"
        >
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="font-inter text-sm text-green-300">{t.ocrComplete}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
