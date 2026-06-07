import { describe, expect, it } from "vitest";

import {
  getTemplate,
  previewTemplateDefinitions,
} from "@/features/resume-editor/preview/template-registry";

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
      "inset",
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
      "inset",
    ] as const) {
      expect(getTemplate(id).id).toBe(id);
    }
  });

  it("falls back to classic when an unknown template id is requested", () => {
    expect(getTemplate("missing" as never).id).toBe("classic");
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

  it("classic / modern-centered / timeline / academic / minimal / inset have no column partitioning", () => {
    expect(getTemplate("classic").getColumn).toBeUndefined();
    expect(getTemplate("modern-centered").getColumn).toBeUndefined();
    expect(getTemplate("timeline").getColumn).toBeUndefined();
    expect(getTemplate("academic").getColumn).toBeUndefined();
    expect(getTemplate("minimal").getColumn).toBeUndefined();
    expect(getTemplate("inset").getColumn).toBeUndefined();
  });
});
