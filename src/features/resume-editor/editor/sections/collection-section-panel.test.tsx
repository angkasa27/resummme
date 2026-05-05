import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CollectionSectionPanel } from "@/features/resume-editor/editor/sections/collection-section-panel";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";

describe("collection section panel", () => {
  it("shows one add action in an empty collection form and does not render cancel", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.education.items = [];

    render(
      <CollectionSectionPanel
        draft={draft}
        sectionKey="education"
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
        onSave={vi.fn()}
      />
    );

    const projectLinkInput = screen.getByLabelText(/project link/i);
    await user.type(projectLinkInput, "not-a-url");
    await user.tab();

    expect(screen.getByText(/project link must be a valid url/i)).toBeInTheDocument();
  });

  it("clears the end date when the start date moves to the same month or later", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();
    draft.sections.projects.items = [
      {
        id: "project-1",
        projectName: "Project Alpha",
        projectLink: "",
        startDate: "Jan 2024",
        endDate: "Feb 2024",
        description: "<p></p>",
      },
    ];

    render(
      <CollectionSectionPanel
        draft={draft}
        sectionKey="projects"
        onSave={vi.fn()}
      />
    );

    await user.click(screen.getByLabelText(/start date/i));
    await user.click(screen.getByRole("button", { name: "Mar" }));

    expect(screen.getByLabelText(/end date/i)).toHaveTextContent(
      /current or oct 2024/i
    );
  });

  it("preserves appended skill item ids and arrays during autosave", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();
    const handleSave = vi.fn();

    render(
      <CollectionSectionPanel
        draft={draft}
        sectionKey="skills"
        onSave={handleSave}
      />
    );

    await user.click(screen.getByRole("button", { name: /add skill category/i }));

    const categoryInputs = screen.getAllByLabelText(/category name/i);
    await user.type(categoryInputs[1], "Backend");

    await waitFor(() =>
      expect(handleSave).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
              categoryName: "Backend",
              id: expect.any(String),
              skills: expect.any(Array),
            }),
          ]),
        })
      )
    );
  });
});
