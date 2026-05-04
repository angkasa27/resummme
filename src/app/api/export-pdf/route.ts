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

  const requestOrigin = new URL(request.url).origin;
  const trustedOrigins = (
    process.env.PDF_EXPORT_TRUSTED_ORIGINS ?? ""
  )
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const isLocalhost = requestOrigin === "http://localhost:3000";
  const isVercel =
    process.env.VERCEL_URL
      ? requestOrigin === `https://${process.env.VERCEL_URL}`
      : false;
  const isTrusted = trustedOrigins.includes(requestOrigin);

  const isAllowed =
    process.env.NODE_ENV === "development"
      ? true
      : isLocalhost || isVercel || isTrusted;

  if (!isAllowed) {
    return Response.json(
      {
        message: "Invalid origin.",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const draft = parseResumeDraft((body as { draft?: unknown }).draft);
    const pdf = await generateResumePdf({
      draft,
      origin: requestOrigin,
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
