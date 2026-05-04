import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PreviewPane } from "@/features/resume-editor/preview-pane";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";

describe("preview pane", () => {
  it("renders the preview with a style settings button", () => {
    render(
      <PreviewPane
        draft={createDefaultResumeDraft()}
        onSavePdfPresentation={vi.fn()}
      />
    );

    expect(screen.getByText(/preview/i)).toBeInTheDocument();
    expect(screen.getByText(/style settings/i)).toBeInTheDocument();
    expect(screen.getByTestId("resume-preview-full-name")).toBeInTheDocument();
    expect(screen.queryByTestId("resume-preview-pages")).not.toBeInTheDocument();
  });

  it("opens style settings popover and shows all controls", async () => {
    const user = userEvent.setup();

    render(
      <PreviewPane
        draft={createDefaultResumeDraft()}
        onSavePdfPresentation={vi.fn()}
      />
    );

    await user.click(screen.getByText(/style settings/i));

    expect(await screen.findByRole("combobox", { name: /layout/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /type scale/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /line height standard/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /accent tone blue/i })).toBeInTheDocument();
  });

  it("saves style changes from the settings popover", async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();

    render(
      <PreviewPane
        draft={createDefaultResumeDraft()}
        onSavePdfPresentation={handleSave}
      />
    );

    // Open settings popover
    await user.click(screen.getByText(/style settings/i));

    // Change layout
    await user.click(await screen.findByRole("combobox", { name: /layout/i }));
    await user.click(await screen.findByRole("option", { name: /classic centered/i }));

    await waitFor(() =>
      expect(handleSave).toHaveBeenLastCalledWith(
        expect.objectContaining({
          layoutId: "classic-centered",
        })
      )
    );
  });
});
