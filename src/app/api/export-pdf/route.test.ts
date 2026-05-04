import { beforeEach, describe, expect, it, vi } from "vitest";

import { createDefaultResumeDraft } from "@/lib/resume/default-draft";

const { generateResumePdf } = vi.hoisted(() => ({
  generateResumePdf: vi.fn(),
}));

vi.mock("@/features/resume-editor/server/generate-resume-pdf", () => ({
  generateResumePdf,
}));

import { POST } from "@/app/api/export-pdf/route";

describe("POST /api/export-pdf", () => {
  beforeEach(() => {
    generateResumePdf.mockReset();
  });

  it("returns a PDF response for a valid draft", async () => {
    generateResumePdf.mockResolvedValue(new Uint8Array([1, 2, 3]));

    const draft = createDefaultResumeDraft();
    const response = await POST(
      new Request("http://localhost:3000/api/export-pdf", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ draft }),
      })
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/pdf");
    expect(response.headers.get("content-disposition")).toContain(
      "attachment; filename=\"resume.pdf\""
    );
    expect(generateResumePdf).toHaveBeenCalledWith({
      draft,
      origin: "http://localhost:3000",
    });
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(
      new Uint8Array([1, 2, 3])
    );
  });

  it("rejects invalid drafts before invoking Chromium", async () => {
    const response = await POST(
      new Request("http://localhost:3000/api/export-pdf", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ draft: { nope: true } }),
      })
    );

    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(generateResumePdf).not.toHaveBeenCalled();
  });

  it("returns a controlled error when PDF generation fails", async () => {
    generateResumePdf.mockRejectedValue(new Error("Chromium exploded"));

    const response = await POST(
      new Request("http://localhost:3000/api/export-pdf", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ draft: createDefaultResumeDraft() }),
      })
    );

    expect(response.status).toBe(500);
    expect(response.headers.get("content-type")).toContain("application/json");
  });
});
