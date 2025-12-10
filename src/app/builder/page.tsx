"use client";

import { useState } from "react";
import BackgroundWrapper from "@/components/resume-builder/background-wrapper";
import AppHeader from "@/components/resume-builder/app-header";
import HeroSection from "@/components/resume-builder/hero-section";
import FeaturesBanner from "@/components/resume-builder/features-banner";
import ResumeBuilderApp from "@/components/resume-builder/resume-builder-app";
import CVTipsPanel from "@/components/resume-builder/cv-tips-panel";
import AppFooter from "@/components/resume-builder/app-footer";
import { Toaster } from "@/components/ui/toaster";

export default function BuilderPage() {
  const [language, setLanguage] = useState<"en" | "tp">("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "tp" : "en"));
  };

  return (
    <BackgroundWrapper>
      <AppHeader language={language} onLanguageToggle={toggleLanguage} />
      
      <main className="pt-20">
        <HeroSection language={language} onLanguageToggle={toggleLanguage} />
        <FeaturesBanner language={language} />
        <ResumeBuilderApp language={language} />
        <CVTipsPanel language={language} />
        <AppFooter language={language} />
      </main>
      
      <Toaster />
    </BackgroundWrapper>
  );
}
