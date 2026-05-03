import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import { ResumeEditorShell } from "@/features/resume-editor/editor-shell";
import { exportResumeDraft, RESUME_STORAGE_KEY } from "@/lib/resume/storage";

const originalMatchMedia = window.matchMedia;

function mockViewport(width: number) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: query.includes("1680px")
        ? width >= 1680
        : query.includes("1024px")
          ? width >= 1024
          : false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => true,
    }),
  });
}

beforeEach(() => {
  mockViewport(390);
});

afterEach(() => {
  window.localStorage.clear();
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: originalMatchMedia,
  });
});

describe("resume editor shell", () => {
  it("uses Sections, Edit, and Preview tabs on mobile", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();

    render(<ResumeEditorShell initialDraft={draft} />);

    expect(screen.getByRole("tab", { name: "Sections" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Preview" })).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "Resume Editor" })).toBeInTheDocument();
    expect(screen.queryByText(/editorial cv builder/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /edit profile/i }));
    await user.click(screen.getByRole("tab", { name: "Edit" }));

    expect(
      screen.getByRole("button", { name: /back to section list/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it("updates the preview only after the section save action", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();

    mockViewport(1440);
    render(<ResumeEditorShell initialDraft={draft} />);
    await user.click(screen.getByRole("button", { name: /edit profile/i }));

    const fullNameInput = screen.getByLabelText(/full name/i);
    await user.clear(fullNameInput);
    await user.type(fullNameInput, "Edited Profile Name");

    screen
      .getAllByTestId("resume-preview-full-name")
      .forEach((previewHeading) =>
        expect(previewHeading).toHaveTextContent("Dimas Angkasa Nurindra")
      );

    await user.click(screen.getByRole("button", { name: /save section/i }));

    screen
      .getAllByTestId("resume-preview-full-name")
      .forEach((previewHeading) =>
        expect(previewHeading).toHaveTextContent("Edited Profile Name")
      );
  });

  it("keeps unsaved section edits while switching between edit and preview tabs", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();

    render(<ResumeEditorShell initialDraft={draft} />);

    await user.click(screen.getByRole("button", { name: /edit profile/i }));
    await user.click(screen.getByRole("tab", { name: "Edit" }));

    const fullNameInput = screen.getByLabelText(/full name/i);
    await user.clear(fullNameInput);
    await user.type(fullNameInput, "Edited Profile Name");

    await user.click(screen.getByRole("tab", { name: "Preview" }));
    await user.click(screen.getByRole("tab", { name: "Edit" }));

    expect(screen.getByLabelText(/full name/i)).toHaveValue("Edited Profile Name");

    await user.click(screen.getByRole("button", { name: /back to section list/i }));

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText(/discard unsaved changes\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(/leave this section without saving your latest edits/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /stay editing/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /discard changes/i })).toBeInTheDocument();
  });

  it("hydrates without recoverable errors when local storage differs from the server draft", async () => {
    const storedDraft = createDefaultResumeDraft();
    storedDraft.profile.extraLinks = [
      {
        id: "portfolio-only",
        url: "https://asaa.dev",
      },
    ];

    window.localStorage.setItem(RESUME_STORAGE_KEY, exportResumeDraft(storedDraft));

    const originalWindowDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "window"
    );

    Object.defineProperty(globalThis, "window", {
      value: undefined,
      configurable: true,
    });

    const serverHtml = renderToString(<ResumeEditorShell />);

    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    }

    const container = document.createElement("div");
    container.innerHTML = serverHtml;
    document.body.appendChild(container);

    const recoverableErrors: Error[] = [];
    let root: ReturnType<typeof hydrateRoot> | null = null;

    await act(async () => {
      root = hydrateRoot(container, <ResumeEditorShell />, {
        onRecoverableError(error) {
          recoverableErrors.push(error as Error);
        },
      });
      await Promise.resolve();
    });

    expect(recoverableErrors).toEqual([]);

    root?.unmount();
    container.remove();
  });

  it("hydrates without console hydration mismatches from generated ids", async () => {
    const draft = createDefaultResumeDraft();
    const originalWindowDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "window"
    );

    Object.defineProperty(globalThis, "window", {
      value: undefined,
      configurable: true,
    });

    const serverHtml = renderToString(
      <ResumeEditorShell initialDraft={draft} />
    );

    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    }

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const container = document.createElement("div");
    container.innerHTML = serverHtml;
    document.body.appendChild(container);

    let root: ReturnType<typeof hydrateRoot> | null = null;
    let hydrationErrors: unknown[][] = [];

    try {
      await act(async () => {
        root = hydrateRoot(
          container,
          <ResumeEditorShell initialDraft={draft} />
        );
        await Promise.resolve();
      });

      hydrationErrors = consoleErrorSpy.mock.calls.filter((call) =>
        String(call[0]).toLowerCase().includes("hydrat")
      );
    } finally {
      consoleErrorSpy.mockRestore();
      root?.unmount();
      container.remove();
    }

    expect(hydrationErrors).toEqual([]);
  });

  it("reorders sections immediately from the navigator and updates the preview order", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();
    draft.sections.projects.items = [
      {
        id: "project-1",
        projectName: "Project Atlas",
        projectLink: "https://example.com/project-atlas",
        startDate: "Feb 2024",
        endDate: "current",
        description: "<p>Project description</p>",
      },
    ];
    draft.sections.skills.items = [
      {
        id: "skill-1",
        categoryName: "Frontend",
        skills: ["React", "TypeScript"],
      },
    ];

    mockViewport(1440);
    render(<ResumeEditorShell initialDraft={draft} />);

    await user.click(screen.getByRole("button", { name: /move projects up/i }));

    const headings = screen
      .getAllByTestId("resume-preview-section-heading")
      .map((element) => element.textContent);

    expect(headings).toEqual(["Summary", "Projects", "Skills"]);
  });

  it("shows inline validation state after a failed save", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();
    draft.sections.projects.items = [
      {
        id: "project-1",
        projectName: "Project Atlas",
        projectLink: "https://example.com/project-atlas",
        startDate: "Feb 2024",
        endDate: "current",
        description: "<p>Project description</p>",
      },
    ];

    mockViewport(1440);
    render(<ResumeEditorShell initialDraft={draft} />);

    await user.click(screen.getByRole("button", { name: /edit projects/i }));

    const projectNameInput = screen.getByLabelText(/project name/i);
    await user.clear(projectNameInput);
    await user.click(screen.getByRole("button", { name: /save section/i }));

    expect(screen.getByText(/project name is required/i)).toBeInTheDocument();
    expect(projectNameInput).toHaveAttribute("aria-invalid", "true");
  });

  it("returns to the compact section list after backing out of a clean form", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();

    mockViewport(1440);
    render(<ResumeEditorShell initialDraft={draft} />);

    await user.click(screen.getByRole("button", { name: /edit projects/i }));
    expect(screen.queryByRole("button", { name: /edit projects/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /back to section list/i }));

    expect(screen.getByRole("button", { name: /edit projects/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /back to section list/i })
    ).not.toBeInTheDocument();

    const profileRow = document.querySelector('[data-section-row="profile"]');
    expect(profileRow).toBeInTheDocument();
    expect(profileRow).not.toHaveAttribute("data-active", "true");
    expect(screen.getByRole("button", { name: /edit profile/i })).toBeInTheDocument();
  });

  it("shows section controls without contextual menus", () => {
    const draft = createDefaultResumeDraft();

    mockViewport(1440);
    render(<ResumeEditorShell initialDraft={draft} />);

    expect(
      screen.queryByRole("button", { name: /open summary actions/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /drag summary/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit summary/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /move summary down/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /hide summary/i })).toBeInTheDocument();
  });

  it("shows included and available sections with explicit show controls", () => {
    const draft = createDefaultResumeDraft();

    mockViewport(1440);
    render(<ResumeEditorShell initialDraft={draft} />);

    expect(screen.queryByText(/build order/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add optional section/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /included/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /available/i })).toBeInTheDocument();

    const availableSections = screen
      .getByRole("heading", { name: /available/i })
      .closest("section");

    expect(availableSections).not.toBeNull();
    expect(within(availableSections as HTMLElement).getByText("Publications")).toBeInTheDocument();
    expect(
      within(availableSections as HTMLElement).getByRole("button", {
        name: /show publications/i,
      })
    ).toBeInTheDocument();
  });

  it("edits profile summary as rich text instead of exposing raw stored HTML", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();

    mockViewport(1440);
    render(<ResumeEditorShell initialDraft={draft} />);

    await user.click(screen.getByRole("button", { name: /edit profile/i }));

    expect(screen.queryByDisplayValue(/<p>Software engineer/)).not.toBeInTheDocument();
    expect(
      screen.getByText(
        /Software engineer with experience building frontend-heavy web applications/i
      )
    ).toBeInTheDocument();
  });

  it("shows one add action in an empty collection form and does not render cancel", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();
    draft.sections.education.items = [];

    mockViewport(1440);
    render(<ResumeEditorShell initialDraft={draft} />);

    await user.click(screen.getByRole("button", { name: /edit education/i }));

    expect(
      screen.queryByRole("button", { name: /^cancel$/i })
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /add education/i })).toHaveLength(1);
  });

  it("disables removing the only item in a collection section", async () => {
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

    mockViewport(1440);
    render(<ResumeEditorShell initialDraft={draft} />);

    await user.click(screen.getByRole("button", { name: /edit projects/i }));

    expect(
      screen.getByRole("button", { name: /remove project 1/i })
    ).toBeDisabled();
  });

  it("opens a project editor even when stored draft items omit date fields", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();

    draft.sections.projects.items = [
      {
        id: "project-1",
        projectName: "Legacy project",
        projectLink: "",
        description: "<p>Legacy project description</p>",
      } as never,
    ];

    mockViewport(1440);
    render(<ResumeEditorShell initialDraft={draft} />);

    await user.click(screen.getByRole("button", { name: /edit projects/i }));

    expect(screen.getByLabelText(/project name/i)).toHaveValue("Legacy project");
    expect(screen.getByRole("button", { name: /save section/i })).toBeInTheDocument();
  });

  it("keeps preview chrome minimal", () => {
    const draft = createDefaultResumeDraft();

    mockViewport(1440);
    render(<ResumeEditorShell initialDraft={draft} />);

    expect(screen.queryByText(/live preview/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/recruiter-ready page/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^a4$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/curriculum vitae/i)).not.toBeInTheDocument();
  });

  it("uses a full-bleed two-pane desktop layout before the wide breakpoint", () => {
    const draft = createDefaultResumeDraft();

    mockViewport(1440);
    render(<ResumeEditorShell initialDraft={draft} />);

    expect(screen.getByTestId("resume-editor-desktop-main")).toHaveClass("gap-0");
    expect(screen.getByTestId("resume-editor-desktop-main")).toHaveClass("px-0");
    expect(screen.getByTestId("resume-editor-desktop-main")).toHaveAttribute(
      "data-layout",
      "two-pane"
    );
  });

  it("uses a three-pane desktop layout only on very wide screens", () => {
    const draft = createDefaultResumeDraft();

    mockViewport(1700);
    render(<ResumeEditorShell initialDraft={draft} />);

    expect(screen.getByTestId("resume-editor-desktop-main")).toHaveAttribute(
      "data-layout",
      "three-pane"
    );
    expect(screen.getByTestId("outline-pane")).toBeInTheDocument();
    expect(screen.getByTestId("active-form-pane")).toBeInTheDocument();
    expect(screen.getByTestId("preview-pane")).toBeInTheDocument();
  });
});
