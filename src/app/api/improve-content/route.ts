import { sanitizeRichTextHtml } from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";
import { improveContentWithGemini } from "@/features/resume-editor/server/improve-content-with-gemini";
import {
  handleResumeImportError,
  parseJsonBody,
} from "@/features/resume-editor/server/http";

export const runtime = "nodejs";

const HTML_CHAR_LIMIT = 8_000;

export async function POST(request: Request) {
  const parsed = await parseJsonBody(request, "Invalid JSON body.");
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  if (!body || typeof body !== "object") {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const { html, chips, customInstruction } = body as Record<string, unknown>;

  if (typeof html !== "string" || !html.trim()) {
    return Response.json({ message: 'Missing "html" field.' }, { status: 400 });
  }

  if (html.length > HTML_CHAR_LIMIT) {
    return Response.json(
      {
        message: `Content exceeds the ${HTML_CHAR_LIMIT.toLocaleString()}-character limit.`,
      },
      { status: 400 },
    );
  }

  const normalizedChips = Array.isArray(chips)
    ? chips.filter((c): c is string => typeof c === "string")
    : [];

  const normalizedInstruction =
    typeof customInstruction === "string" ? customInstruction.trim() : "";

  try {
    const raw = await improveContentWithGemini({
      html: html.trim(),
      chips: normalizedChips,
      customInstruction: normalizedInstruction,
    });

    return Response.json(
      { improved: sanitizeRichTextHtml(raw) },
      { status: 200 },
    );
  } catch (error) {
    return handleResumeImportError(error, "Unable to improve the content.");
  }
}
