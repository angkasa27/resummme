import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";

describe("resume document", () => {
  it("renders profile extra links as safe anchors", () => {
    const draft = createDefaultResumeDraft();

    render(<ResumeDocument draft={draft} />);

    const header = screen.getByTestId("resume-preview-full-name").closest("header");

    expect(header).not.toBeNull();

    const links = within(header as HTMLElement).getAllByRole("link");

    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("href", draft.profile.extraLinks[0].url);
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("applies saved pdf presentation styles to the preview document", () => {
    const draft = createDefaultResumeDraft();
    draft.pdfPresentation.layoutId = "classic-centered";
    draft.pdfPresentation.overrides.typeScale = "large";
    draft.pdfPresentation.overrides.lineHeight = "relaxed";
    draft.pdfPresentation.overrides.sectionSpacing = "airy";
    draft.pdfPresentation.overrides.itemSpacing = "airy";
    draft.pdfPresentation.overrides.accentTone = "emerald";
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

    const documentRoot = screen
      .getByTestId("resume-preview-full-name")
      .closest("article");
    expect(documentRoot).not.toBeNull();
    expect(documentRoot?.style.fontSize).toBe("15px");
    expect(documentRoot?.style.lineHeight).toBe("1.9");
    expect(documentRoot?.style.gap).toBe("32px");

    const documentHeader = screen
      .getByTestId("resume-preview-full-name")
      .closest("header");
    expect(documentHeader).not.toBeNull();
    expect(documentHeader).toHaveAttribute("data-layout", "classic-centered");

    const workSection = screen
      .getByRole("heading", { name: "WORK EXPERIENCE" })
      .closest("section");
    expect(workSection).not.toBeNull();
    const itemsContainer = workSection?.querySelector('[data-section-items="workExperience"]');
    expect(itemsContainer).not.toBeNull();
    expect(itemsContainer).toHaveStyle({ gap: "26px" });
    const firstDescription = document.querySelector('[data-classic-description="true"]');
    expect(firstDescription).toHaveStyle({ paddingLeft: "18px", paddingRight: "12px" });
    expect(firstDescription?.parentElement).toHaveStyle({ gap: "4px" });

    const profileLink = screen.getByRole("link", {
      name: draft.profile.extraLinks[0].url,
    });
    expect(profileLink.style.color).not.toBe("");
  });

  it("adds clearer indentation and compact metadata rows in the classic-centered layout", () => {
    const draft = createDefaultResumeDraft();
    draft.pdfPresentation.layoutId = "classic-centered";
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
    draft.sections.publications.items = [
      {
        id: "publication-1",
        title:
          "User Experience Analysis of AI-Based Interview Platform",
        publisher: "ICIMTech",
        publicationUrl: "https://example.com/paper",
        publicationDate: "Sep 2025",
        description: "<p>Co-authored a usability study.</p>",
      },
    ];
    draft.sections.certifications.items = [
      {
        id: "certification-1",
        certificationName: "Certified Indonesia Scrum Master",
        issuingOrganization: "EKIPA",
        issuedDate: "Dec 2020",
        certificationLink: "https://example.com/cert",
        credentialId: "ABC-123",
      },
    ];
    draft.sections.awards.items = [
      {
        id: "award-1",
        title: "1st Non-Academic Best Graduate",
        issuer: "SMK Telkom Malang",
        issuedDate: "Jun 2021",
        description: "",
      },
    ];
    draft.sections.languages.items = [
      {
        id: "language-1",
        language: "English",
        proficiency: "Professional working proficiency",
      },
    ];
    draft.sections.publications.visible = true;
    draft.sections.certifications.visible = true;
    draft.sections.awards.visible = true;
    draft.sections.languages.visible = true;

    render(<ResumeDocument draft={draft} />);

    const workSection = screen
      .getByRole("heading", { name: "WORK EXPERIENCE" })
      .closest("section");
    const workItemsContainer = workSection?.querySelector(
      '[data-section-items="workExperience"]'
    );
    expect(workItemsContainer).toHaveStyle({ paddingLeft: "8px" });

    const indentedDescriptions = document.querySelectorAll(
      '[data-classic-description="true"]'
    );
    expect(indentedDescriptions.length).toBeGreaterThan(0);
    expect(indentedDescriptions[0]).toHaveStyle({
      paddingLeft: "18px",
      paddingRight: "12px",
    });

    expect(
      screen.getByText(/User Experience Analysis of AI-Based Interview Platform/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/on ICIMTech/i)).toBeInTheDocument();
    expect(screen.getByText(/Credential ID: ABC-123/i)).toBeInTheDocument();
    expect(screen.getByText(/by EKIPA/i)).toBeInTheDocument();
    expect(screen.getByText(/1st Non-Academic Best Graduate/i)).toBeInTheDocument();
    expect(screen.getByText(/by SMK Telkom Malang/i)).toBeInTheDocument();
    expect(
      screen.getByText(/\(Professional working proficiency\)/i)
    ).toBeInTheDocument();
  });
});
