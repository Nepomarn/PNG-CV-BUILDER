"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileText, Image as ImageIcon, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadZoneProps {
  language: "en" | "tp";
  files: File[];
  onFilesChange: (files: File[]) => void;
}

const translations = {
  en: {
    title: "Upload Your Documents",
    subtitle: "Upload your old CV, Grade 12 certificate, job advert (max 5 files)",
    dragText: "Drag & drop files here or click to browse",
    supported: "Supported: PDF, DOCX, JPG, PNG",
    remove: "Remove",
    maxError: "Maximum 5 files allowed",
    invalidError: "Some files were invalid. Please use PDF, DOCX, JPG, or PNG files.",
    fileTooLarge: "File too large. Maximum size is 10MB per file.",
    filesUploaded: "files uploaded",
    readyToProcess: "Ready to process!",
  },
  tp: {
    title: "Putim Ol Dokumen Bilong Yu",
    subtitle: "Putim olpela CV, Grade 12 sertifiket, job advet (max 5 fayl)",
    dragText: "Dregim na putim fayl hia o klikim long sekim",
    supported: "Yumi ken kisim: PDF, DOCX, JPG, PNG",
    remove: "Rausim",
    maxError: "Maximum 5 fayl tasol",
    invalidError: "Sampela fayl i no gutpela. Yusim PDF, DOCX, JPG, o PNG fayl.",
    fileTooLarge: "Fayl i bikpela tumas. Maximum saiz em 10MB.",
    filesUploaded: "fayl i putim pinis",
    readyToProcess: "Redi long proses!",
  },
};

export default function FileUploadZone({ language, files, onFilesChange }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const t = translations[language];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndAddFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    // Check file sizes
    const oversizedFiles = fileArray.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setError(t.fileTooLarge);
      return;
    }

    const validFiles = fileArray.filter((file) => validTypes.includes(file.type));

    if (validFiles.length + files.length > 5) {
      setError(t.maxError);
      return;
    }

    if (validFiles.length !== fileArray.length) {
      setError(t.invalidError);
    } else {
      setError("");
    }

    const updatedFiles = [...files, ...validFiles];
    onFilesChange(updatedFiles);
  }, [files, onFilesChange, t.maxError, t.invalidError, t.fileTooLarge]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      validateAndAddFiles(e.dataTransfer.files);
    },
    [validateAndAddFiles]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndAddFiles(e.target.files);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
    setError("");
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-8 h-8 text-png-orange flex-shrink-0" />;
    }
    return <FileText className="w-8 h-8 text-png-orange flex-shrink-0" />;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="px-6 md:px-12 py-8"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="font-syne font-bold text-2xl md:text-3xl mb-2 text-white">
          {t.title}
        </h2>
        <p className="font-inter text-gray-300 mb-6">{t.subtitle}</p>

        {/* File count indicator */}
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center justify-center gap-2"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-inter text-sm text-green-400">
                {files.length}/5 {t.filesUploaded} • {t.readyToProcess}
              </span>
            </div>
          </motion.div>
        )}

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-4 border-dashed rounded-xl p-8 md:p-12 text-center transition-all duration-200 cursor-pointer ${
            isDragging
              ? "border-png-orange bg-png-orange/10 scale-[1.02]"
              : "border-white/30 hover:border-white/50 bg-white/5"
          }`}
        >
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={files.length >= 5}
          />

          <motion.div
            animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 text-png-orange" />
          </motion.div>
          <p className="font-inter text-lg mb-2 text-white">{t.dragText}</p>
          <p className="font-inter text-sm text-gray-400">{t.supported}</p>
          
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["PDF", "DOCX", "JPG", "PNG"].map((type) => (
              <span
                key={type}
                className="px-3 py-1 bg-white/10 rounded-full text-xs font-inter text-gray-300"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 flex items-center gap-2 text-png-red font-inter text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className="flex items-center gap-3 p-4 bg-png-charcoal border-2 border-png-orange/30 rounded-lg hover:border-png-orange/50 transition-colors"
                >
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="font-inter font-medium truncate text-white">
                      {file.name}
                    </p>
                    <p className="font-inter text-xs text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
                    aria-label={t.remove}
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-white" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
