import { describe, expect, it } from "vitest";

import {
  mixHex,
  readableTextOn,
  tintHex,
} from "@/features/resume-editor/domain/presentation/color-utils";

describe("mixHex", () => {
  it("returns the first color at weight 0 and the second at weight 1", () => {
    expect(mixHex("#2563eb", "#ffffff", 0)).toBe("#2563eb");
    expect(mixHex("#2563eb", "#ffffff", 1)).toBe("#ffffff");
  });

  it("mixes channels linearly", () => {
    expect(mixHex("#000000", "#ffffff", 0.5)).toBe("#808080");
  });

  it("clamps weight outside [0, 1]", () => {
    expect(mixHex("#000000", "#ffffff", -1)).toBe("#000000");
    expect(mixHex("#000000", "#ffffff", 2)).toBe("#ffffff");
  });
});

describe("tintHex", () => {
  it("lightens toward white", () => {
    expect(tintHex("#2563eb", 0)).toBe("#2563eb");
    expect(tintHex("#2563eb", 1)).toBe("#ffffff");
  });

  it("produces a pale tint at high ratios", () => {
    // 90% white keeps a hint of the hue — used for chip/panel backgrounds.
    expect(tintHex("#2563eb", 0.9)).toBe("#e9effd");
  });
});

describe("readableTextOn", () => {
  it("returns white text on dark fills", () => {
    expect(readableTextOn("#1e3a5f")).toBe("#ffffff");
    expect(readableTextOn("#2563eb")).toBe("#ffffff");
    expect(readableTextOn("#111827")).toBe("#ffffff");
  });

  it("returns dark text on light fills", () => {
    expect(readableTextOn("#ffffff")).toBe("#111827");
    expect(readableTextOn("#fbbf24")).toBe("#111827");
  });
});
