import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CollectionSectionPanel } from "@/features/resume-editor/sections/collection-section-panel";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";

describe("collection section panel", () => {
  it("shows one add action in an empty collection form and does not render cancel", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.education.items = [];

    render(
      <CollectionSectionPanel
        draft={draft}
        sectionKey="education"
        onBack={vi.fn()}
        onSave={vi.fn()}
      />
    );

    expect(
      screen.queryByRole("button", { name: /^cancel$/i })
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /add education/i })).toHaveLength(1);
  });

  it("disables removing the only item in a collection section", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.projects.items = [
      {
        id: "project-1",
        projectName: "",
        projectLink: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ];

    render(
      <CollectionSectionPanel
        draft={draft}
        sectionKey="projects"
        onBack={vi.fn()}
        onSave={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: /remove project 1/i })
    ).toBeDisabled();
  });

  it("opens a project editor even when stored draft items omit date fields", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.projects.items = [
      {
        id: "project-1",
        projectName: "Legacy project",
        projectLink: "",
        description: "<p>Legacy project description</p>",
      } as never,
    ];

    render(
      <CollectionSectionPanel
        draft={draft}
        sectionKey="projects"
        onBack={vi.fn()}
        onSave={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/project name/i)).toHaveValue("Legacy project");
    expect(screen.getByRole("button", { name: /add project/i })).toBeInTheDocument();
  });
});
