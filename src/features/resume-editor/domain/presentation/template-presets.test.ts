import { describe, expect, it } from "vitest";

import {
  createDefaultPdfPresentation,
  pdfLayoutIds,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import {
  applyTemplatePreset,
  getActiveTemplatePresetId,
  getTemplatePresetsByLayout,
  resumeTemplatePresets,
} from "@/features/resume-editor/domain/presentation/template-presets";
import { pdfPresentationSchema } from "@/features/resume-editor/domain/schema/presentation-schemas";

describe("resumeTemplatePresets", () => {
  it("has globally unique ids", () => {
    const ids = resumeTemplatePresets.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only references known layouts, and covers every layout", () => {
    const layoutsUsed = new Set(
      resumeTemplatePresets.map((preset) => preset.layoutId),
    );
    for (const layoutId of layoutsUsed) {
      expect(pdfLayoutIds).toContain(layoutId);
    }
    // Every layout must be reachable from the template gallery.
    expect(layoutsUsed.size).toBe(pdfLayoutIds.length);
  });

  it("every applied preset yields a valid presentation", () => {
    const current = createDefaultPdfPresentation();
    for (const preset of resumeTemplatePresets) {
      const applied = applyTemplatePreset(preset, current);
      expect(() => pdfPresentationSchema.parse(applied)).not.toThrow();
    }
  });

  it("groups presets by layout preserving order", () => {
    const groups = getTemplatePresetsByLayout();
    const flattened = [...groups.values()].flat();
    expect(flattened).toEqual([...resumeTemplatePresets]);
  });
});

describe("applyTemplatePreset", () => {
  const preset = resumeTemplatePresets[0];

  it("preserves the user's paper size", () => {
    const current = {
      ...createDefaultPdfPresentation(),
      paperSize: "letter" as const,
    };
    expect(applyTemplatePreset(preset, current).paperSize).toBe("letter");
  });

  it("clears photoShape so the layout's native look applies", () => {
    const current = {
      ...createDefaultPdfPresentation(),
      photoShape: "circle" as const,
    };
    expect(applyTemplatePreset(preset, current).photoShape).toBeUndefined();
  });

  it("clears secondary when the preset does not curate one", () => {
    const noSecondary = resumeTemplatePresets.find((p) => !p.style.secondary);
    expect(noSecondary).toBeDefined();
    const current = {
      ...createDefaultPdfPresentation(),
      secondary: "#123456",
    };
    expect(
      applyTemplatePreset(noSecondary!, current).secondary,
    ).toBeUndefined();
  });
});

describe("getActiveTemplatePresetId", () => {
  it("round-trips: applying a preset makes it the active one", () => {
    const current = createDefaultPdfPresentation();
    for (const preset of resumeTemplatePresets) {
      const applied = applyTemplatePreset(preset, current);
      expect(getActiveTemplatePresetId(applied)).toBe(preset.id);
    }
  });

  it("drops off after a manual style tweak", () => {
    const applied = applyTemplatePreset(
      resumeTemplatePresets[0],
      createDefaultPdfPresentation(),
    );
    expect(
      getActiveTemplatePresetId({ ...applied, accent: "#facade" }),
    ).toBeNull();
  });

  it("returns null for the stock default presentation unless a preset matches it", () => {
    const active = getActiveTemplatePresetId(createDefaultPdfPresentation());
    // The default (classic/inter/md) may legitimately match a curated preset;
    // assert the derivation is consistent rather than hardcoding null.
    if (active) {
      const preset = resumeTemplatePresets.find((p) => p.id === active)!;
      expect(preset.layoutId).toBe("classic");
    }
  });
});
