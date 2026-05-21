import { generateResumePdf } from "@/features/resume-editor/server/generate-resume-pdf";
import { createResumePdfFilename } from "@/features/resume-editor/domain/draft/resume-pdf-filename";
import { parseResumeDraft } from "@/features/resume-editor/domain/schema";

export const runtime = "nodejs";
export const maxDuration = 60;

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
  const originHeader = request.headers.get("origin");
  const trustedOrigins = (
    process.env.PDF_EXPORT_TRUSTED_ORIGINS ?? ""
  )
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  const isSameOrigin = originHeader === null || originHeader === requestOrigin;
  const isTrustedOrigin =
    originHeader !== null && trustedOrigins.includes(originHeader);

  if (process.env.NODE_ENV !== "development" && !isSameOrigin && !isTrustedOrigin) {
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
    const filename = createResumePdfFilename(draft);

    return new Response(Buffer.from(pdf), {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${filename}"`,
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
