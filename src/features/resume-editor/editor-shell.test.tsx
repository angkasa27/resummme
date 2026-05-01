import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import { ResumeEditorShell } from "@/features/resume-editor/editor-shell";
import { exportResumeDraft, RESUME_STORAGE_KEY } from "@/lib/resume/storage";

afterEach(() => {
  window.localStorage.clear();
});

describe("resume editor shell", () => {
  it("updates the preview only after the section save action", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();

    render(<ResumeEditorShell initialDraft={draft} />);

    const fullNameInput = screen.getByLabelText(/full name/i);
    await user.clear(fullNameInput);
    await user.type(fullNameInput, "Edited Profile Name");

    screen
      .getAllByTestId("resume-preview-full-name")
      .forEach((previewHeading) =>
        expect(previewHeading).toHaveTextContent("Dimas Angkasa Nurindra")
      );

    await user.click(screen.getAllByRole("button", { name: /save section/i })[0]);

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

    const fullNameInput = screen.getByLabelText(/full name/i);
    await user.clear(fullNameInput);
    await user.type(fullNameInput, "Edited Profile Name");

    await user.click(screen.getByRole("tab", { name: "Preview" }));
    await user.click(screen.getByRole("tab", { name: "Edit" }));

    expect(screen.getByLabelText(/full name/i)).toHaveValue("Edited Profile Name");

    await user.click(screen.getAllByRole("button", { name: "Open" })[0]);

    expect(screen.getAllByText(/unsaved changes/i).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        /save or discard the current panel before moving to summary/i
      ).length
    ).toBeGreaterThan(0);
  });

  it("hydrates without recoverable errors when local storage differs from the server draft", async () => {
    const storedDraft = createDefaultResumeDraft();
    storedDraft.profile.extraLinks = [
      {
        id: "portfolio-only",
        label: "Portfolio",
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
});
