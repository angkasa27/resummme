import { createRequire } from "node:module";

import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";

const require = createRequire(import.meta.url);
const parsePdf = require("pdf-parse-v1/lib/pdf-parse.js") as (
  pdfBuffer: Uint8Array,
) => Promise<{ text?: string }>;

export async function extractPdfText(pdfBytes: Uint8Array) {
  try {
    const result = await parsePdf(pdfBytes);
    const text = (result.text ?? "").replace(/\u0000/g, "").trim();

    if (!text) {
      throw new ResumeImportError(
        "No extractable text found in this PDF. Scanned resumes are not supported yet.",
        422,
      );
    }

    return text;
  } catch (error) {
    if (error instanceof ResumeImportError) {
      throw error;
    }

    throw new ResumeImportError(
      "Unable to read text from the uploaded PDF.",
      422,
    );
  }
}
