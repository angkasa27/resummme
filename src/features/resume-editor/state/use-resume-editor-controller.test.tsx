import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useResumeEditorController } from "@/features/resume-editor/state/use-resume-editor-controller";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";

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
    <>
      <input
        data-testid="json-import-input"
        ref={controller.jsonFileInputRef}
        type="file"
        onChange={controller.handleJsonImport}
      />
      <input
        data-testid="pdf-import-input"
        ref={controller.pdfFileInputRef}
        type="file"
        onChange={controller.handlePdfImport}
      />
      <div data-testid="full-name">{controller.draft.profile.fullName}</div>
      <button
        type="button"
        disabled={controller.isExportingPdf}
        onClick={controller.handlePrint}
      >
        {controller.isExportingPdf ? "Exporting..." : "Export PDF"}
      </button>
      <button
        type="button"
        disabled={controller.isImportingPdf}
        onClick={controller.openPdfImportPicker}
      >
        {controller.isImportingPdf ? "Importing PDF..." : "Import PDF"}
      </button>
    </>
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
          "content-disposition":
            'attachment; filename="resume-dimas-angkasa-20260521-142355.pdf"',
        },
      }),
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
      }),
    );
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(anchor.download).toBe("resume-dimas-angkasa-20260521-142355.pdf");
    expect(anchorClick).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalled();
  });

  it("ignores repeated export clicks while a PDF request is already in flight", async () => {
    let resolveFetch: ((value: Response) => void) | undefined;
    vi.mocked(fetch).mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );

    render(<TestHarness />);

    fireEvent.click(screen.getByRole("button", { name: "Export PDF" }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Exporting..." }),
      ).toBeDisabled(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Exporting..." }));
    expect(fetch).toHaveBeenCalledTimes(1);

    resolveFetch?.(
      new Response(new Uint8Array([1, 2, 3]), {
        status: 200,
        headers: {
          "content-type": "application/pdf",
          "content-disposition":
            'attachment; filename="resume-dimas-angkasa-20260521-142355.pdf"',
        },
      }),
    );

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Export PDF" })).toBeEnabled(),
    );
  });

  it("shows an error toast when the PDF export fails", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: "bad things" }), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      }),
    );

    render(<TestHarness />);
    fireEvent.click(screen.getByRole("button", { name: "Export PDF" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
  });

  it("replaces the draft after a successful PDF import", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          draft: {
            ...createDefaultResumeDraft(),
            profile: {
              ...createDefaultResumeDraft().profile,
              fullName: "Imported Candidate",
            },
          },
          warnings: ["one warning"],
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    render(<TestHarness />);
    const input = screen.getByTestId("pdf-import-input") as HTMLInputElement;
    const file = new File([new Uint8Array([1, 2, 3])], "resume.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    await waitFor(() =>
      expect(screen.getByTestId("full-name")).toHaveTextContent(
        "Imported Candidate",
      ),
    );
    expect(fetch).toHaveBeenCalledWith(
      "/api/import-pdf",
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      }),
    );
    expect(toast.success).toHaveBeenCalledWith(
      "PDF imported with 1 warning.",
    );
  });

  it("ignores repeated PDF imports while a request is already in flight", async () => {
    let resolveFetch: ((value: Response) => void) | undefined;
    vi.mocked(fetch).mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );

    render(<TestHarness />);
    const input = screen.getByTestId("pdf-import-input") as HTMLInputElement;
    const file = new File([new Uint8Array([1, 2, 3])], "resume.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Importing PDF..." }),
      ).toBeDisabled(),
    );

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    resolveFetch?.(
      new Response(
        JSON.stringify({
          draft: createDefaultResumeDraft(),
          warnings: [],
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Import PDF" })).toBeEnabled(),
    );
  });

  it("shows an error toast when the PDF import fails", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: "bad import" }), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      }),
    );

    render(<TestHarness />);
    const input = screen.getByTestId("pdf-import-input") as HTMLInputElement;
    const file = new File([new Uint8Array([1, 2, 3])], "resume.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("bad import"),
    );
  });
});
