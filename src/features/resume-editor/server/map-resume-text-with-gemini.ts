import { importedResumeSchema, type ImportedResume } from "@/features/resume-editor/server/imported-resume-schema";
import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";
import {
  callGeminiApi,
  extractResponseText,
  stripCodeFences,
} from "@/features/resume-editor/server/gemini-client";

function buildPrompt(resumeText: string) {
  return `
You convert plain-text resume content into structured JSON.

Return JSON only. Do not wrap it in markdown. Do not add commentary.

Rules:
- Use the exact top-level keys shown below.
- Use empty strings for unknown scalar values.
- Use empty arrays for unknown list values.
- Keep dates as strings. Prefer "MMM YYYY". Use "current" for ongoing roles. Leave blank if unclear.
- Do not invent content that is not supported by the resume text.
- Normalize links so they are absolute URLs when possible.
- Put summary content into the "summary" array as short paragraphs.
- Put role/project/school detail bullets into "highlights".

Expected JSON shape:
{
  "profile": {
    "fullName": "",
    "location": "",
    "phone": "",
    "email": "",
    "extraLinks": []
  },
  "summary": [],
  "workExperience": [
    {
      "companyName": "",
      "position": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "highlights": []
    }
  ],
  "skills": [
    {
      "categoryName": "",
      "skills": []
    }
  ],
  "projects": [
    {
      "projectName": "",
      "projectLink": "",
      "startDate": "",
      "endDate": "",
      "highlights": []
    }
  ],
  "education": [
    {
      "name": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "degree": "",
      "gpa": "",
      "highlights": []
    }
  ],
  "publications": [
    {
      "title": "",
      "publisher": "",
      "publicationUrl": "",
      "publicationDate": "",
      "highlights": []
    }
  ],
  "certifications": [
    {
      "certificationName": "",
      "issuingOrganization": "",
      "issuedDate": "",
      "certificationLink": "",
      "credentialId": ""
    }
  ],
  "awards": [
    {
      "title": "",
      "issuer": "",
      "issuedDate": "",
      "highlights": []
    }
  ],
  "languages": [
    {
      "language": "",
      "proficiency": ""
    }
  ],
  "references": [
    {
      "name": "",
      "background": "",
      "contactDetails": ""
    }
  ],
  "organizationVolunteering": [
    {
      "organizationName": "",
      "position": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "highlights": []
    }
  ]
}

Resume text:
"""
${resumeText}
"""
`.trim();
}

export async function mapResumeTextWithGemini(
  resumeText: string,
): Promise<ImportedResume> {
  const payload = await callGeminiApi(buildPrompt(resumeText), {
    responseMimeType: "application/json",
    temperature: 0.1,
  });

  const responseText = extractResponseText(payload);

  if (!responseText) {
    throw new ResumeImportError("Gemini returned an empty import response.", 502);
  }

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(stripCodeFences(responseText));
  } catch {
    throw new ResumeImportError("Gemini returned invalid import JSON.", 502);
  }

  try {
    return importedResumeSchema.parse(parsedJson);
  } catch {
    throw new ResumeImportError("Gemini returned an unexpected resume shape.", 502);
  }
}
