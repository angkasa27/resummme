import { importedResumeSchema, type ImportedResume } from "@/features/resume-editor/server/imported-resume-schema";
import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";

const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
};

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

function extractResponseText(payload: GeminiResponse) {
  return payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();
}

function stripCodeFences(value: string) {
  return value.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
}

export async function mapResumeTextWithGemini(
  resumeText: string,
): Promise<ImportedResume> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new ResumeImportError("GEMINI_API_KEY is not configured.", 503);
  }

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: buildPrompt(resumeText) }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new ResumeImportError("Gemini could not parse the uploaded resume.", 502);
  }

  const payload = (await response.json()) as GeminiResponse;
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
