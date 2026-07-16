import { describe, expect, it } from "vitest";

import {
  createDefaultPdfPresentation,
  DEFAULT_ACCENT,
  getEffectiveSecondary,
  getPageMarginMm,
  getPaperDimensionsMm,
  isValidAccentHex,
  normalizePdfPresentation,
  resolvePdfPresentation,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";

describe("createDefaultPdfPresentation", () => {
  it("returns classic layout with standard sizing", () => {
    const result = createDefaultPdfPresentation();

    expect(result.layoutId).toBe("classic");
    expect(result.fontScale).toBe("md");
    expect(result.spacing).toBe("standard");
    expect(result.lineHeight).toBe("standard");
    expect(result.accent).toBe(DEFAULT_ACCENT);
    expect(result.paperSize).toBe("a4");
  });
});

describe("isValidAccentHex", () => {
  it("accepts 6-digit hex colors", () => {
    expect(isValidAccentHex("#2563eb")).toBe(true);
    expect(isValidAccentHex("#ff0000")).toBe(true);
    expect(isValidAccentHex("#aBcDeF")).toBe(true);
  });

  it("rejects non-hex values", () => {
    expect(isValidAccentHex("red")).toBe(false);
    expect(isValidAccentHex("#fff")).toBe(false);
    expect(isValidAccentHex("#12345")).toBe(false);
    expect(isValidAccentHex("#1234567")).toBe(false);
    expect(isValidAccentHex(123)).toBe(false);
    expect(isValidAccentHex(null)).toBe(false);
    expect(isValidAccentHex(undefined)).toBe(false);
  });
});

describe("getPaperDimensionsMm", () => {
  it("returns A4 dimensions", () => {
    expect(getPaperDimensionsMm("a4")).toEqual({
      widthMm: 210,
      heightMm: 297,
    });
  });

  it("returns Letter dimensions", () => {
    expect(getPaperDimensionsMm("letter")).toEqual({
      widthMm: 215.9,
      heightMm: 279.4,
    });
  });
});

describe("getPageMarginMm", () => {
  it("gives rail layouts a tighter margin than typographic ones", () => {
    // The whole reason the margin moved from a user knob onto the layout: a
    // 0.36fr rail and a whitespace-led page cannot share one value.
    expect(getPageMarginMm("split", "standard")).toBeLessThan(
      getPageMarginMm("minimal", "standard"),
    );
  });

  it("scales with spacing", () => {
    expect(getPageMarginMm("classic", "standard")).toBe(14);
    expect(getPageMarginMm("classic", "compact")).toBe(11.9);
    expect(getPageMarginMm("classic", "airy")).toBe(16.1);
  });
});

describe("normalizePdfPresentation", () => {
  it("returns defaults for null/undefined input", () => {
    expect(normalizePdfPresentation(null).layoutId).toBe("classic");
    expect(normalizePdfPresentation(undefined).layoutId).toBe("classic");
  });

  it("returns defaults for non-object input", () => {
    expect(normalizePdfPresentation("bad").layoutId).toBe("classic");
  });

  it("passes through valid values", () => {
    const result = normalizePdfPresentation({ layoutId: "sidebar" });
    expect(result.layoutId).toBe("sidebar");
  });

  it("remaps a retired layout id to its successor rather than the default", () => {
    // A draft saved on `tinted` must land on sidebar, not fall through to the
    // classic default — the user picked a tinted surface and sidebar's rail
    // still has one.
    expect(normalizePdfPresentation({ layoutId: "tinted" }).layoutId).toBe(
      "sidebar",
    );
  });

  it("falls back to defaults for invalid values", () => {
    const result = normalizePdfPresentation({
      layoutId: "nonexistent",
      fontScale: "xxl",
      paperSize: "tabloid",
    });
    expect(result.layoutId).toBe("classic");
    expect(result.fontScale).toBe("md");
    expect(result.paperSize).toBe("a4");
  });

  it("validates accent hex", () => {
    expect(
      normalizePdfPresentation({ accent: "red" }).accent,
    ).toBe(DEFAULT_ACCENT);
    expect(
      normalizePdfPresentation({ accent: "#ff0000" }).accent,
    ).toBe("#ff0000");
  });

  it("passes through a valid secondary and drops invalid ones", () => {
    expect(
      normalizePdfPresentation({ secondary: "#10b981" }).secondary,
    ).toBe("#10b981");
    expect(normalizePdfPresentation({ secondary: "green" }).secondary)
      .toBeUndefined();
    expect(normalizePdfPresentation({}).secondary).toBeUndefined();
  });

  it("passes through a valid photoShape and drops invalid/absent ones", () => {
    expect(normalizePdfPresentation({ photoShape: "circle" }).photoShape).toBe(
      "circle",
    );
    expect(
      normalizePdfPresentation({ photoShape: "oval" }).photoShape,
    ).toBeUndefined();
    expect(normalizePdfPresentation({}).photoShape).toBeUndefined();
  });
});

describe("getEffectiveSecondary", () => {
  it("falls back to the accent when secondary is unset", () => {
    const base = createDefaultPdfPresentation();
    expect(getEffectiveSecondary(base)).toBe(base.accent);
    expect(
      getEffectiveSecondary({ ...base, secondary: "#10b981" }),
    ).toBe("#10b981");
  });
});

describe("resolvePdfPresentation", () => {
  it("returns a layout ID and CSS variables", () => {
    const result = resolvePdfPresentation();

    expect(result.layoutId).toBe("classic");
    expect(result.vars).toBeDefined();
    expect(result.vars["--resume-font"]).toBeDefined();
    expect(result.vars["--resume-body"]).toBeDefined();
    expect(result.vars["--resume-leading"]).toBeDefined();
    expect(result.vars["--resume-accent"]).toBe(DEFAULT_ACCENT);
    expect(result.vars["--resume-paper-width"]).toBe("210mm");
    expect(result.vars["--resume-paper-height"]).toBe("297mm");
    expect(result.vars["--resume-page-margin"]).toBe("14mm");
    expect(result.vars["--resume-gutter"]).toBe("26px");
  });

  it("derives the page margin from the layout, not a user setting", () => {
    const base = createDefaultPdfPresentation();
    const split = resolvePdfPresentation({ ...base, layoutId: "split" });
    const minimal = resolvePdfPresentation({ ...base, layoutId: "minimal" });
    expect(split.vars["--resume-page-margin"]).toBe("9mm");
    expect(minimal.vars["--resume-page-margin"]).toBe("18mm");
  });

  it("keeps the gutter independent of the page margin", () => {
    // Two layouts with different margins must still share a gutter at the same
    // density — conflating the two is what skewed the rail padding.
    const base = createDefaultPdfPresentation();
    const split = resolvePdfPresentation({ ...base, layoutId: "split" });
    const minimal = resolvePdfPresentation({ ...base, layoutId: "minimal" });
    expect(split.vars["--resume-gutter"]).toBe(minimal.vars["--resume-gutter"]);
  });

  it("emits paper dimensions for the selected paper size", () => {
    const result = resolvePdfPresentation({
      ...createDefaultPdfPresentation(),
      paperSize: "letter",
    });

    expect(result.vars["--resume-paper-width"]).toBe("215.9mm");
    expect(result.vars["--resume-paper-height"]).toBe("279.4mm");
  });

  it("sets font-size based on fontScale", () => {
    const base = createDefaultPdfPresentation();
    const sm = resolvePdfPresentation({ ...base, fontScale: "sm" });
    const md = resolvePdfPresentation({ ...base, fontScale: "md" });
    const lg = resolvePdfPresentation({ ...base, fontScale: "lg" });

    expect(sm.vars["--resume-body"]).toBe("11px");
    expect(md.vars["--resume-body"]).toBe("12px");
    expect(lg.vars["--resume-body"]).toBe("14px");
  });

  it("makes section headings larger than item titles", () => {
    const result = resolvePdfPresentation();

    expect(parseFloat(result.vars["--resume-h2"])).toBeGreaterThan(
      parseFloat(result.vars["--resume-h3"]),
    );
  });

  it("emits secondary, tint, on-accent, meta, and indent variables", () => {
    const base = createDefaultPdfPresentation();
    const result = resolvePdfPresentation({ ...base, secondary: "#10b981" });

    expect(result.vars["--resume-secondary"]).toBe("#10b981");
    expect(result.vars["--resume-secondary-tint"]).toMatch(/^#[0-9a-f]{6}$/);
    expect(result.vars["--resume-on-accent"]).toBe("#ffffff");
    expect(result.vars["--resume-meta"]).toBeDefined();
    expect(result.vars["--resume-indent"]).toBe("14px");
  });

  it("defaults the secondary variable to the accent", () => {
    const result = resolvePdfPresentation();

    expect(result.vars["--resume-secondary"]).toBe(DEFAULT_ACCENT);
  });

  describe("photo shape", () => {
    const base = createDefaultPdfPresentation();

    it("emits no photo vars when photoShape is unset (layouts keep native look)", () => {
      const result = resolvePdfPresentation(base);

      expect(result.vars["--resume-photo-aspect"]).toBeUndefined();
      expect(result.vars["--resume-photo-radius"]).toBeUndefined();
    });

    it("circle forces a 1:1 aspect and a 50% radius", () => {
      const result = resolvePdfPresentation({ ...base, photoShape: "circle" });

      expect(result.vars["--resume-photo-aspect"]).toBe("1 / 1");
      expect(result.vars["--resume-photo-radius"]).toBe("50%");
    });

    it("square is 1:1 with a small sharp-cornered radius (not circular)", () => {
      const result = resolvePdfPresentation({ ...base, photoShape: "square" });

      expect(result.vars["--resume-photo-aspect"]).toBe("1 / 1");
      expect(result.vars["--resume-photo-radius"]).toBe("6px");
    });

    it("rectangle is portrait 3:4 with a small sharp-cornered radius", () => {
      const result = resolvePdfPresentation({
        ...base,
        photoShape: "rectangle",
      });

      expect(result.vars["--resume-photo-aspect"]).toBe("3 / 4");
      expect(result.vars["--resume-photo-radius"]).toBe("6px");
    });
  });
});
