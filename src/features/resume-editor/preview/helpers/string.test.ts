import { describe, expect, it } from "vitest";

import { compactJoin, joinParts } from "@/features/resume-editor/preview/helpers/string";

describe("joinParts", () => {
  it("joins truthy values with separator", () => {
    expect(joinParts(["a", "b", "c"])).toBe("a · b · c");
  });

  it("filters out undefined and empty values", () => {
    expect(joinParts(["a", undefined, "", "c"])).toBe("a · c");
  });

  it("returns empty string for all-empty input", () => {
    expect(joinParts([undefined, ""])).toBe("");
  });
});

describe("compactJoin", () => {
  it("joins truthy values without separator", () => {
    expect(compactJoin(["a", "b", "c"])).toBe("a b c");
  });

  it("filters out undefined and empty values", () => {
    expect(compactJoin(["a", undefined, "", "c"])).toBe("a c");
  });
});
