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
    draft.pdfPresentation.templateId = "sidebar";
    draft.pdfPresentation.fontScale = "lg";
    draft.pdfPresentation.lineHeight = "relaxed";
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
      exportResumeDraft(draft),
    );

    render(<ResumePdfPage />);

    await waitFor(() =>
      expect(screen.getByTestId("resume-preview-full-name")).toBeInTheDocument(),
    );
    expect(screen.getByText(draft.profile.fullName)).toBeInTheDocument();
    expect(screen.queryByText("Resume Editor")).not.toBeInTheDocument();
    expect(screen.getAllByRole("list").length).toBeGreaterThanOrEqual(2);
    expect(document.querySelector('[data-pdf-ready="true"]')).not.toBeNull();

    const documentRoot = screen
      .getByTestId("resume-preview-full-name")
      .closest("article");
    expect(documentRoot?.getAttribute("data-template")).toBe("sidebar");
    expect(documentRoot?.style.getPropertyValue("--resume-body")).toBe("14px");
    expect(documentRoot?.style.getPropertyValue("--resume-leading")).toBe("1.9");
    expect(
      screen.getByRole("heading", { name: /work experience/i }),
    ).toBeInTheDocument();
  });
});
