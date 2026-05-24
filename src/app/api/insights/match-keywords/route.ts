import { extractJobKeywordsWithGemini } from "@/features/resume-editor/server/extract-job-keywords-with-gemini";
import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";

export const runtime = "nodejs";

const MAX_JOB_DESCRIPTION_LENGTH = 12_000;

export async function POST(request: Request) {
  let payload: { jobDescription?: unknown };

  try {
    payload = (await request.json()) as { jobDescription?: unknown };
  } catch {
    return Response.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

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
    if (error instanceof ResumeImportError) {
      return Response.json(
        { message: error.message },
        { status: error.status },
      );
    }
    return Response.json(
      { message: "Could not analyze the job description." },
      { status: 500 },
    );
  }
}
