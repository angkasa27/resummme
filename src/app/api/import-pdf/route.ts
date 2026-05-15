import { buildImportedResumeDraft } from "@/features/resume-editor/server/build-imported-resume-draft";
import { extractPdfText } from "@/features/resume-editor/server/extract-pdf-text";
import { mapResumeTextWithGemini } from "@/features/resume-editor/server/map-resume-text-with-gemini";
import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";

export const runtime = "nodejs";

function isUploadedFile(value: FormDataEntryValue | null) {
  return (
    value !== null &&
    typeof value !== "string" &&
    typeof value === "object" &&
    "arrayBuffer" in value &&
    typeof value.arrayBuffer === "function"
  );
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      {
        message: "Invalid upload payload.",
      },
      {
        status: 400,
      },
    );
  }

  const file = formData.get("file");

  if (!isUploadedFile(file)) {
    return Response.json(
      {
        message: 'Missing "file" upload.',
      },
      {
        status: 400,
      },
    );
  }

  const uploadedFile = file as Blob & { name?: string; type?: string };

  const isPdf =
    uploadedFile.type === "application/pdf" ||
    uploadedFile.name?.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    return Response.json(
      {
        message: "Only PDF files are supported.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const pdfBytes = new Uint8Array(await uploadedFile.arrayBuffer());
    const extractedText = await extractPdfText(pdfBytes);
    const importedResume = await mapResumeTextWithGemini(extractedText);
    const result = buildImportedResumeDraft(importedResume);

    return Response.json(result, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof ResumeImportError) {
      return Response.json(
        {
          message: error.message,
        },
        {
          status: error.status,
        },
      );
    }

    return Response.json(
      {
        message: "Unable to import the uploaded PDF.",
      },
      {
        status: 500,
      },
    );
  }
}
