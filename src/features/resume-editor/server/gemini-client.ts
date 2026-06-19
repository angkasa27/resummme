import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";

const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";

export type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
};

export function extractResponseText(payload: GeminiResponse): string | undefined {
  return payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();
}

export function stripCodeFences(value: string): string {
  return value
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

export async function callGeminiApi(
  prompt: string,
  generationConfig?: Record<string, unknown>,
): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new ResumeImportError("GEMINI_API_KEY is not configured.", 503);
  }

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: prompt }] },
        ],
        ...(generationConfig ? { generationConfig } : {}),
      }),
    },
  );

  if (!response.ok) {
    throw new ResumeImportError("Gemini API request failed.", 502);
  }

  return (await response.json()) as GeminiResponse;
}
