import { generateResumePdf } from "@/features/resume-editor/server/generate-resume-pdf";
import { parseResumeDraft } from "@/lib/resume/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        message: "Invalid request body.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const draft = parseResumeDraft((body as { draft?: unknown }).draft);
    const pdf = await generateResumePdf({
      draft,
      origin: new URL(request.url).origin,
    });

    return new Response(pdf, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return Response.json(
        {
          message: "Invalid resume draft payload.",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to generate PDF.",
      },
      {
        status: 500,
      }
    );
  }
}
