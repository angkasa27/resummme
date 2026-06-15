import { describe, expect, it } from "vitest";

import { fitWithin } from "@/lib/image-to-data-url";

describe("fitWithin", () => {
  it("leaves dimensions within the cap unchanged (rounded)", () => {
    // Crops smaller than the cap must not be upscaled — keeps output crisp and
    // the data URL small.
    expect(fitWithin(300, 200, 512)).toEqual({ width: 300, height: 200 });
    expect(fitWithin(512, 512, 512)).toEqual({ width: 512, height: 512 });
  });

  it("scales a landscape crop by its width and preserves aspect ratio", () => {
    expect(fitWithin(1024, 512, 512)).toEqual({ width: 512, height: 256 });
  });

  it("scales a portrait crop by its height and preserves aspect ratio", () => {
    expect(fitWithin(512, 1024, 512)).toEqual({ width: 256, height: 512 });
  });

  it("scales a square crop down to the cap", () => {
    expect(fitWithin(2048, 2048, 512)).toEqual({ width: 512, height: 512 });
  });
});
