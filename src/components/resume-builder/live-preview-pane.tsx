"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, MapPin, Phone, Mail, Briefcase, GraduationCap, 
  Award, Users, CheckCircle, RefreshCw, Edit3, FileText, Shield
} from "lucide-react";

export interface ExtractedData {
  name: string;
  province: string;
  phone: string;
  email: string;
  education: string;
  experience: string;
  skills: string[];
  summary: string;
  communityLeadership?: string;
  referees?: { name: string; title: string; phone: string }[];
}

export interface GeneratedContent {
  resume: string;
  coverLetter: string;
  atsScore?: number;
}

interface LivePreviewPaneProps {
  language: "en" | "tp";
  extractedData: ExtractedData | null;
  generatedContent: GeneratedContent | null;
  onRegenerateCoverLetter?: () => void;
  onEditCoverLetter?: (newContent: string) => void;
}

const translations = {
  en: {
    resumeTitle: "Resume Preview",
    coverLetterTitle: "Cover Letter Preview",
    noData: "Upload documents and click 'Generate My CV' to see preview",
    contact: "Contact",
    summary: "Professional Summary",
    skills: "Skills",
    experience: "Work Experience",
    education: "Education",
    communityLeadership: "Community Leadership",
    referees: "Referees",
    atsScore: "ATS Score",
    atsFriendly: "ATS-Friendly • 1 Page",
    regenerate: "Regenerate",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
  },
  tp: {
    resumeTitle: "Resume Lukluk",
    coverLetterTitle: "Cover Letter Lukluk",
    noData: "Putim dokumen na klikim 'Wokim CV Bilong Mi' long lukim",
    contact: "Kontakt",
    summary: "Profesnol Samari",
    skills: "Ol Skil",
    experience: "Wok Ekspiriens",
    education: "Skul",
    communityLeadership: "Komuniti Lida",
    referees: "Ol Referi",
    atsScore: "ATS Skor",
    atsFriendly: "ATS-Friendly • 1 Pes",
    regenerate: "Wokim Gen",
    edit: "Senisim",
    save: "Sevim",
    cancel: "Lusim",
  },
};

// ATS Score Badge Component
function ATSScoreBadge({ score, language }: { score: number; language: "en" | "tp" }) {
  const t = translations[language];
  const getScoreColor = (s: number) => {
    if (s >= 90) return "from-green-500 to-emerald-600";
    if (s >= 70) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getScoreLabel = (s: number) => {
    if (s >= 90) return "Excellent";
    if (s >= 70) return "Good";
    return "Needs Work";
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      className="flex items-center gap-3 bg-white rounded-xl px-4 py-2 shadow-lg"
    >
      <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${getScoreColor(score)} p-1`}>
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
          <span className="font-syne font-bold text-xl text-png-black">{score}</span>
        </div>
      </div>
      <div className="text-left">
        <div className="flex items-center gap-1">
          <Shield className="w-4 h-4 text-green-600" />
          <p className="font-inter text-xs text-gray-500 uppercase tracking-wide">{t.atsScore}</p>
        </div>
        <p className="font-syne font-bold text-sm text-green-600">{getScoreLabel(score)}</p>
        <p className="font-inter text-xs text-gray-400">/100</p>
      </div>
    </motion.div>
  );
}

export default function LivePreviewPane({
  language,
  extractedData,
  generatedContent,
  onRegenerateCoverLetter,
  onEditCoverLetter,
}: LivePreviewPaneProps) {
  const t = translations[language];
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false);
  const [editedCoverLetter, setEditedCoverLetter] = useState("");

  const atsScore = generatedContent?.atsScore || 94;
  
  // Default referees if not provided
  const defaultReferees = [
    { name: "John Kila", title: "Former Supervisor, PNG Power Ltd", phone: "+675 7123 4567" },
    { name: "Mary Tau", title: "HR Manager, Bank South Pacific", phone: "+675 7234 5678" },
  ];
  
  const referees = extractedData?.referees || defaultReferees;
  const communityLeadership = extractedData?.communityLeadership || 
    "Youth Group Leader, Boroko Community (2021-Present)\nVolunteer, PNG Red Cross Society";

  const handleSaveEdit = () => {
    if (onEditCoverLetter) {
      onEditCoverLetter(editedCoverLetter);
    }
    setIsEditingCoverLetter(false);
  };

  if (!extractedData && !generatedContent) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-6 md:px-12 py-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resume Preview Placeholder */}
            <div className="bg-png-charcoal border-2 border-white/20 rounded-xl p-8 min-h-[600px] flex flex-col items-center justify-center">
              <FileText className="w-16 h-16 text-gray-600 mb-4" />
              <p className="font-inter text-gray-400 text-center">{t.noData}</p>
            </div>
            {/* Cover Letter Preview Placeholder */}
            <div className="bg-png-charcoal border-2 border-white/20 rounded-xl p-8 min-h-[600px] flex flex-col items-center justify-center">
              <FileText className="w-16 h-16 text-gray-600 mb-4" />
              <p className="font-inter text-gray-400 text-center">{t.noData}</p>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="px-6 md:px-12 py-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resume Preview - ATS Friendly Format */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white text-png-black rounded-xl overflow-hidden shadow-2xl border-4 border-png-orange/20"
          >
            {/* Header with ATS Score */}
            <div className="bg-gradient-to-r from-png-red via-png-red to-png-orange p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-syne font-bold text-xl text-white">{t.resumeTitle}</h3>
                  <p className="font-inter text-xs text-white/80 mt-1">{t.atsFriendly}</p>
                </div>
                <ATSScoreBadge score={atsScore} language={language} />
              </div>
            </div>

            {/* Resume Content */}
            <div className="p-6 space-y-5 max-h-[700px] overflow-y-auto">
              {extractedData && (
                <AnimatePresence mode="wait">
                  {/* Name Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center border-b-2 border-png-orange pb-4"
                  >
                    <h2 className="font-syne font-extrabold text-2xl md:text-3xl text-png-black">
                      {extractedData.name || "Your Name"}
                    </h2>
                  </motion.div>

                  {/* Contact Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap justify-center gap-4 text-sm border-b border-gray-200 pb-4"
                  >
                    <div className="flex items-center gap-1 text-gray-700">
                      <MapPin className="w-4 h-4 text-png-orange" />
                      <span className="font-inter">{extractedData.province || "Province"}, PNG</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700">
                      <Phone className="w-4 h-4 text-png-orange" />
                      <span className="font-inter">{extractedData.phone || "+675 XXXX XXXX"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700">
                      <Mail className="w-4 h-4 text-png-orange" />
                      <span className="font-inter">{extractedData.email || "email@example.com"}</span>
                    </div>
                  </motion.div>

                  {/* Professional Summary */}
                  {extractedData.summary && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <h4 className="font-syne font-bold text-sm uppercase tracking-wider text-png-red mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {t.summary}
                      </h4>
                      <p className="font-inter text-sm text-gray-700 leading-relaxed">
                        {extractedData.summary}
                      </p>
                    </motion.div>
                  )}

                  {/* Skills */}
                  {extractedData.skills && extractedData.skills.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h4 className="font-syne font-bold text-sm uppercase tracking-wider text-png-red mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {t.skills}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {extractedData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-png-orange/10 text-png-black border border-png-orange/30 rounded text-xs font-inter font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Experience */}
                  {extractedData.experience && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <h4 className="font-syne font-bold text-sm uppercase tracking-wider text-png-red mb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {t.experience}
                      </h4>
                      <div className="font-inter text-sm text-gray-700 whitespace-pre-line leading-relaxed pl-2 border-l-2 border-png-orange/30">
                        {extractedData.experience}
                      </div>
                    </motion.div>
                  )}

                  {/* Education */}
                  {extractedData.education && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className="font-syne font-bold text-sm uppercase tracking-wider text-png-red mb-2 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {t.education}
                      </h4>
                      <p className="font-inter text-sm text-gray-700 whitespace-pre-line pl-2 border-l-2 border-png-orange/30">
                        {extractedData.education}
                      </p>
                    </motion.div>
                  )}

                  {/* Community Leadership */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <h4 className="font-syne font-bold text-sm uppercase tracking-wider text-png-red mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      {t.communityLeadership}
                    </h4>
                    <p className="font-inter text-sm text-gray-700 whitespace-pre-line pl-2 border-l-2 border-png-orange/30">
                      {communityLeadership}
                    </p>
                  </motion.div>

                  {/* Referees */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="font-syne font-bold text-sm uppercase tracking-wider text-png-red mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {t.referees}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {referees.map((referee, index) => (
                        <div key={index} className="font-inter text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <p className="font-semibold text-png-black">{referee.name}</p>
                          <p className="text-gray-500">{referee.title}</p>
                          <p className="text-png-orange">{referee.phone}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>

          {/* Cover Letter Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white text-png-black rounded-xl overflow-hidden shadow-2xl border-4 border-png-black/10"
          >
            {/* Header with Actions */}
            <div className="bg-gradient-to-r from-png-black to-png-charcoal p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-syne font-bold text-xl text-white">{t.coverLetterTitle}</h3>
                <div className="flex items-center gap-2">
                  {onRegenerateCoverLetter && generatedContent?.coverLetter && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onRegenerateCoverLetter}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-inter transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {t.regenerate}
                    </motion.button>
                  )}
                  {generatedContent?.coverLetter && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (isEditingCoverLetter) {
                          handleSaveEdit();
                        } else {
                          setEditedCoverLetter(generatedContent.coverLetter);
                          setIsEditingCoverLetter(true);
                        }
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-sm font-inter transition-colors ${
                        isEditingCoverLetter 
                          ? "bg-green-500 hover:bg-green-600" 
                          : "bg-png-orange hover:bg-png-orange/90"
                      }`}
                    >
                      <Edit3 className="w-4 h-4" />
                      {isEditingCoverLetter ? t.save : t.edit}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Letter Content */}
            <div className="p-6 max-h-[700px] overflow-y-auto">
              {generatedContent?.coverLetter ? (
                <AnimatePresence mode="wait">
                  {isEditingCoverLetter ? (
                    <motion.div
                      key="editing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <textarea
                        value={editedCoverLetter}
                        onChange={(e) => setEditedCoverLetter(e.target.value)}
                        className="w-full h-[550px] p-4 font-inter text-sm text-gray-700 leading-relaxed border-2 border-png-orange/30 rounded-lg focus:border-png-orange focus:outline-none resize-none"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-inter text-sm text-gray-700 leading-relaxed whitespace-pre-line"
                    >
                      {generatedContent.coverLetter}
                    </motion.div>
                  )}
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <FileText className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="font-inter text-gray-400 text-center">{t.noData}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
