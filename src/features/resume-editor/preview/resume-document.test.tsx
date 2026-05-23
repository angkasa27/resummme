import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";

describe("resume document", () => {
  it("renders profile extra links as safe anchors", () => {
    const draft = createDefaultResumeDraft();

    render(<ResumeDocument draft={draft} />);

    const header = screen
      .getByTestId("resume-preview-full-name")
      .closest("header");

    expect(header).not.toBeNull();

    const links = within(header as HTMLElement).getAllByRole("link");

    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("href", draft.profile.extraLinks[0].url);
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("applies the accent color and font scale as CSS variables on the root", () => {
    const draft = createDefaultResumeDraft();
    draft.pdfPresentation.layoutId = "single-column";
    draft.pdfPresentation.accent = "#059669";
    draft.pdfPresentation.fontScale = "lg";
    draft.pdfPresentation.lineHeight = "relaxed";
    draft.pdfPresentation.spacing = "airy";

    render(<ResumeDocument draft={draft} />);

    const documentRoot = screen
      .getByTestId("resume-preview-full-name")
      .closest("article");
    expect(documentRoot).not.toBeNull();
    expect(documentRoot?.getAttribute("data-layout")).toBe("single-column");
    expect(documentRoot?.style.getPropertyValue("--resume-accent")).toBe(
      "#059669",
    );
    expect(documentRoot?.style.getPropertyValue("--resume-body")).toBe("14px");
    expect(documentRoot?.style.getPropertyValue("--resume-leading")).toBe("1.9");
    expect(documentRoot?.style.getPropertyValue("--resume-gap-section")).toBe(
      "24px",
    );
  });

  it("renders all visible collection sections via the section registry", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.workExperience.items = [
      {
        id: "work-1",
        companyName: "Example Co",
        position: "Frontend Developer",
        location: "Jakarta",
        startDate: "Jan 2024",
        endDate: "current",
        description: "<p>Built the export stack.</p>",
      },
    ];

    render(<ResumeDocument draft={draft} />);

    expect(
      screen.getByRole("heading", { name: /work experience/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Frontend Developer/)).toBeInTheDocument();
    expect(screen.getByText(/Built the export stack/)).toBeInTheDocument();
  });

  it("places side sections (skills, languages) in the side column in two-column layout", () => {
    const draft = createDefaultResumeDraft();
    draft.pdfPresentation.layoutId = "two-column";
    draft.sections.languages.visible = true;

    render(<ResumeDocument draft={draft} />);

    const documentRoot = screen
      .getByTestId("resume-preview-full-name")
      .closest("article");
    expect(documentRoot?.querySelector(".layout-side")).not.toBeNull();
    expect(documentRoot?.querySelector(".layout-main")).not.toBeNull();

    const skillsSection = documentRoot?.querySelector(
      '[data-section="skills"]',
    );
    expect(
      skillsSection?.closest(".layout-side"),
    ).not.toBeNull();

    const workSection = documentRoot?.querySelector(
      '[data-section="workExperience"]',
    );
    expect(workSection?.closest(".layout-main")).not.toBeNull();
  });

  it("hides the summary block when content is empty", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.summary.content = "<p></p>";

    render(<ResumeDocument draft={draft} />);

    expect(
      screen.queryByRole("heading", { name: /^summary$/i }),
    ).not.toBeInTheDocument();
  });

  it("renders linked item titles (projects) as safe anchors", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.projects.items = [
      {
        id: "project-1",
        projectName: "Resume Export",
        projectLink: "https://example.com/project",
        startDate: "Jan 2026",
        endDate: "current",
        description: "<p>Pipeline.</p>",
      },
    ];

    render(<ResumeDocument draft={draft} />);

    const link = screen.getByRole("link", { name: "Resume Export" });
    expect(link).toHaveAttribute("href", "https://example.com/project");
  });
});
