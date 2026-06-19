import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";
import {
  callGeminiApi,
  extractResponseText,
} from "@/features/resume-editor/server/gemini-client";

export type ImproveContentInput = {
  html: string;
  chips: string[];
  customInstruction: string;
};

// Server-controlled mapping from chip label → instruction text.
// Keeps the Gemini prompt authoritative and prevents clients from
// injecting arbitrary instructions through chip values.
const CHIP_INSTRUCTIONS: Record<string, string> = {
  "Add a metric":
    "Add a specific number, percentage, or scale to quantify the impact (e.g. '30%', '1M users', 'team of 8'). If no reasonable metric can be inferred, leave a placeholder like '[X%]'.",
  "Stronger verb":
    "Replace the opening verb of each bullet with a stronger, more impactful action verb (e.g. 'Led', 'Built', 'Drove', 'Shipped').",
  "More concise":
    "Trim filler words and unnecessary phrases. Aim for under 20 words per bullet.",
  "Sound more senior":
    "Elevate the language to convey ownership, leadership, and strategic impact.",
  "Fix grammar":
    "Correct grammar and punctuation only — keep the original meaning and language intact.",
};

function buildPrompt(input: ImproveContentInput): string {
  const instructions: string[] = [];

  for (const chip of input.chips) {
    const instruction = CHIP_INSTRUCTIONS[chip];
    if (instruction) {
      instructions.push(instruction);
    }
  }

  if (input.customInstruction.trim()) {
    instructions.push(input.customInstruction.trim());
  }

  const instructionList =
    instructions.length > 0
      ? instructions.map((inst, i) => `${i + 1}. ${inst}`).join("\n")
      : "1. Improve the overall quality, clarity, and impact of the content.";

  return `You improve resume bullet points and descriptions for a resume editor.

CRITICAL — Language preservation: Detect the language of the content provided below. Write your entire response in the SAME language as the input. For example, if the content is written in Bahasa Indonesia, respond in Bahasa Indonesia. If the user's additional instruction explicitly requests a specific target language, use that language instead.

Rules:
- Keep the same HTML structure. Use ONLY these tags: <p> <ul> <ol> <li> <strong> <em> <u> <a> <br>
- Apply every improvement listed below.
- Return ONLY the improved HTML — no commentary, no markdown fences, no explanation.
- Do not invent facts, companies, job titles, metrics, or details not implied by the original content.

Content to improve:
"""
${input.html}
"""

Improvements to apply:
${instructionList}`.trim();
}

export async function improveContentWithGemini(
  input: ImproveContentInput,
): Promise<string> {
  const payload = await callGeminiApi(buildPrompt(input), {
    responseMimeType: "text/plain",
    temperature: 0.4,
  });

  const responseText = extractResponseText(payload);

  if (!responseText) {
    throw new ResumeImportError("Gemini returned an empty response.", 502);
  }

  // Strip markdown code fences in case the model wraps HTML anyway.
  return responseText
    .replace(/^```(?:html)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}
