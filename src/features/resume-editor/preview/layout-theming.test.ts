import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { pdfLayoutIds } from "@/features/resume-editor/domain/presentation/pdf-presentation";

const layoutCss = (layoutId: string) =>
  readFileSync(join(__dirname, "layouts", layoutId, "styles.module.css"), "utf8");

/**
 * These read the layout stylesheets as text. That is blunt, but the thing worth
 * protecting is a cross-cutting contract — "the colour a user picks must land
 * somewhere on every layout" — and there is no cheaper place to assert it.
 */
describe("layout theming contract", () => {
  it("spends the accent somewhere on every layout", () => {
    // The accent picker must never be a no-op. A layout either paints with
    // --resume-accent itself, or leaves the shared heading rule alone so the
    // heading takes it. Overriding BOTH the name and the heading to text and
    // never touching accent (as academic once did) renders the control dead and
    // makes every accent in that layout's presets invisible data.
    for (const layoutId of pdfLayoutIds) {
      const css = layoutCss(layoutId);
      const paintsAccent = css.includes("--resume-accent");
      const headingTakesAccent = !css.includes("--resume-heading-color");
      expect(
        paintsAccent || headingTakesAccent,
        `${layoutId} renders the accent nowhere: it overrides the heading colour and never uses --resume-accent`,
      ).toBe(true);
    }
  });

  it("never pins a font, which would override the user's choice", () => {
    // academic hardcoded --resume-font: Georgia, silently making the Style tab's
    // font control a no-op there and any preset naming another serif dead data.
    for (const layoutId of pdfLayoutIds) {
      expect(
        layoutCss(layoutId),
        `${layoutId} sets --resume-font, overriding the user's font choice`,
      ).not.toContain("--resume-font:");
    }
  });
});
