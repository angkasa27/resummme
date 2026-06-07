import { describe, expect, it } from "vitest";

import {
  RESUME_FONTS,
  getFont,
  type ResumeFontId,
} from "@/features/resume-editor/domain/presentation/font-collection";

describe("getFont", () => {
  it("resolves a valid font by id", () => {
    const font = getFont("inter");
    expect(font.name).toBe("Inter");
    expect(font.stack).toContain("--font-sans");
  });

  it("returns the first font for unknown ids", () => {
    const result = getFont("comic-sans" as ResumeFontId);
    expect(result.id).toBe("inter");
  });
});

describe("RESUME_FONTS", () => {
  it("exposes at least 10 fonts", () => {
    expect(RESUME_FONTS.length).toBeGreaterThanOrEqual(10);
  });

  it("each font has required fields", () => {
    for (const font of RESUME_FONTS) {
      expect(font.id).toBeDefined();
      expect(font.name).toBeDefined();
      expect(font.category).toMatch(/^(sans|serif)$/);
      expect(font.source).toMatch(/^(google|system)$/);
    }
  });
});
