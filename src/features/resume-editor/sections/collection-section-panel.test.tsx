import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("does not show required errors for blank project fields", async () => {
    const user = userEvent.setup();
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

    const projectNameInput = screen.getByLabelText(/project name/i);
    await user.click(projectNameInput);
    await user.tab();

    expect(screen.queryByText(/project name is required/i)).not.toBeInTheDocument();
  });

  it("still shows format errors for malformed project links", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();

    render(
      <CollectionSectionPanel
        draft={draft}
        sectionKey="projects"
        onBack={vi.fn()}
        onSave={vi.fn()}
      />
    );

    const projectLinkInput = screen.getByLabelText(/project link/i);
    await user.type(projectLinkInput, "not-a-url");
    await user.tab();

    expect(screen.getByText(/project link must be a valid url/i)).toBeInTheDocument();
  });
});
