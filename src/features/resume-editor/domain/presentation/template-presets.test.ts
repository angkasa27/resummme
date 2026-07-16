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

  it("curates secondary only for the layouts that render it", () => {
    // Only modern-centered (rule under the name), sidebar (rail tint) and split
    // (rail fill) read --resume-secondary. Setting it anywhere else is data the
    // page cannot show, yet getActiveTemplatePresetId still matches on it — so
    // an invisible field would silently decide whether a template looks active.
    const RENDERS_SECONDARY = new Set(["modern-centered", "sidebar", "split"]);
    for (const preset of resumeTemplatePresets) {
      if (preset.style.secondary) {
        expect(
          RENDERS_SECONDARY.has(preset.layoutId),
          `${preset.id} sets a secondary that ${preset.layoutId} never renders`,
        ).toBe(true);
      }
    }
  });

  it("keeps bold-type's accent vivid, since it is the highlighter", () => {
    // bold-type spends accent on the marker highlight behind each heading
    // (at 30% alpha) and on the dates — not on heading text. A near-black
    // accent there reads as a grey smudge rather than a highlight.
    const luminance = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    };
    for (const preset of resumeTemplatePresets) {
      if (preset.layoutId !== "bold-type") continue;
      expect(
        luminance(preset.style.accent),
        `${preset.id} accent is too dark to read as a highlight`,
      ).toBeGreaterThan(0.2);
    }
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
