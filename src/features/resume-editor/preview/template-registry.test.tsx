import { describe, expect, it } from "vitest";

import {
  getTemplate,
  previewTemplateDefinitions,
  renderTemplateHeader,
} from "@/features/resume-editor/preview/template-registry";
import { createPreviewRenderContext } from "@/features/resume-editor/preview/engine";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";

describe("preview template registry", () => {
  it("exposes all seven built-in templates", () => {
    const ids = previewTemplateDefinitions.map((template) => template.id);
    expect(ids).toEqual([
      "classic",
      "sidebar",
      "modern-centered",
      "timeline",
      "academic",
      "minimal",
      "divided",
    ]);
  });

  it("resolves templates by id", () => {
    for (const id of [
      "classic",
      "sidebar",
      "modern-centered",
      "timeline",
      "academic",
      "minimal",
      "divided",
    ] as const) {
      expect(getTemplate(id).id).toBe(id);
    }
  });

  it("falls back to classic when an unknown template id is requested", () => {
    expect(getTemplate("missing" as never).id).toBe("classic");
  });

  it("renders the matching header element for each template", () => {
    const draft = createDefaultResumeDraft();
    for (const id of [
      "classic",
      "sidebar",
      "modern-centered",
      "timeline",
      "academic",
      "minimal",
      "divided",
    ] as const) {
      draft.pdfPresentation.templateId = id;
      const context = createPreviewRenderContext(draft, "preview");
      const header = renderTemplateHeader(context);
      expect((header as { props: { context: unknown } }).props.context).toBe(
        context,
      );
    }
  });

  it("partitions sections into side and main columns in the sidebar template", () => {
    const sidebar = getTemplate("sidebar");
    expect(sidebar.getColumn?.("skills")).toBe("side");
    expect(sidebar.getColumn?.("languages")).toBe("side");
    expect(sidebar.getColumn?.("certifications")).toBe("side");
    expect(sidebar.getColumn?.("references")).toBe("side");
    expect(sidebar.getColumn?.("workExperience")).toBe("main");
    expect(sidebar.getColumn?.("education")).toBe("main");
  });

  it("classic / modern-centered / timeline / academic / minimal / divided have no column partitioning", () => {
    expect(getTemplate("classic").getColumn).toBeUndefined();
    expect(getTemplate("modern-centered").getColumn).toBeUndefined();
    expect(getTemplate("timeline").getColumn).toBeUndefined();
    expect(getTemplate("academic").getColumn).toBeUndefined();
    expect(getTemplate("minimal").getColumn).toBeUndefined();
    expect(getTemplate("divided").getColumn).toBeUndefined();
  });
});
