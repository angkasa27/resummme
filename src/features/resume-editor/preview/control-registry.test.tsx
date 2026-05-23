import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PreviewToolbarContent } from "@/features/resume-editor/preview/components/preview-toolbar-content";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";

describe("preview control registry", () => {
  it("renders the default toolbar controls from the registry", () => {
    render(
      <PreviewToolbarContent
        presentation={createDefaultResumeDraft().pdfPresentation}
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("combobox", { name: /^template$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /font size/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /paper size/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /page margin/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /line height standard/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: /^layout$/i }),
    ).not.toBeInTheDocument();
  });

  it("offers all five template options in the Template select", async () => {
    const user = userEvent.setup();
    const updatePresentation = vi.fn();

    render(
      <PreviewToolbarContent
        presentation={createDefaultResumeDraft().pdfPresentation}
        onChange={updatePresentation}
      />,
    );

    await user.click(screen.getByRole("combobox", { name: /^template$/i }));

    for (const label of [
      /^classic$/i,
      /^sidebar$/i,
      /^modern centered$/i,
      /^compact$/i,
      /^academic$/i,
    ]) {
      expect(
        await screen.findByRole("option", { name: label }),
      ).toBeInTheDocument();
    }
  });
});
