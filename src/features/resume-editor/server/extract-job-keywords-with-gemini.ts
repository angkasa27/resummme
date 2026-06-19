import { z } from "zod";

import {
  KEYWORD_CATEGORIES,
  type ExtractedKeyword,
} from "@/features/resume-editor/domain/insights/match-keywords";
import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";
import {
  callGeminiApi,
  extractResponseText,
  stripCodeFences,
} from "@/features/resume-editor/server/gemini-client";

const extractedKeywordSchema = z.object({
  term: z.string().min(1),
  category: z.enum(KEYWORD_CATEGORIES),
  weight: z.number().min(0).max(1),
});

const responseSchema = z.object({
  keywords: z.array(extractedKeywordSchema).max(60),
});

function buildPrompt(jobDescription: string) {
  return `
You extract ATS keywords from a job description.

Return JSON only. Do not wrap it in markdown. Do not add commentary.

Rules:
- Output at most 40 keywords. Prioritise terms that an ATS would actually try to match.
- "term" should be a short noun phrase (1-4 words), in title or natural case. No bullet symbols.
- "category" must be one of: "hard-skill", "soft-skill", "title", "qualification", "tool".
- "weight" is a number 0-1 reflecting how central the term is to the role. Use 1.0 for required must-haves, 0.5-0.7 for important but not critical, lower for nice-to-haves.
- De-duplicate near-synonyms; pick the most common form.
- Do not invent terms that are not implied by the JD.

JSON shape:
{
  "keywords": [
    { "term": "TypeScript", "category": "hard-skill", "weight": 1.0 }
  ]
}

Job description:
"""
${jobDescription}
"""
`.trim();
}

export async function extractJobKeywordsWithGemini(
  jobDescription: string,
): Promise<ExtractedKeyword[]> {
  const trimmed = jobDescription.trim();
  if (!trimmed) {
    throw new ResumeImportError("Job description is empty.", 400);
  }

  const payload = await callGeminiApi(buildPrompt(trimmed), {
    responseMimeType: "application/json",
    temperature: 0.1,
  });

  const responseText = extractResponseText(payload);

  if (!responseText) {
    throw new ResumeImportError("Gemini returned an empty keyword response.", 502);
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(stripCodeFences(responseText));
  } catch {
    throw new ResumeImportError("Gemini returned invalid keyword JSON.", 502);
  }

  const result = responseSchema.safeParse(parsedJson);
  if (!result.success) {
    throw new ResumeImportError(
      "Gemini returned an unexpected keyword shape.",
      502,
    );
  }

  return result.data.keywords;
}
