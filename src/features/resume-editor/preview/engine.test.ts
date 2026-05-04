import { describe, expect, it } from "vitest";

import { createPreviewRenderContext } from "@/features/resume-editor/preview/engine";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";

describe("preview render context", () => {
  it("normalizes visible renderable sections without repeating empty items", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.summary.content = "<p></p>";
    draft.sections.projects.items = [
      {
        id: "project-empty",
        projectName: "",
        projectLink: "",
        startDate: "",
        endDate: "",
        description: "<p></p>",
      },
      {
        id: "project-filled",
        projectName: "Resume Export",
        projectLink: "https://example.com/project",
        startDate: "Jan 2026",
        endDate: "current",
        description: "<p>Built a deterministic PDF export pipeline.</p>",
      },
    ];

    const context = createPreviewRenderContext(draft, "preview");

    expect(context.summaryContent).toBeNull();
    expect(context.sections.find((section) => section.key === "projects")?.items)
      .toHaveLength(1);
    expect(context.sections.some((section) => section.key === "projects")).toBe(
      true
    );
  });
});
