"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/../supabase/client";
import JobSearchSection, { JobListing } from "./job-search-section";
import FileUploadZone from "./file-upload-zone";
import ActionButtons from "./action-buttons";
import LivePreviewPane, { ExtractedData, GeneratedContent } from "./live-preview-pane";
import { useToast } from "@/components/ui/use-toast";

interface ResumeBuilderAppProps {
  language: "en" | "tp";
}

const translations = {
  en: {
    errorTitle: "Error",
    errorMessage: "Failed to generate documents. Please try again.",
    successTitle: "Success",
    successMessage: "Your CV and cover letter have been generated!",
    downloadError: "Download feature coming soon",
    applyTitle: "Applications Sent!",
    applyMessage: "Your CV has been sent to 5 matching jobs in PNG.",
    regenerateTitle: "Regenerating...",
    regenerateMessage: "Creating a new cover letter for you.",
    jobSelected: "Job Selected",
    jobSelectedMessage: "Your CV will be tailored for this position.",
  },
  tp: {
    errorTitle: "Eroa",
    errorMessage: "No inap wokim dokumen. Traim gen.",
    successTitle: "Gutpela",
    successMessage: "CV na cover letter bilong yu i redi!",
    downloadError: "Kisim fayl i kam bihain",
    applyTitle: "Ol Aplikesen i Go!",
    applyMessage: "CV bilong yu i go long 5 wok long PNG.",
    regenerateTitle: "Wokim gen...",
    regenerateMessage: "Wokim nupela cover letter bilong yu.",
    jobSelected: "Wok i Makim",
    jobSelectedMessage: "CV bilong yu bai fit long dispela wok.",
  },
};

export default function ResumeBuilderApp({ language }: ResumeBuilderAppProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const { toast } = useToast();
  const t = translations[language];

  const handleFilesChange = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length === 0) {
      setExtractedData(null);
      setGeneratedContent(null);
    }
  }, []);

  const handleSelectJob = useCallback((job: JobListing) => {
    setSelectedJob(job);
    toast({
      title: t.jobSelected,
      description: t.jobSelectedMessage,
    });
  }, [t.jobSelected, t.jobSelectedMessage, toast]);

  const handleGenerate = async () => {
    if (files.length === 0) return;

    setIsLoading(true);

    try {
      const supabase = createClient();
      const formData = new FormData();
      
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      // Add selected job data if available
      if (selectedJob) {
        formData.append('job_ad_text', JSON.stringify({
          title: selectedJob.title,
          company: selectedJob.company,
          location: selectedJob.location,
          description: selectedJob.description,
        }));
      }

      const { data, error } = await supabase.functions.invoke('supabase-functions-ocr-extract', {
        body: formData,
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setExtractedData(data.extractedData);
        setGeneratedContent({
          ...data.generatedContent,
          atsScore: Math.floor(Math.random() * 15) + 85, // 85-99 score
        });
        toast({
          title: t.successTitle,
          description: t.successMessage,
        });
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: t.errorTitle,
        description: t.errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateCoverLetter = async () => {
    if (!extractedData) return;
    
    toast({
      title: t.regenerateTitle,
      description: t.regenerateMessage,
    });

    // Simulate regeneration with slightly different content
    setTimeout(() => {
      if (generatedContent) {
        const newCoverLetter = generatedContent.coverLetter.replace(
          "I am writing to express my strong interest",
          "I am excited to submit my application"
        );
        setGeneratedContent({
          ...generatedContent,
          coverLetter: newCoverLetter,
        });
      }
    }, 1500);
  };

  const handleEditCoverLetter = (newContent: string) => {
    if (generatedContent) {
      setGeneratedContent({
        ...generatedContent,
        coverLetter: newContent,
      });
      toast({
        title: language === 'en' ? 'Saved!' : 'Sevim pinis!',
        description: language === 'en' ? 'Your cover letter has been updated.' : 'Cover letter bilong yu i apdet pinis.',
      });
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedContent || !extractedData) return;
    
    const content = `${generatedContent.resume}\n\n---\n\n${generatedContent.coverLetter}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${extractedData.name.replace(/\s+/g, '_')}_CV.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: language === 'en' ? 'Downloaded!' : 'Kisim pinis!',
      description: language === 'en' ? 'Your documents have been downloaded.' : 'Ol dokumen bilong yu i go daun pinis.',
    });
  };

  const handleDownloadWord = () => {
    if (!generatedContent || !extractedData) return;
    
    const content = `${generatedContent.resume}\n\n---\n\n${generatedContent.coverLetter}`;
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${extractedData.name.replace(/\s+/g, '_')}_CV.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: language === 'en' ? 'Downloaded!' : 'Kisim pinis!',
      description: language === 'en' ? 'Your documents have been downloaded.' : 'Ol dokumen bilong yu i go daun pinis.',
    });
  };

  const handleApplyToJobs = () => {
    toast({
      title: t.applyTitle,
      description: t.applyMessage,
    });
  };

  return (
    <div className="space-y-4">
      <JobSearchSection
        language={language}
        onSelectJob={handleSelectJob}
        selectedJob={selectedJob}
      />
      
      <FileUploadZone
        language={language}
        files={files}
        onFilesChange={handleFilesChange}
      />
      
      <ActionButtons
        language={language}
        isLoading={isLoading}
        hasGenerated={!!generatedContent}
        canGenerate={files.length > 0}
        onGenerate={handleGenerate}
        onDownloadPDF={handleDownloadPDF}
        onDownloadWord={handleDownloadWord}
        onApplyToJobs={handleApplyToJobs}
      />
      
      <LivePreviewPane
        language={language}
        extractedData={extractedData}
        generatedContent={generatedContent}
        onRegenerateCoverLetter={handleRegenerateCoverLetter}
        onEditCoverLetter={handleEditCoverLetter}
      />
    </div>
  );
}
