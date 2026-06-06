import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ResumeEditorShell } from "@/features/resume-editor/editor/shell/resume-editor-shell";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import {
  exportResumeDraft,
  RESUME_STORAGE_KEY,
} from "@/features/resume-editor/domain/draft/resume-draft-storage";

const originalMatchMedia = window.matchMedia;

function mockViewport(width: number) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: query.includes("1024px")
        ? width >= 1024
        : query.includes("768px")
          ? width >= 768
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
  it("renders the navbar with title and action buttons", async () => {
    const draft = createDefaultResumeDraft();

    render(<ResumeEditorShell initialDraft={draft} />);

    await waitFor(() =>
      expect(
        screen.getByText("Resummme"),
      ).toBeInTheDocument(),
    );
  });

  it("hydrates without recoverable errors when local storage differs from the server draft", async () => {
    const storedDraft = createDefaultResumeDraft();
    storedDraft.profile.extraLinks = [
      {
        id: "portfolio-only",
        url: "https://asaa.dev",
      },
    ];

    window.localStorage.setItem(
      RESUME_STORAGE_KEY,
      exportResumeDraft(storedDraft),
    );

    const originalWindowDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "window",
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
    let root: { unmount: () => void } | null = null;

    await act(async () => {
      root = hydrateRoot(container, <ResumeEditorShell />, {
        onRecoverableError(error) {
          recoverableErrors.push(error as Error);
        },
      });
      await Promise.resolve();
    });

    expect(recoverableErrors).toEqual([]);

    // @ts-expect-error - Root might be inferred as never
    root?.unmount();
    container.remove();
  });

  it("hydrates without console hydration mismatches from generated ids", async () => {
    const draft = createDefaultResumeDraft();
    const originalWindowDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "window",
    );

    Object.defineProperty(globalThis, "window", {
      value: undefined,
      configurable: true,
    });

    const serverHtml = renderToString(
      <ResumeEditorShell initialDraft={draft} />,
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

    let root: { unmount: () => void } | null = null;
    let hydrationErrors: unknown[][] = [];

    try {
      await act(async () => {
        root = hydrateRoot(
          container,
          <ResumeEditorShell initialDraft={draft} />,
        );
        await Promise.resolve();
      });

      hydrationErrors = consoleErrorSpy.mock.calls.filter((call) =>
        String(call[0]).toLowerCase().includes("hydrat"),
      );
    } finally {
      consoleErrorSpy.mockRestore();
      // @ts-expect-error - Root might be inferred as never
      root?.unmount();
      container.remove();
    }

    expect(hydrationErrors).toEqual([]);
  });

  it("keeps preview chrome minimal", async () => {
    const draft = createDefaultResumeDraft();

    mockViewport(1440);
    render(<ResumeEditorShell initialDraft={draft} />);

    await waitFor(() =>
      expect(
        screen.getByText("Resummme"),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByText(/live preview/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/recruiter-ready page/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^a4$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/curriculum vitae/i)).not.toBeInTheDocument();
  });

  it("renders a style settings button in the preview pane", async () => {
    const draft = createDefaultResumeDraft();

    mockViewport(1440);
    render(<ResumeEditorShell initialDraft={draft} />);

    await waitFor(() =>
      expect(screen.getAllByText("Style").length).toBeGreaterThanOrEqual(1),
    );
  });

  it("renders the loading screen in the initial server html", () => {
    const originalWindowDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "window",
    );

    Object.defineProperty(globalThis, "window", {
      value: undefined,
      configurable: true,
    });

    const serverHtml = renderToString(<ResumeEditorShell />);

    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    }

    expect(serverHtml).toContain("Loading editor");
    expect(serverHtml).toContain("Preparing your resume draft...");
  });
});
