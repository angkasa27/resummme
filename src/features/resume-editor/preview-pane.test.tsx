import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PreviewPane } from "@/features/resume-editor/preview-pane";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";

describe("preview pane", () => {
  it("renders a pdf style toolbar above the continuous preview", () => {
    render(
      <PreviewPane
        draft={createDefaultResumeDraft()}
        onSavePdfPresentation={vi.fn()}
      />
    );

    expect(screen.getByRole("toolbar", { name: /pdf style/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /layout/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /type scale/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /line height standard/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /section spacing standard/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /item spacing standard/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /accent tone blue/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /accent strength balanced/i })).toBeInTheDocument();
    expect(screen.getByTestId("resume-preview-full-name")).toBeInTheDocument();
    expect(screen.queryByTestId("resume-preview-pages")).not.toBeInTheDocument();
  });

  it("shows tooltips for icon-only toolbar controls", async () => {
    const user = userEvent.setup();

    render(
      <PreviewPane
        draft={createDefaultResumeDraft()}
        onSavePdfPresentation={vi.fn()}
      />
    );

    await user.hover(screen.getByRole("button", { name: /accent tone blue/i }));

    expect(await screen.findByRole("tooltip")).toHaveTextContent(/accent tone: blue/i);
  });

  it("saves layout and style changes from the toolbar", async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();

    render(
      <PreviewPane
        draft={createDefaultResumeDraft()}
        onSavePdfPresentation={handleSave}
      />
    );

    await user.click(screen.getByRole("combobox", { name: /layout/i }));
    await user.click(await screen.findByRole("option", { name: /classic centered/i }));
    await user.click(screen.getByRole("combobox", { name: /type scale/i }));
    await user.click(await screen.findByRole("option", { name: /large/i }));
    await user.click(screen.getByRole("button", { name: /line height relaxed/i }));
    await user.click(screen.getByRole("button", { name: /accent tone emerald/i }));
    await user.click(screen.getByRole("button", { name: /accent strength strong/i }));

    await waitFor(() =>
      expect(handleSave).toHaveBeenLastCalledWith(
        expect.objectContaining({
          layoutId: "classic-centered",
          overrides: expect.objectContaining({
            typeScale: "large",
            lineHeight: "relaxed",
            accentTone: "emerald",
            accentStrength: "strong",
          }),
        })
      )
    );
  });
});
