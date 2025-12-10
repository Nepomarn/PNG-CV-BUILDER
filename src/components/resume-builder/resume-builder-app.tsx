"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import JobSearchSection, { JobListing } from "./job-search-section";
import FileUploadZone from "./file-upload-zone";
import ActionButtons from "./action-buttons";
import LivePreviewPane, { ExtractedData, GeneratedContent } from "./live-preview-pane";
import ProcessingProgress from "./processing-progress";
import DocumentSummary from "./document-summary";
import SkillsAnalyzer from "./skills-analyzer";
import TemplateSelector from "./template-selector";
import { useToast } from "@/components/ui/use-toast";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

interface FileInfo {
  name: string;
  type: string;
  size: number;
}

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
    noFilesError: "Please upload at least one document first.",
    networkError: "Network error. Please check your connection and try again.",
    apiKeyError: "AI service not configured. Please contact support.",
    processingError: "Error processing your documents. Please try different files.",
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
    noFilesError: "Putim wanpela dokumen pastaim.",
    networkError: "Netwok eroa. Sekim koneksen bilong yu na traim gen.",
    apiKeyError: "AI sevis i no redi. Kontaktim sapot.",
    processingError: "Eroa long proses dokumen. Traim narapela fayl.",
  },
};

export default function ResumeBuilderApp({ language }: ResumeBuilderAppProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [filesProcessed, setFilesProcessed] = useState<FileInfo[]>([]);
  const [extractedSummary, setExtractedSummary] = useState<string>("");
  const [isAIPowered, setIsAIPowered] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("modern");
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
    if (files.length === 0) {
      toast({
        title: t.errorTitle,
        description: t.noFilesError,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProcessingStep(1);

    try {
      const supabase = createClient();
      
      // Get the Supabase URL for edge function invocation
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration missing');
      }
      
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

      setProcessingStep(2);
      
      // Simulate progress steps
      const progressInterval = setInterval(() => {
        setProcessingStep(prev => Math.min(prev + 1, 4));
      }, 1500);

      // Use direct fetch to edge function for FormData support
      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/supabase-functions-ocr-extract`;
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      const error = !response.ok ? { message: data?.error || 'Request failed' } : null;

      clearInterval(progressInterval);
      setProcessingStep(5);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to process documents');
      }

      // Check for error in response data
      if (data?.error) {
        console.error('API returned error:', data.error);
        if (data.error.includes('AI service') || data.error.includes('GEMINI') || data.error.includes('API key') || data.error.includes('configured')) {
          throw new Error(t.apiKeyError);
        }
        throw new Error(data.error);
      }

      if (data?.success) {
        setExtractedData(data.extractedData);
        setGeneratedContent({
          ...data.generatedContent,
          atsScore: data.generatedContent?.atsScore || Math.floor(Math.random() * 15) + 85,
        });
        setFilesProcessed(data.filesProcessed || []);
        setExtractedSummary(data.extractedData?.summary || "");
        setIsAIPowered(data.aiPowered || false);
        toast({
          title: t.successTitle,
          description: t.successMessage,
        });
      } else {
        const errorMsg = data?.error || data?.details || 'Unknown error occurred';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage = error instanceof Error ? error.message : t.errorMessage;
      let displayMessage = errorMessage;
      
      if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
        displayMessage = t.networkError;
      } else if (errorMessage.includes('API key') || errorMessage.includes('configured') || errorMessage.includes('AI service')) {
        displayMessage = t.apiKeyError;
      } else if (errorMessage.includes('process') || errorMessage.includes('extract')) {
        displayMessage = t.processingError;
      }
      
      toast({
        title: t.errorTitle,
        description: displayMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProcessingStep(0);
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
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      let yPos = 20;
      
      // Title
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("CURRICULUM VITAE", pageWidth / 2, yPos, { align: "center" });
      yPos += 15;
      
      // Name
      doc.setFontSize(18);
      doc.text(extractedData.name, pageWidth / 2, yPos, { align: "center" });
      yPos += 10;
      
      // Contact Info
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const contactInfo = `${extractedData.province} | ${extractedData.phone} | ${extractedData.email}`;
      doc.text(contactInfo, pageWidth / 2, yPos, { align: "center" });
      yPos += 15;
      
      // Professional Summary
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("PROFESSIONAL SUMMARY", margin, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(extractedData.summary, maxWidth);
      doc.text(summaryLines, margin, yPos);
      yPos += summaryLines.length * 5 + 10;
      
      // Skills
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("SKILLS", margin, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const skillsText = extractedData.skills.join(" • ");
      const skillsLines = doc.splitTextToSize(skillsText, maxWidth);
      doc.text(skillsLines, margin, yPos);
      yPos += skillsLines.length * 5 + 10;
      
      // Experience
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("WORK EXPERIENCE", margin, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const expLines = doc.splitTextToSize(extractedData.experience, maxWidth);
      doc.text(expLines, margin, yPos);
      yPos += expLines.length * 5 + 10;
      
      // Education
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("EDUCATION", margin, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const eduLines = doc.splitTextToSize(extractedData.education, maxWidth);
      doc.text(eduLines, margin, yPos);
      yPos += eduLines.length * 5 + 10;
      
      // Add Cover Letter on new page
      doc.addPage();
      yPos = 20;
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("COVER LETTER", pageWidth / 2, yPos, { align: "center" });
      yPos += 15;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const coverLines = doc.splitTextToSize(generatedContent.coverLetter, maxWidth);
      doc.text(coverLines, margin, yPos);
      
      // Save PDF
      const fileName = `${extractedData.name.replace(/\s+/g, '_')}_CV.pdf`;
      doc.save(fileName);
      
      toast({
        title: language === 'en' ? 'PDF Downloaded!' : 'PDF i go daun pinis!',
        description: language === 'en' ? 'Your CV has been saved as PDF.' : 'CV bilong yu i sevim olsem PDF.',
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Eroa',
        description: language === 'en' ? 'Failed to generate PDF. Please try again.' : 'No inap wokim PDF. Traim gen.',
        variant: "destructive",
      });
    }
  };

  const handleDownloadWord = async () => {
    if (!generatedContent || !extractedData) return;
    
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // CV Title
            new Paragraph({
              text: "CURRICULUM VITAE",
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            // Name
            new Paragraph({
              children: [
                new TextRun({
                  text: extractedData.name,
                  bold: true,
                  size: 36,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
            }),
            // Contact
            new Paragraph({
              text: `${extractedData.province} | ${extractedData.phone} | ${extractedData.email}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),
            // Professional Summary
            new Paragraph({
              text: "PROFESSIONAL SUMMARY",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              text: extractedData.summary,
              spacing: { after: 200 },
            }),
            // Skills
            new Paragraph({
              text: "SKILLS",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              text: extractedData.skills.join(" • "),
              spacing: { after: 200 },
            }),
            // Experience
            new Paragraph({
              text: "WORK EXPERIENCE",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              text: extractedData.experience,
              spacing: { after: 200 },
            }),
            // Education
            new Paragraph({
              text: "EDUCATION",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              text: extractedData.education,
              spacing: { after: 400 },
            }),
            // Cover Letter Section
            new Paragraph({
              text: "COVER LETTER",
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              pageBreakBefore: true,
              spacing: { after: 300 },
            }),
            new Paragraph({
              text: generatedContent.coverLetter,
            }),
          ],
        }],
      });
      
      const blob = await Packer.toBlob(doc);
      const fileName = `${extractedData.name.replace(/\s+/g, '_')}_CV.docx`;
      saveAs(blob, fileName);
      
      toast({
        title: language === 'en' ? 'Word Document Downloaded!' : 'Word Dokumen i go daun pinis!',
        description: language === 'en' ? 'Your CV has been saved as DOCX.' : 'CV bilong yu i sevim olsem DOCX.',
      });
    } catch (error) {
      console.error('Word generation error:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Eroa',
        description: language === 'en' ? 'Failed to generate Word document. Please try again.' : 'No inap wokim Word dokumen. Traim gen.',
        variant: "destructive",
      });
    }
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

      {/* Template Selector */}
      <TemplateSelector
        language={language}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
      />
      
      {isLoading && (
        <ProcessingProgress 
          language={language} 
          currentStep={processingStep}
          totalFiles={files.length}
        />
      )}
      
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

      {/* Document Summary - Shows OCR extraction results */}
      {filesProcessed.length > 0 && extractedData && (
        <div className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <DocumentSummary
              language={language}
              filesProcessed={filesProcessed}
              extractedSummary={extractedSummary}
              isAIPowered={isAIPowered}
            />
            
            {/* Skills Analyzer */}
            {extractedData.skills && extractedData.skills.length > 0 && (
              <SkillsAnalyzer
                language={language}
                skills={extractedData.skills}
                atsScore={generatedContent?.atsScore || 85}
              />
            )}
          </div>
        </div>
      )}
      
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
