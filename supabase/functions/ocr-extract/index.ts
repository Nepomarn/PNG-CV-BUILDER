const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || '';

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

async function extractTextWithGemini(base64Data: string, mimeType: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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

  const result = await response.json();
  
  if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
    return result.candidates[0].content.parts[0].text;
  }
  
  throw new Error('Failed to extract text from document');
}

async function generateCVWithGemini(extractedText: string, jobAdData: JobAdData | null): Promise<{ extractedData: ExtractedData; generatedContent: GeneratedContent }> {
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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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

  const result = await response.json();
  
  if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
    let jsonText = result.candidates[0].content.parts[0].text;
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      return JSON.parse(jsonText);
    } catch (e) {
      console.error('Failed to parse Gemini response:', jsonText);
      throw new Error('Failed to parse AI response');
    }
  }
  
  throw new Error('Failed to generate CV content');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
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
    
    for (const file of files) {
      fileInfos.push({
        name: file.name,
        type: file.type,
        size: file.size
      });
      console.log(`Processing file: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
        let mimeType = file.type;
        if (!mimeType || mimeType === 'application/octet-stream') {
          const ext = file.name.split('.').pop()?.toLowerCase();
          const mimeTypes: Record<string, string> = {
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          };
          mimeType = mimeTypes[ext || ''] || 'application/octet-stream';
        }
        
        const extractedText = await extractTextWithGemini(base64Data, mimeType);
        extractedTexts.push(`=== ${file.name} ===\n${extractedText}`);
        console.log(`Successfully extracted text from ${file.name}`);
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        extractedTexts.push(`=== ${file.name} ===\n[Could not extract text from this file]`);
      }
    }
    
    const combinedText = extractedTexts.join('\n\n');
    console.log('Generating CV and cover letter with Gemini AI...');
    
    const { extractedData, generatedContent } = await generateCVWithGemini(combinedText, jobAdData);

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
      JSON.stringify({ error: 'Failed to process files with AI', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
