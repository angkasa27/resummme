import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";

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

  it("uses the accent color for the name and renders a centered portrait in the classic-centered layout", () => {
    const draft = createDefaultResumeDraft();
    draft.pdfPresentation.layoutId = "classic-centered";
    draft.pdfPresentation.overrides.accentTone = "emerald";
    draft.profile.photo = "https://images.example.com/profile.jpg";

    render(<ResumeDocument draft={draft} />);

    const name = screen.getByTestId("resume-preview-full-name");
    expect(name).toHaveStyle({ color: "rgb(5, 150, 105)" });

    const header = name.closest("header");
    const photoFrame = header?.querySelector('[data-slot="photo-frame"]');
    expect(photoFrame).toHaveClass("h-24", "w-18", "rounded-md");

    expect(header).toHaveClass("items-center", "text-center");
  });

  it("places the sidebar photo on the left as a portrait and keeps the name accented", () => {
    const draft = createDefaultResumeDraft();
    draft.pdfPresentation.layoutId = "sidebar-headings";
    draft.pdfPresentation.overrides.accentTone = "blue";
    draft.profile.photo = "https://images.example.com/profile.jpg";

    render(<ResumeDocument draft={draft} />);

    const name = screen.getByTestId("resume-preview-full-name");
    expect(name).toHaveStyle({ color: "rgb(37, 99, 235)" });

    const header = name.closest("header");
    const photoFrame = header?.querySelector('[data-slot="photo-frame"]');
    expect(photoFrame).toHaveClass("h-24", "w-18", "rounded-md");

    expect(header).toHaveClass("items-start");
    expect(photoFrame).not.toBeNull();
    expect(header?.querySelector(".flex.flex-1.items-center")).toContainElement(
      photoFrame as HTMLElement,
    );
  });

  it("applies saved pdf presentation styles to the preview document", () => {
    const draft = createDefaultResumeDraft();
    draft.pdfPresentation.layoutId = "classic-centered";
    draft.pdfPresentation.overrides.typeScale = "large";
    draft.pdfPresentation.overrides.lineHeight = "relaxed";
    draft.pdfPresentation.overrides.spacing = "airy";
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
    const workHeading = screen.getByRole("heading", {
      name: "WORK EXPERIENCE",
    });
    const itemsContainer = workSection?.querySelector(
      '[data-section-items="workExperience"]',
    );
    expect(itemsContainer).not.toBeNull();
    expect(itemsContainer).toHaveStyle({ gap: "20px" });
    const firstDescription = document.querySelector(
      '[data-classic-description="true"]',
    );
    expect(firstDescription).toHaveStyle({
      paddingLeft: "18px",
      paddingRight: "12px",
      textAlign: "justify",
    });
    expect(firstDescription?.parentElement).toHaveStyle({ gap: "4px" });
    expect(workHeading).toHaveStyle({ color: "rgb(5, 150, 105)" });
    expect(workHeading?.parentElement).toHaveStyle({
      borderColor: "rgb(5, 150, 105)",
    });

    const profileLink = screen.getByRole("link", {
      name: `Link: ${draft.profile.extraLinks[0].url}`,
    });
    expect(profileLink).toHaveStyle({ color: "rgb(75, 85, 99)" });
  });

  it("renders summary and item body copy with justified text", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.summary.content =
      "<p>Software engineer with experience building frontend-heavy systems for product teams.</p>";
    draft.sections.projects.items = [
      {
        id: "project-1",
        projectName: "Resume Export",
        projectLink: "https://example.com/project",
        startDate: "Jan 2026",
        endDate: "current",
        description:
          "<p>Built a deterministic PDF export pipeline with cleaner document rendering.</p>",
      },
    ];

    render(<ResumeDocument draft={draft} />);

    const summaryText = screen
      .getByText(
        /Software engineer with experience building frontend-heavy systems/i,
      )
      .closest("div");
    expect(summaryText).toHaveStyle({ textAlign: "justify" });

    const projectDescription = screen
      .getByText(/Built a deterministic PDF export pipeline/i)
      .closest("div");
    expect(projectDescription).toHaveStyle({ textAlign: "justify" });
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
        title: "User Experience Analysis of AI-Based Interview Platform",
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
    draft.sections.projects.items = [
      {
        id: "project-1",
        projectName: "Email Operations Dashboard",
        projectLink: "https://example.com/project",
        startDate: "Apr 2026",
        endDate: "Apr 2026",
        description: "<p>Built an internal operations dashboard.</p>",
      },
    ];
    draft.sections.publications.visible = true;
    draft.sections.certifications.visible = true;
    draft.sections.awards.visible = true;
    draft.sections.languages.visible = true;
    draft.sections.projects.visible = true;

    render(<ResumeDocument draft={draft} />);

    const workSection = screen
      .getByRole("heading", { name: "WORK EXPERIENCE" })
      .closest("section");
    const workItemsContainer = workSection?.querySelector(
      '[data-section-items="workExperience"]',
    );
    expect(workItemsContainer).toHaveStyle({ paddingLeft: "8px" });

    const indentedDescriptions = document.querySelectorAll(
      '[data-classic-description="true"]',
    );
    expect(indentedDescriptions.length).toBeGreaterThan(0);
    expect(indentedDescriptions[0]).toHaveStyle({
      paddingLeft: "18px",
      paddingRight: "12px",
      textAlign: "justify",
    });

    expect(
      screen.getByText(
        /User Experience Analysis of AI-Based Interview Platform/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/on ICIMTech/i)).toBeInTheDocument();
    expect(screen.getByText(/Credential ID: ABC-123/i)).toBeInTheDocument();
    expect(screen.getByText(/by EKIPA/i)).toBeInTheDocument();
    expect(
      screen.getByText(/\(Professional working proficiency\)/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "User Experience Analysis of AI-Based Interview Platform",
      }),
    ).toHaveAttribute("href", "https://example.com/paper");
    expect(
      screen.getByRole("link", { name: "Certified Indonesia Scrum Master" }),
    ).toHaveAttribute("href", "https://example.com/cert");
    expect(
      screen.getByRole("link", { name: "Email Operations Dashboard" }),
    ).toHaveAttribute("href", "https://example.com/project");
    expect(
      screen.getByRole("link", { name: "Email Operations Dashboard" }),
    ).toHaveStyle({
      color: "rgb(31, 41, 55)",
      textDecoration: "underline",
    });
  });

  it("uses accent color on section labels instead of links in the sidebar layout", () => {
    const draft = createDefaultResumeDraft();
    draft.pdfPresentation.overrides.accentTone = "rose";
    draft.sections.projects.items = [
      {
        id: "project-1",
        projectName: "Resume Export",
        projectLink: "https://example.com/project",
        startDate: "Jan 2026",
        endDate: "current",
        description: "<p>Built a deterministic PDF export pipeline.</p>",
      },
    ];

    render(<ResumeDocument draft={draft} />);

    const sectionHeading = screen.getByRole("heading", { name: "Projects" });
    expect(sectionHeading).toHaveStyle({ color: "rgb(225, 29, 72)" });

    const projectLink = screen.getByRole("link", { name: "Resume Export" });
    expect(projectLink).toHaveStyle({
      color: "rgb(17, 24, 39)",
      textDecoration: "underline",
    });
  });

  it("keeps the date column fixed when a sidebar-layout item title is very long", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.publications.items = [
      {
        id: "publication-1",
        title:
          "thIS IS LONG TITLE thIS IS LONG TITLE thIS IS LONG TITLE thIS IS LONG TITLE thIS IS LONG TITLE",
        publisher:
          "2025 International Conference on Information Management and Technology (ICIMTech)",
        publicationUrl: "https://example.com/paper",
        publicationDate: "Sep 2025",
        description:
          "<p>Co-authored a usability study evaluating an AI-based interview platform.</p>",
      },
    ];
    draft.sections.publications.visible = true;

    render(<ResumeDocument draft={draft} />);

    const dateCell = screen.getByText("Sep 2025");
    const headerRow = dateCell.parentElement;
    expect(headerRow).toHaveStyle({
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
    });

    const titleCell = screen
      .getByRole("link", {
        name: "thIS IS LONG TITLE thIS IS LONG TITLE thIS IS LONG TITLE thIS IS LONG TITLE thIS IS LONG TITLE",
      })
      .closest("div");
    expect(titleCell?.parentElement).toHaveStyle({ minWidth: "0px" });
  });
});
