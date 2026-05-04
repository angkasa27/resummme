import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useResumeEditorController } from "@/features/resume-editor/hooks/use-resume-editor-controller";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";

const { toast } = vi.hoisted(() => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(() => "loading-toast"),
  },
}));

vi.mock("sonner", () => ({
  toast,
}));

function TestHarness() {
  const controller = useResumeEditorController({
    initialDraft: createDefaultResumeDraft(),
  });

  return (
    <button type="button" onClick={controller.handlePrint}>
      Export PDF
    </button>
  );
}

describe("useResumeEditorController handlePrint", () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    toast.success.mockReset();
    toast.error.mockReset();
    toast.loading.mockReset();
    toast.loading.mockReturnValue("loading-toast");
    global.fetch = vi.fn();
    URL.createObjectURL = vi.fn(() => "blob:resume-pdf");
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    vi.restoreAllMocks();
  });

  it("posts the current draft and downloads the returned PDF", async () => {
    const anchorClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    const anchor = originalCreateElement("a");
    anchor.click = anchorClick;

    vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "a") {
        return anchor;
      }

      return originalCreateElement(tagName);
    });

    vi.mocked(fetch).mockResolvedValue(
      new Response(new Uint8Array([1, 2, 3]), {
        status: 200,
        headers: {
          "content-type": "application/pdf",
        },
      })
    );

    render(<TestHarness />);
    fireEvent.click(screen.getByRole("button", { name: "Export PDF" }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(toast.loading).toHaveBeenCalledWith("Generating PDF...");
    expect(fetch).toHaveBeenCalledWith(
      "/api/export-pdf",
      expect.objectContaining({
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      })
    );
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(anchor.download).toBe("resume.pdf");
    expect(anchorClick).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalled();
  });

  it("shows an error toast when the PDF export fails", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: "bad things" }), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      })
    );

    render(<TestHarness />);
    fireEvent.click(screen.getByRole("button", { name: "Export PDF" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
  });
});
