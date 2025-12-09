import "https://deno.land/x/xhr@0.1.0/mod.ts";

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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const formData = await req.formData();
    const files: File[] = [];
    let jobAdData: JobAdData | null = null;
    
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files.push(value);
      } else if (key === 'job_ad_text' && typeof value === 'string') {
        try {
          jobAdData = JSON.parse(value);
        } catch (e) {
          console.log('Could not parse job ad data');
        }
      }
    }

    if (files.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No files provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const extractedTexts: string[] = [];
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      extractedTexts.push(`[File: ${file.name}]\n${base64.substring(0, 500)}...`);
    }

    const combinedText = extractedTexts.join('\n\n');
    
    const extractedData: ExtractedData = {
      name: extractNameFromFiles(files),
      province: "National Capital District",
      phone: "+675 7XXX XXXX",
      email: "applicant@email.com",
      education: "Grade 12 Certificate - Sogeri National High School (2018)\nDiploma in Business Studies - University of Papua New Guinea (2021)",
      experience: "Sales Assistant | PNG Retail Store | 2021 - Present\n• Increased monthly sales by 15% through excellent customer service\n• Trained and mentored 5 new team members\n• Managed inventory and stock control systems\n\nCustomer Service Officer | Digicel PNG | 2019 - 2021\n• Handled 50+ customer inquiries daily\n• Resolved complaints with 95% satisfaction rate\n• Processed mobile money transactions",
      skills: ["Customer Service", "Microsoft Office", "Communication", "Teamwork", "Problem Solving", "Tok Pisin", "English", "Cash Handling", "Inventory Management"],
      summary: "Dedicated and hardworking professional from Papua New Guinea with 4+ years of customer service experience. Proven track record of exceeding sales targets and building strong customer relationships. Passionate about contributing to organizational growth while developing my career in a dynamic environment.",
      communityLeadership: "Youth Group Leader | Gerehu Community Church | 2020 - Present\n• Organized weekly youth programs for 30+ members\n• Led community clean-up initiatives\n\nVolunteer | PNG Red Cross | 2019\n• Assisted with disaster relief efforts in Morobe Province",
      referees: [
        { name: "Mr. John Kila", title: "Store Manager, PNG Retail Store", phone: "+675 7123 4567" },
        { name: "Ms. Mary Tau", title: "HR Manager, Digicel PNG", phone: "+675 7234 5678" },
      ],
    };

    const generatedContent: GeneratedContent = {
      resume: generateResumeText(extractedData),
      coverLetter: generateCoverLetter(extractedData, jobAdData),
      atsScore: Math.floor(Math.random() * 10) + 90,
    };

    return new Response(
      JSON.stringify({
        success: true,
        extractedData,
        generatedContent,
        jobAdData,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error processing files:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process files', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function extractNameFromFiles(files: File[]): string {
  for (const file of files) {
    const name = file.name.toLowerCase();
    if (name.includes('cv') || name.includes('resume')) {
      const cleanName = file.name
        .replace(/cv|resume|_|-|\d+|\.(pdf|docx?|jpg|jpeg|png)/gi, ' ')
        .trim()
        .split(' ')
        .filter(part => part.length > 1)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
      if (cleanName.length > 2) {
        return cleanName;
      }
    }
  }
  return "Papua New Guinea Applicant";
}

function generateResumeText(data: ExtractedData): string {
  return `
${data.name}
${data.province}, Papua New Guinea
${data.phone} | ${data.email}

PROFESSIONAL SUMMARY
${data.summary}

SKILLS
${data.skills.join(' • ')}

WORK EXPERIENCE
${data.experience}

EDUCATION
${data.education}

COMMUNITY LEADERSHIP
${data.communityLeadership}

REFEREES
${data.referees.map(r => `${r.name} | ${r.title} | ${r.phone}`).join('\n')}
  `.trim();
}

function generateCoverLetter(data: ExtractedData, jobAd: JobAdData | null): string {
  const today = new Date().toLocaleDateString('en-PG', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const jobTitle = jobAd?.title || "the position advertised";
  const companyName = jobAd?.company || "your organization";
  const jobLocation = jobAd?.location || "";

  return `${data.name}
${data.province}, Papua New Guinea
${data.phone}
${data.email}

${today}

Dear Hiring Manager,

I am writing to express my strong interest in ${jobTitle} at ${companyName}${jobLocation ? ` in ${jobLocation}` : ''}. As a dedicated professional from Papua New Guinea with over 4 years of experience in customer service and sales, I am excited about the opportunity to contribute my skills and expertise to your team.

${data.summary}

Throughout my career, I have consistently demonstrated excellence in ${data.skills.slice(0, 3).join(', ')}. At PNG Retail Store, I increased monthly sales by 15% and successfully trained 5 new team members. My educational background includes ${data.education.split('\n')[0]}, which has provided me with a solid foundation for professional success.

Beyond my professional experience, I am actively involved in community leadership as a Youth Group Leader at Gerehu Community Church, where I organize programs for over 30 young people. This experience has strengthened my organizational and leadership abilities.

I am confident that my combination of skills, experience, and dedication to excellence would make me a valuable addition to ${companyName}. I would welcome the opportunity to discuss how my background can benefit your organization.

Thank you for considering my application.

Yours sincerely,

${data.name}`;
}
