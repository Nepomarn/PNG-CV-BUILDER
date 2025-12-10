const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobAdData {
  title: string;
  company: string;
  location: string;
  description: string;
}

interface ExtractedData {
  name: string;
  province: string;
  phone: string;
  email: string;
  education: string;
  experience: string;
  skills: string[];
  summary: string;
  communityLeadership: string;
  referees: { name: string; title: string; phone: string }[];
}

interface GeneratedContent {
  resume: string;
  coverLetter: string;
  atsScore: number;
}

async function extractTextWithGemini(base64Data: string, mimeType: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `Extract ALL text from this document. If it's a CV/resume, extract all personal information, education, work experience, skills, and references. If it's a certificate, extract the name, institution, date, and qualification. If it's a job advertisement, extract the job title, company, location, requirements, and description. Return the extracted text in a structured format.`
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 4096,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.error) {
      console.error('Gemini returned error:', result.error);
      throw new Error(result.error.message || 'Gemini API error');
    }
    
    if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
      return result.candidates[0].content.parts[0].text;
    }
    
    console.error('Unexpected Gemini response:', JSON.stringify(result).substring(0, 500));
    throw new Error('Failed to extract text from document');
  } catch (error) {
    console.error('extractTextWithGemini error:', error);
    throw error;
  }
}

async function generateCVWithGemini(extractedText: string, jobAdData: JobAdData | null, apiKey: string): Promise<{ extractedData: ExtractedData; generatedContent: GeneratedContent }> {
  const jobContext = jobAdData 
    ? `The user is applying for: ${jobAdData.title} at ${jobAdData.company} in ${jobAdData.location}. Job description: ${jobAdData.description}`
    : 'No specific job selected - create a general professional CV and cover letter.';

  const prompt = `You are an expert CV writer specializing in Papua New Guinea job market. Based on the following extracted document text, create a professional CV and cover letter.

EXTRACTED DOCUMENT TEXT:
${extractedText}

JOB CONTEXT:
${jobContext}

IMPORTANT INSTRUCTIONS:
1. Extract real information from the documents where available
2. For any missing information, create realistic placeholder data appropriate for PNG
3. Emphasize community involvement and leadership (important in PNG culture)
4. Include both English proficiency and Tok Pisin if mentioned
5. Format for ATS (Applicant Tracking Systems)

Return a JSON object with this EXACT structure (no markdown, just pure JSON):
{
  "extractedData": {
    "name": "Full Name from document or 'Papua New Guinea Applicant'",
    "province": "Province from document or 'National Capital District'",
    "phone": "Phone from document or '+675 7XXX XXXX'",
    "email": "Email from document or 'applicant@email.com'",
    "education": "Education details, each on new line",
    "experience": "Work experience with bullet points",
    "skills": ["Array", "of", "skills"],
    "summary": "Professional summary paragraph",
    "communityLeadership": "Community and volunteer work",
    "referees": [
      {"name": "Referee Name", "title": "Title, Company", "phone": "+675 XXXX XXXX"}
    ]
  },
  "generatedContent": {
    "resume": "Full formatted resume text",
    "coverLetter": "Full cover letter text",
    "atsScore": 85
  }
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini CV generation error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.error) {
      console.error('Gemini returned error:', result.error);
      throw new Error(result.error.message || 'Gemini API error');
    }
    
    if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
      let jsonText = result.candidates[0].content.parts[0].text;
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      try {
        return JSON.parse(jsonText);
      } catch (e) {
        console.error('Failed to parse Gemini response:', jsonText.substring(0, 500));
        throw new Error('Failed to parse AI response - invalid JSON');
      }
    }
    
    console.error('Unexpected Gemini response:', JSON.stringify(result).substring(0, 500));
    throw new Error('Failed to generate CV content');
  } catch (error) {
    console.error('generateCVWithGemini error:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  // Get API key inside the handler to ensure it's fresh
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

  try {
    // Check for API key first
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'AI service not configured. Please set GEMINI_API_KEY in project settings.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    let files: File[] = [];
    let jobAdData: JobAdData | null = null;
    
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      
      for (const [key, value] of formData.entries()) {
        if (value instanceof File && value.size > 0) {
          files.push(value);
        } else if (key === 'job_ad_text' && typeof value === 'string') {
          try {
            jobAdData = JSON.parse(value);
          } catch (e) {
            console.log('Could not parse job ad data');
          }
        }
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid content type. Expected multipart/form-data' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (files.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid files provided. Please upload PDF, DOCX, JPG, or PNG files.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Processing ${files.length} files with Gemini AI...`);
    
    const fileInfos: { name: string; type: string; size: number }[] = [];
    const extractedTexts: string[] = [];
    
    // Helper function to convert ArrayBuffer to base64 (handles large files)
    function arrayBufferToBase64(buffer: ArrayBuffer): string {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      const chunkSize = 8192;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
        binary += String.fromCharCode.apply(null, Array.from(chunk));
      }
      return btoa(binary);
    }

    for (const file of files) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        console.error(`File ${file.name} is too large (${file.size} bytes)`);
        extractedTexts.push(`=== ${file.name} ===\n[File too large - max 10MB allowed]`);
        continue;
      }

      fileInfos.push({
        name: file.name,
        type: file.type,
        size: file.size
      });
      console.log(`Processing file: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = arrayBufferToBase64(arrayBuffer);
        
        let mimeType = file.type;
        if (!mimeType || mimeType === 'application/octet-stream') {
          const ext = file.name.split('.').pop()?.toLowerCase();
          const mimeTypes: Record<string, string> = {
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'txt': 'text/plain'
          };
          mimeType = mimeTypes[ext || ''] || 'application/octet-stream';
        }

        // Validate supported mime types for Gemini
        const supportedTypes = [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'text/plain'
        ];
        
        if (!supportedTypes.includes(mimeType)) {
          console.log(`Unsupported file type ${mimeType}, treating as text`);
          // For unsupported types like DOCX, try to read as text
          const textDecoder = new TextDecoder('utf-8', { fatal: false });
          const text = textDecoder.decode(arrayBuffer);
          if (text && text.length > 100) {
            extractedTexts.push(`=== ${file.name} ===\n${text.substring(0, 10000)}`);
            console.log(`Extracted text content from ${file.name}`);
            continue;
          }
          mimeType = 'application/pdf'; // Fallback to PDF for Gemini
        }
        
        const extractedText = await extractTextWithGemini(base64Data, mimeType, GEMINI_API_KEY);
        extractedTexts.push(`=== ${file.name} ===\n${extractedText}`);
        console.log(`Successfully extracted text from ${file.name}`);
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        extractedTexts.push(`=== ${file.name} ===\n[Could not extract text from this file: ${error.message}]`);
      }
    }
    
    if (extractedTexts.length === 0 || extractedTexts.every(t => t.includes('[Could not extract') || t.includes('[File too large'))) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Could not extract text from any of the uploaded files. Please try different files (PDF, JPG, PNG recommended).' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const combinedText = extractedTexts.join('\n\n');
    console.log('Generating CV and cover letter with Gemini AI...');
    
    const { extractedData, generatedContent } = await generateCVWithGemini(combinedText, jobAdData, GEMINI_API_KEY);

    return new Response(
      JSON.stringify({
        success: true,
        extractedData,
        generatedContent,
        jobAdData,
        filesProcessed: fileInfos,
        aiPowered: true,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error processing files:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process files with AI', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
