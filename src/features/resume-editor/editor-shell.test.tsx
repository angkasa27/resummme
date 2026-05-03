import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import { ResumeEditorShell } from "@/features/resume-editor/editor-shell";
import { exportResumeDraft, RESUME_STORAGE_KEY } from "@/lib/resume/storage";

const originalMatchMedia = window.matchMedia;

function mockDesktopViewport(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches,
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
  mockDesktopViewport(false);
});

afterEach(() => {
  window.localStorage.clear();
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: originalMatchMedia,
  });
});

describe("resume editor shell", () => {
  it("uses Editor and Preview tabs on mobile", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();

    render(<ResumeEditorShell initialDraft={draft} />);

    expect(screen.getByRole("tab", { name: "Editor" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Preview" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Sections" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /edit profile/i }));

    expect(
      screen.getByRole("button", { name: /back to section list/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it("updates the preview only after the section save action", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();

    mockDesktopViewport(true);
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

    const fullNameInput = screen.getByLabelText(/full name/i);
    await user.clear(fullNameInput);
    await user.type(fullNameInput, "Edited Profile Name");

    await user.click(screen.getByRole("tab", { name: "Preview" }));
    await user.click(screen.getByRole("tab", { name: "Editor" }));

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

    mockDesktopViewport(true);
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

    mockDesktopViewport(true);
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

    mockDesktopViewport(true);
    render(<ResumeEditorShell initialDraft={draft} />);

    await user.click(screen.getByRole("button", { name: /edit projects/i }));
    expect(screen.queryByRole("button", { name: /edit projects/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /back to section list/i }));

    expect(screen.getByRole("button", { name: /edit projects/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /back to section list/i })
    ).not.toBeInTheDocument();

    const profileRow = document.querySelector('[data-section-row="profile"]');
    expect(profileRow).toHaveClass("hover:bg-muted/55");
    expect(profileRow).not.toHaveClass("bg-primary/5");
  });

  it("renders grouped section rail controls instead of loose icon buttons", async () => {
    const draft = createDefaultResumeDraft();

    mockDesktopViewport(true);
    render(<ResumeEditorShell initialDraft={draft} />);

    const summaryActions = screen.getByRole("group", { name: /summary actions/i });
    expect(within(summaryActions).getByRole("button", { name: /edit summary/i })).toBeInTheDocument();
    expect(
      within(summaryActions).getByRole("button", { name: /move summary up/i })
    ).toBeInTheDocument();
    expect(
      within(summaryActions).getByRole("button", { name: /move summary down/i })
    ).toBeInTheDocument();
    expect(
      within(summaryActions).getByRole("button", { name: /hide summary/i })
    ).toBeInTheDocument();
  });

  it("shows one add action in an empty collection form and does not render cancel", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();
    draft.sections.education.items = [];

    mockDesktopViewport(true);
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

    mockDesktopViewport(true);
    render(<ResumeEditorShell initialDraft={draft} />);

    await user.click(screen.getByRole("button", { name: /edit projects/i }));

    expect(
      screen.getByRole("button", { name: /remove project 1/i })
    ).toBeDisabled();
  });
});
