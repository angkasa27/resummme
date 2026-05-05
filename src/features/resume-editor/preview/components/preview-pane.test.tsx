import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PreviewPane } from "@/features/resume-editor/preview/components/preview-pane";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";

describe("preview pane", () => {
  it("renders the preview with a style settings button", () => {
    render(
      <PreviewPane
        draft={createDefaultResumeDraft()}
        onSavePdfPresentation={vi.fn()}
      />,
    );

    expect(screen.getByText(/preview/i)).toBeInTheDocument();
    expect(screen.getByText(/style settings/i)).toBeInTheDocument();
    expect(screen.getByTestId("resume-preview-full-name")).toBeInTheDocument();
    expect(
      screen.queryByTestId("resume-preview-pages"),
    ).not.toBeInTheDocument();
  });

  it("opens style settings popover and shows all controls", async () => {
    const user = userEvent.setup();

    render(
      <PreviewPane
        draft={createDefaultResumeDraft()}
        onSavePdfPresentation={vi.fn()}
      />,
    );

    await user.click(screen.getByText(/style settings/i));

    expect(
      await screen.findByRole("combobox", { name: /^layout$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /profile layout/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /type scale/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /line height standard/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /accent tone blue/i }),
    ).toBeInTheDocument();
  });

  it("saves style changes from the settings popover", async () => {
    const user = userEvent.setup();
    const savePdfPresentation = vi.fn();

    render(
      <PreviewPane
        draft={createDefaultResumeDraft()}
        onSavePdfPresentation={savePdfPresentation}
      />,
    );

    // Open settings popover
    await user.click(screen.getByText(/style settings/i));

    // Change layout
    await user.click(
      await screen.findByRole("combobox", { name: /^layout$/i }),
    );
    await user.click(
      await screen.findByRole("option", { name: /classic centered/i }),
    );

    await waitFor(() =>
      expect(savePdfPresentation).toHaveBeenLastCalledWith(
        expect.objectContaining({
          layoutId: "classic-centered",
        }),
      ),
    );
  });

  it("saves profile layout changes from the settings popover", async () => {
    const user = userEvent.setup();
    const savePdfPresentation = vi.fn();

    render(
      <PreviewPane
        draft={createDefaultResumeDraft()}
        onSavePdfPresentation={savePdfPresentation}
      />,
    );

    await user.click(screen.getByText(/style settings/i));
    await user.click(
      await screen.findByRole("combobox", { name: /profile layout/i }),
    );
    await user.click(
      await screen.findByRole("option", { name: /sidebar profile/i }),
    );

    await waitFor(() =>
      expect(savePdfPresentation).toHaveBeenLastCalledWith(
        expect.objectContaining({
          profileLayoutId: "sidebar-profile",
        }),
      ),
    );
  });
});
