import { describe, expect, it } from "vitest";

import { normalizeCollectionItem } from "@/features/resume-editor/domain/sections/normalize-collection-item";

describe("normalizeCollectionItem", () => {
  it("fills missing fields from the template", () => {
    const template = {
      id: "",
      name: "",
      skills: [] as string[],
      count: 0,
    };

    const result = normalizeCollectionItem(
      { id: "abc", name: "Test", skills: [] as string[], count: 0 } as typeof template,
      template,
    );

    expect(result).toEqual({
      id: "abc",
      name: "Test",
      skills: [],
      count: 0,
    });
  });

  it("overrides template defaults with provided values", () => {
    const template = { id: "", name: "", skills: [] as string[] };

    const result = normalizeCollectionItem(
      { id: "abc", name: "Real Name", skills: ["JS"] },
      template,
    );

    expect(result).toEqual({ id: "abc", name: "Real Name", skills: ["JS"] });
  });

  it("coerces string fields to empty string when value is not a string", () => {
    const template = { id: "", name: "" };

    const result = normalizeCollectionItem(
      { id: 123 as never, name: null as never },
      template,
    );

    expect(result).toEqual({ id: "", name: "" });
  });

  it("coerces array fields to empty array when value is not an array", () => {
    const template = { tags: [] as string[] };

    const result = normalizeCollectionItem(
      { tags: "not-an-array" as never },
      template,
    );

    expect(result).toEqual({ tags: [] });
  });

  it("preserves unknown keys from the input", () => {
    const template = { id: "", name: "" };

    const result = normalizeCollectionItem(
      { id: "x", name: "y", extra: "z" } as unknown as typeof template,
      template,
    );

    expect(result).toEqual({ id: "x", name: "y", extra: "z" });
  });
});
