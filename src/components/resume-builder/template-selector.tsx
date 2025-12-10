"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Layout, CheckCircle, Briefcase, GraduationCap, Sparkles } from "lucide-react";

interface TemplateSelectorProps {
  language: "en" | "tp";
  selectedTemplate: string;
  onSelectTemplate: (template: string) => void;
}

const translations = {
  en: {
    title: "Choose Your CV Template",
    subtitle: "Select a style that matches your profession",
    professional: "Professional",
    professionalDesc: "Clean and corporate style",
    modern: "Modern",
    modernDesc: "Contemporary design",
    creative: "Creative",
    creativeDesc: "Stand out from the crowd",
    academic: "Academic",
    academicDesc: "For education sector",
    selected: "Selected",
  },
  tp: {
    title: "Makim CV Templet Bilong Yu",
    subtitle: "Makim stail i fit long wok bilong yu",
    professional: "Profesnol",
    professionalDesc: "Klin na ofis stail",
    modern: "Moden",
    modernDesc: "Nupela disain",
    creative: "Krietiv",
    creativeDesc: "Sanap narapela",
    academic: "Akademik",
    academicDesc: "Bilong skul sektor",
    selected: "Makim pinis",
  },
};

const templates = [
  {
    id: "professional",
    icon: Briefcase,
    color: "from-blue-500 to-blue-700",
    borderColor: "border-blue-500",
  },
  {
    id: "modern",
    icon: Sparkles,
    color: "from-png-orange to-png-red",
    borderColor: "border-png-orange",
  },
  {
    id: "creative",
    icon: Layout,
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500",
  },
  {
    id: "academic",
    icon: GraduationCap,
    color: "from-green-500 to-emerald-600",
    borderColor: "border-green-500",
  },
];

export default function TemplateSelector({
  language,
  selectedTemplate,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const t = translations[language];

  const getTemplateName = (id: string) => {
    switch (id) {
      case "professional": return t.professional;
      case "modern": return t.modern;
      case "creative": return t.creative;
      case "academic": return t.academic;
      default: return id;
    }
  };

  const getTemplateDesc = (id: string) => {
    switch (id) {
      case "professional": return t.professionalDesc;
      case "modern": return t.modernDesc;
      case "creative": return t.creativeDesc;
      case "academic": return t.academicDesc;
      default: return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 md:px-12 py-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="font-syne font-bold text-2xl text-white mb-2">{t.title}</h3>
          <p className="font-inter text-gray-400">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template, index) => {
            const Icon = template.icon;
            const isSelected = selectedTemplate === template.id;

            return (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectTemplate(template.id)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `${template.borderColor} bg-white/10`
                    : "border-white/20 bg-white/5 hover:border-white/40"
                }`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h4 className="font-syne font-bold text-white text-sm mb-1">
                  {getTemplateName(template.id)}
                </h4>
                <p className="font-inter text-xs text-gray-400">
                  {getTemplateDesc(template.id)}
                </p>

                {isSelected && (
                  <span className="mt-2 inline-block text-xs text-green-400 font-medium">
                    {t.selected}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
