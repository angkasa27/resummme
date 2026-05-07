import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PreviewToolbarContent } from "@/features/resume-editor/preview/components/preview-toolbar-content";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";

describe("preview control registry", () => {
  it("renders the default toolbar controls from the registry", async () => {
    render(
      <PreviewToolbarContent
        presentation={createDefaultResumeDraft().pdfPresentation}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("combobox", { name: /^layout$/i })).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /profile layout/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /font size/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /line height standard/i })
    ).toBeInTheDocument();
  });

  it("accepts a fake control definition without changing the toolbar component", async () => {
    const user = userEvent.setup();
    const updatePresentation = vi.fn();
    const presentation = createDefaultResumeDraft().pdfPresentation;

    render(
      <PreviewToolbarContent
        presentation={presentation}
        onChange={updatePresentation}
        definitions={[
          {
            id: "fake-spacing",
            kind: "toggle-group",
            label: "Fake spacing",
            value: () => "near",
            update: () => presentation,
            options: [
              {
                value: "near",
                label: "Near",
              },
              {
                value: "far",
                label: "Far",
              },
            ],
          },
        ]}
      />
    );

    await user.click(screen.getByRole("button", { name: /fake spacing far/i }));
    expect(updatePresentation).toHaveBeenCalledWith(presentation);
  });
});
