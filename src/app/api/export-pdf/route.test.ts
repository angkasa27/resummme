import { beforeEach, describe, expect, it, vi } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";

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
          origin: "http://localhost:3000",
        },
        body: JSON.stringify({ draft }),
      })
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/pdf");
    expect(response.headers.get("content-disposition")).toContain(
      "attachment; filename=\"resume-dimas-angkasa-"
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
          origin: "http://localhost:3000",
        },
        body: JSON.stringify({ draft: { nope: true } }),
      })
    );

    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(generateResumePdf).not.toHaveBeenCalled();
  });

  it("renders lenient (advisory-invalid) fields as-is instead of rejecting them", async () => {
    // Persistence is lenient: format validity is advisory in the editor, not a
    // hard gate. A draft with a not-yet-valid URL still exports (rendered as-is).
    generateResumePdf.mockResolvedValue(new Uint8Array([1, 2, 3]));

    const draft = createDefaultResumeDraft();
    draft.sections.projects.items[0].projectLink = "not-a-url";

    const response = await POST(
      new Request("http://localhost:3000/api/export-pdf", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "http://localhost:3000",
        },
        body: JSON.stringify({ draft }),
      })
    );

    expect(response.status).toBe(200);
    expect(generateResumePdf).toHaveBeenCalled();
  });

  it("returns a controlled error when PDF generation fails", async () => {
    generateResumePdf.mockRejectedValue(new Error("Chromium exploded"));

    const response = await POST(
      new Request("http://localhost:3000/api/export-pdf", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "http://localhost:3000",
        },
        body: JSON.stringify({ draft: createDefaultResumeDraft() }),
      })
    );

    expect(response.status).toBe(500);
    expect(response.headers.get("content-type")).toContain("application/json");
  });

  it("accepts same-origin requests on a custom production domain", async () => {
    generateResumePdf.mockResolvedValue(new Uint8Array([1, 2, 3]));

    const draft = createDefaultResumeDraft();
    const response = await POST(
      new Request("https://resume.example.com/api/export-pdf", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://resume.example.com",
        },
        body: JSON.stringify({ draft }),
      })
    );

    expect(response.status).toBe(200);
    expect(generateResumePdf).toHaveBeenCalledWith({
      draft,
      origin: "https://resume.example.com",
    });
  });

  it("rejects requests with a missing Origin header outside development", async () => {
    vi.stubEnv("NODE_ENV", "production");

    try {
      const response = await POST(
        new Request("https://resume.example.com/api/export-pdf", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ draft: createDefaultResumeDraft() }),
        })
      );

      expect(response.status).toBe(403);
      expect(generateResumePdf).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("rejects cross-origin requests unless the origin is trusted", async () => {
    vi.stubEnv("NODE_ENV", "production");

    try {
      const response = await POST(
        new Request("https://resume.example.com/api/export-pdf", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            origin: "https://evil.example.com",
          },
          body: JSON.stringify({ draft: createDefaultResumeDraft() }),
        })
      );

      expect(response.status).toBe(403);
      expect(generateResumePdf).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("accepts trusted cross-origin requests", async () => {
    generateResumePdf.mockResolvedValue(new Uint8Array([1, 2, 3]));
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("PDF_EXPORT_TRUSTED_ORIGINS", "https://admin.example.com");

    try {
      const draft = createDefaultResumeDraft();
      const response = await POST(
        new Request("https://resume.example.com/api/export-pdf", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            origin: "https://admin.example.com",
          },
          body: JSON.stringify({ draft }),
        })
      );

      expect(response.status).toBe(200);
      expect(generateResumePdf).toHaveBeenCalledWith({
        draft,
        origin: "https://resume.example.com",
      });
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
