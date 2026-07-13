import { extractJobKeywordsWithGemini } from "@/features/resume-editor/server/extract-job-keywords-with-gemini";
import {
  handleResumeImportError,
  parseJsonBody,
} from "@/features/resume-editor/server/http";

export const runtime = "nodejs";

const MAX_JOB_DESCRIPTION_LENGTH = 12_000;

export async function POST(request: Request) {
  const parsed = await parseJsonBody<{ jobDescription?: unknown }>(
    request,
    "Invalid JSON payload.",
  );
  if (!parsed.ok) return parsed.response;
  const payload = parsed.data;

  const jobDescription =
    typeof payload.jobDescription === "string"
      ? payload.jobDescription.trim()
      : "";

  if (!jobDescription) {
    return Response.json(
      { message: 'Missing "jobDescription".' },
      { status: 400 },
    );
  }

  if (jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
    return Response.json(
      {
        message: `Job description is too long (max ${MAX_JOB_DESCRIPTION_LENGTH} characters).`,
      },
      { status: 413 },
    );
  }

  try {
    const keywords = await extractJobKeywordsWithGemini(jobDescription);
    return Response.json({ keywords }, { status: 200 });
  } catch (error) {
    return handleResumeImportError(
      error,
      "Could not analyze the job description.",
    );
  }
}
