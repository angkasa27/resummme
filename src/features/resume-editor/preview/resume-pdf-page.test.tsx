import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { ResumePdfPage } from "@/features/resume-editor/preview/resume-pdf-page";
import { RESUME_PDF_SESSION_STORAGE_KEY } from "@/features/resume-editor/server/resume-pdf-session";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { exportResumeDraft } from "@/features/resume-editor/domain/draft/resume-draft-storage";

describe("resume pdf page", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("renders the resume document from session storage without editor chrome", async () => {
    const draft = createDefaultResumeDraft();
    draft.pdfPresentation.layoutId = "classic-centered";
    draft.pdfPresentation.overrides.typeScale = "large";
    draft.pdfPresentation.overrides.lineHeight = "relaxed";
    draft.sections.workExperience.items = [
      {
        id: "work-1",
        companyName: "Example Co",
        position: "Frontend Developer",
        location: "Jakarta",
        startDate: "Jan 2024",
        endDate: "current",
        description:
          "<ul><li>First bullet</li></ul><ol><li>First numbered</li></ol>",
      },
    ];

    window.sessionStorage.setItem(
      RESUME_PDF_SESSION_STORAGE_KEY,
      exportResumeDraft(draft)
    );

    render(<ResumePdfPage />);

    await waitFor(() =>
      expect(screen.getByTestId("resume-preview-full-name")).toBeInTheDocument()
    );
    expect(screen.getByText("Fulan bin Fulan")).toBeInTheDocument();
    expect(screen.queryByText("Resume Editor")).not.toBeInTheDocument();
    expect(screen.getAllByRole("list")).toHaveLength(2);
    expect(document.querySelector('[data-pdf-ready="true"]')).not.toBeNull();
    const documentRoot = screen
      .getByTestId("resume-preview-full-name")
      .closest("article");
    expect(documentRoot).not.toBeNull();
    expect(documentRoot).toHaveStyle({
      fontSize: "15px",
      lineHeight: "1.9",
    });
    expect(screen.getByRole("heading", { name: "WORK EXPERIENCE" })).toBeInTheDocument();
  });
});
