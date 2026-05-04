import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PreviewToolbarContent } from "@/features/resume-editor/preview-pane";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";

describe("preview control registry", () => {
  it("renders the default toolbar controls from the registry", async () => {
    render(
      <PreviewToolbarContent
        presentation={createDefaultResumeDraft().pdfPresentation}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("combobox", { name: /layout/i })).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /type scale/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /line height standard/i })
    ).toBeInTheDocument();
  });

  it("accepts a fake control definition without changing the toolbar component", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const presentation = createDefaultResumeDraft().pdfPresentation;

    render(
      <PreviewToolbarContent
        presentation={presentation}
        onChange={handleChange}
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
    expect(handleChange).toHaveBeenCalledWith(presentation);
  });
});
