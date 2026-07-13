import { describe, expect, it } from "vitest";

import {
  getTemplate,
  previewTemplateDefinitions,
  shouldHideSummaryHeading,
} from "@/features/resume-editor/preview/template-registry";

describe("preview template registry", () => {
  it("exposes all eleven built-in templates", () => {
    const ids = previewTemplateDefinitions.map((template) => template.id);
    expect(ids).toEqual([
      "classic",
      "sidebar",
      "modern-centered",
      "timeline",
      "academic",
      "minimal",
      "inset",
      "banner",
      "split",
      "tinted",
      "bold-type",
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
      "banner",
      "split",
      "tinted",
      "bold-type",
    ] as const) {
      expect(getTemplate(id).id).toBe(id);
    }
  });

  it("falls back to classic when an unknown template id is requested", () => {
    expect(getTemplate("missing" as never).id).toBe("classic");
  });

  it("partitions sections into side and main columns in the sidebar and split templates", () => {
    for (const id of ["sidebar", "split"] as const) {
      const template = getTemplate(id);
      expect(template.getColumn?.("skills")).toBe("side");
      expect(template.getColumn?.("languages")).toBe("side");
      expect(template.getColumn?.("certifications")).toBe("side");
      expect(template.getColumn?.("references")).toBe("side");
      expect(template.getColumn?.("workExperience")).toBe("main");
      expect(template.getColumn?.("education")).toBe("main");
    }
  });

  it("marks only classic, timeline, and banner as hiding the summary heading", () => {
    // The templates that render their own Summary heading; the shared
    // SummaryView must suppress its <h2> for exactly these.
    const hiding = previewTemplateDefinitions
      .filter((template) => template.hideSummaryHeading === true)
      .map((template) => template.id);
    expect(hiding.sort()).toEqual(["banner", "classic", "timeline"]);
  });

  it("shouldHideSummaryHeading derives from the template definition", () => {
    expect(shouldHideSummaryHeading("classic")).toBe(true);
    expect(shouldHideSummaryHeading("timeline")).toBe(true);
    expect(shouldHideSummaryHeading("banner")).toBe(true);
    expect(shouldHideSummaryHeading("sidebar")).toBe(false);
    expect(shouldHideSummaryHeading("minimal")).toBe(false);
  });

  it("single-column templates have no column partitioning", () => {
    expect(getTemplate("classic").getColumn).toBeUndefined();
    expect(getTemplate("modern-centered").getColumn).toBeUndefined();
    expect(getTemplate("timeline").getColumn).toBeUndefined();
    expect(getTemplate("academic").getColumn).toBeUndefined();
    expect(getTemplate("minimal").getColumn).toBeUndefined();
    expect(getTemplate("inset").getColumn).toBeUndefined();
    expect(getTemplate("banner").getColumn).toBeUndefined();
    expect(getTemplate("tinted").getColumn).toBeUndefined();
    expect(getTemplate("bold-type").getColumn).toBeUndefined();
  });
});
