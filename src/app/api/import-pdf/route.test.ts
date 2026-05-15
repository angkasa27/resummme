import { beforeEach, describe, expect, it, vi } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { ResumeImportError } from "@/features/resume-editor/server/resume-import-error";

const { extractPdfText, mapResumeTextWithGemini, buildImportedResumeDraft } = vi.hoisted(() => ({
  extractPdfText: vi.fn(),
  mapResumeTextWithGemini: vi.fn(),
  buildImportedResumeDraft: vi.fn(),
}));

vi.mock("@/features/resume-editor/server/extract-pdf-text", () => ({
  extractPdfText,
}));

vi.mock("@/features/resume-editor/server/map-resume-text-with-gemini", () => ({
  mapResumeTextWithGemini,
}));

vi.mock("@/features/resume-editor/server/build-imported-resume-draft", () => ({
  buildImportedResumeDraft,
}));

import { POST } from "@/app/api/import-pdf/route";

describe("POST /api/import-pdf", () => {
  beforeEach(() => {
    extractPdfText.mockReset();
    mapResumeTextWithGemini.mockReset();
    buildImportedResumeDraft.mockReset();
  });

  it("returns a draft payload for a valid PDF upload", async () => {
    const draft = createDefaultResumeDraft();
    extractPdfText.mockResolvedValue("resume text");
    mapResumeTextWithGemini.mockResolvedValue({
      profile: { fullName: "Jane Doe", location: "", phone: "", email: "", extraLinks: [] },
      summary: [],
      workExperience: [],
      skills: [],
      projects: [],
      education: [],
      publications: [],
      certifications: [],
      awards: [],
      languages: [],
      references: [],
      organizationVolunteering: [],
    });
    buildImportedResumeDraft.mockReturnValue({ draft, warnings: ["date omitted"] });

    const formData = new FormData();
    formData.append(
      "file",
      new File([new Uint8Array([1, 2, 3])], "resume.pdf", {
        type: "application/pdf",
      }),
    );

    const response = await POST(
      new Request("http://localhost:3000/api/import-pdf", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(200);
    expect(extractPdfText).toHaveBeenCalledTimes(1);
    expect(mapResumeTextWithGemini).toHaveBeenCalledWith("resume text");
    expect(buildImportedResumeDraft).toHaveBeenCalledTimes(1);
    await expect(response.json()).resolves.toEqual({ draft, warnings: ["date omitted"] });
  });

  it("rejects non-pdf uploads", async () => {
    const formData = new FormData();
    formData.append(
      "file",
      new File(["{}"], "resume.json", {
        type: "application/json",
      }),
    );

    const response = await POST(
      new Request("http://localhost:3000/api/import-pdf", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(400);
    expect(extractPdfText).not.toHaveBeenCalled();
  });

  it("returns 422 when the PDF has no extractable text", async () => {
    extractPdfText.mockRejectedValue(
      new ResumeImportError("No extractable text found in this PDF.", 422),
    );

    const formData = new FormData();
    formData.append(
      "file",
      new File([new Uint8Array([1, 2, 3])], "resume.pdf", {
        type: "application/pdf",
      }),
    );

    const response = await POST(
      new Request("http://localhost:3000/api/import-pdf", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(422);
  });

  it("returns a controlled error when Gemini responds with an invalid shape", async () => {
    extractPdfText.mockResolvedValue("resume text");
    mapResumeTextWithGemini.mockRejectedValue(
      new ResumeImportError("Gemini returned an unexpected resume shape.", 502),
    );

    const formData = new FormData();
    formData.append(
      "file",
      new File([new Uint8Array([1, 2, 3])], "resume.pdf", {
        type: "application/pdf",
      }),
    );

    const response = await POST(
      new Request("http://localhost:3000/api/import-pdf", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(502);
  });

  it("returns 503 when Gemini is not configured", async () => {
    extractPdfText.mockResolvedValue("resume text");
    mapResumeTextWithGemini.mockRejectedValue(
      new ResumeImportError("GEMINI_API_KEY is not configured.", 503),
    );

    const formData = new FormData();
    formData.append(
      "file",
      new File([new Uint8Array([1, 2, 3])], "resume.pdf", {
        type: "application/pdf",
      }),
    );

    const response = await POST(
      new Request("http://localhost:3000/api/import-pdf", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(503);
  });
});
