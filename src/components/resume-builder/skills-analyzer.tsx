"use client";

import { motion } from "framer-motion";
import { TrendingUp, Award, Target, Zap, CheckCircle } from "lucide-react";

interface SkillsAnalyzerProps {
  language: "en" | "tp";
  skills: string[];
  atsScore: number;
}

const translations = {
  en: {
    title: "Skills Analysis",
    subtitle: "How your skills match PNG job market demands",
    topSkills: "Top Skills Detected",
    marketDemand: "Market Demand",
    high: "High",
    medium: "Medium",
    low: "Low",
    suggestions: "Suggested Improvements",
    addSkills: "Consider adding these in-demand skills:",
    suggestedSkills: ["Microsoft Office", "Project Management", "Communication", "Leadership", "Problem Solving"],
  },
  tp: {
    title: "Skil Analisis",
    subtitle: "Olsem wanem ol skil bilong yu i fit long PNG wok maket",
    topSkills: "Nambawan Ol Skil",
    marketDemand: "Maket Nid",
    high: "Bikpela",
    medium: "Namel",
    low: "Liklik",
    suggestions: "Ol Sujesen",
    addSkills: "Tingim long putim ol dispela skil:",
    suggestedSkills: ["Microsoft Office", "Projek Manejmen", "Toktok Gut", "Lida", "Stretim Hevi"],
  },
};

const skillDemandData: Record<string, "high" | "medium" | "low"> = {
  "microsoft office": "high",
  "excel": "high",
  "communication": "high",
  "leadership": "high",
  "project management": "high",
  "accounting": "high",
  "customer service": "high",
  "data analysis": "medium",
  "marketing": "medium",
  "sales": "medium",
  "administration": "medium",
  "teamwork": "medium",
  "problem solving": "medium",
  "time management": "medium",
};

export default function SkillsAnalyzer({ language, skills, atsScore }: SkillsAnalyzerProps) {
  const t = translations[language];

  const getSkillDemand = (skill: string): "high" | "medium" | "low" => {
    const normalizedSkill = skill.toLowerCase();
    for (const [key, value] of Object.entries(skillDemandData)) {
      if (normalizedSkill.includes(key) || key.includes(normalizedSkill)) {
        return value;
      }
    }
    return "low";
  };

  const getDemandColor = (demand: "high" | "medium" | "low") => {
    switch (demand) {
      case "high": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-gray-500";
    }
  };

  const getDemandLabel = (demand: "high" | "medium" | "low") => {
    switch (demand) {
      case "high": return t.high;
      case "medium": return t.medium;
      case "low": return t.low;
    }
  };

  const analyzedSkills = skills.slice(0, 8).map(skill => ({
    name: skill,
    demand: getSkillDemand(skill),
  }));

  const missingHighDemandSkills = t.suggestedSkills.filter(
    suggested => !skills.some(skill => 
      skill.toLowerCase().includes(suggested.toLowerCase()) ||
      suggested.toLowerCase().includes(skill.toLowerCase())
    )
  ).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-png-charcoal to-png-black border-2 border-png-orange/30 rounded-xl p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-syne font-bold text-xl text-white">{t.title}</h3>
          <p className="font-inter text-sm text-gray-400">{t.subtitle}</p>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-png-orange" />
          <h4 className="font-inter font-semibold text-white">{t.topSkills}</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {analyzedSkills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between bg-white/5 rounded-lg p-3"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-inter text-sm text-white">{skill.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-inter text-xs text-gray-400">{t.marketDemand}:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getDemandColor(skill.demand)}`}>
                  {getDemandLabel(skill.demand)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {missingHighDemandSkills.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-500" />
            <h4 className="font-inter font-semibold text-white">{t.suggestions}</h4>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="font-inter text-sm text-yellow-200 mb-3">{t.addSkills}</p>
            <div className="flex flex-wrap gap-2">
              {missingHighDemandSkills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/40 rounded-full px-3 py-1"
                >
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span className="font-inter text-xs text-yellow-200">{skill}</span>
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
