import { describe, expect, it } from "vitest";

import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import {
  cloneDraft,
  getOrderedSectionEntries,
  moveSection,
  nextOrderValue,
  reorderSectionToIndex,
  reorderSections,
  setSectionVisibilityWithOrder,
} from "@/features/resume-editor/state/draft-utils";

type ResumeSectionKey = keyof ResumeDraft["sections"];

const ALL_SECTION_KEYS: ResumeSectionKey[] = [
  "summary",
  "workExperience",
  "skills",
  "projects",
  "education",
  "publications",
  "certifications",
  "awards",
  "languages",
  "references",
  "organizationVolunteering",
];

function makeSections(
  overrides: Partial<
    Record<ResumeSectionKey, { order?: number; visible?: boolean }>
  >,
): ResumeDraft["sections"] {
  const sections: Record<string, unknown> = {};

  ALL_SECTION_KEYS.forEach((key, index) => {
    const override = overrides[key] ?? {};
    const isCollection = key !== "summary";

    sections[key] = {
      ...(isCollection ? { items: [] } : { content: "" }),
      visible: override.visible ?? true,
      order: override.order ?? 100 + index,
    };
  });

  return sections as ResumeDraft["sections"];
}

function orderedKeys(sections: ResumeDraft["sections"]): ResumeSectionKey[] {
  return getOrderedSectionEntries(sections).map(([key]) => key);
}

describe("cloneDraft", () => {
  it("produces a deep copy that does not share references", () => {
    const original = makeSections({});
    const cloned = cloneDraft(original);
    cloned.summary = { ...cloned.summary, order: 99 };

    expect(original.summary.order).toBe(100);
  });
});

describe("getOrderedSectionEntries", () => {
  it("returns entries sorted by their order field", () => {
    const sections = makeSections({
      education: { order: 0 },
      summary: { order: 1 },
      skills: { order: 2 },
    });

    const entries = getOrderedSectionEntries(sections);

    expect(entries[0][0]).toBe("education");
    expect(entries[0][1].order).toBe(0);
    expect(entries[1][0]).toBe("summary");
    expect(entries[1][1].order).toBe(1);
    expect(entries[2][0]).toBe("skills");
    expect(entries[2][1].order).toBe(2);
  });
});

describe("reorderSections", () => {
  it("inserts the section at the position matching its order value", () => {
    const sections = makeSections({
      summary: { order: 0 },
      workExperience: { order: 1 },
      education: { order: 2 },
    });
    const reordered = { ...sections.workExperience, order: 2 };

    const result = reorderSections(sections, "workExperience", reordered);

    expect(orderedKeys(result).slice(0, 3)).toEqual([
      "summary",
      "education",
      "workExperience",
    ]);
  });

  it("clamps out-of-bounds order to the last position", () => {
    const sections = makeSections({
      summary: { order: 0 },
      workExperience: { order: 1 },
      education: { order: 2 },
    });
    const reordered = { ...sections.summary, order: 99 };

    const result = reorderSections(sections, "summary", reordered);

    const keys = orderedKeys(result);
    expect(keys[0]).toBe("workExperience");
    expect(keys[1]).toBe("education");
    expect(keys[keys.length - 1]).toBe("summary");
  });
});

describe("reorderSectionToIndex", () => {
  it("moves a section to a specific index", () => {
    const sections = makeSections({
      summary: { order: 0 },
      workExperience: { order: 1 },
      education: { order: 2 },
      projects: { order: 3 },
    });

    const result = reorderSectionToIndex(sections, "education", 0);

    expect(orderedKeys(result).slice(0, 4)).toEqual([
      "education",
      "summary",
      "workExperience",
      "projects",
    ]);
  });

  it("clamps negative index to zero", () => {
    const sections = makeSections({
      summary: { order: 0 },
      workExperience: { order: 1 },
    });

    const result = reorderSectionToIndex(sections, "workExperience", -5);

    expect(orderedKeys(result).slice(0, 2)).toEqual([
      "workExperience",
      "summary",
    ]);
  });

  it("returns sections unchanged when the target is already at the given index", () => {
    const sections = makeSections({
      summary: { order: 0 },
      workExperience: { order: 1 },
    });

    const result = reorderSectionToIndex(sections, "summary", 0);

    expect(result).toBe(sections);
  });

  it("returns sections unchanged when the section key is not found", () => {
    const sections = makeSections({ summary: { order: 0 } });

    const result = reorderSectionToIndex(
      sections,
      "nonexistent" as ResumeSectionKey,
      0,
    );

    expect(result).toBe(sections);
  });
});

describe("moveSection", () => {
  it("moves a section up by one position", () => {
    const sections = makeSections({
      summary: { order: 0 },
      workExperience: { order: 1 },
      education: { order: 2 },
    });

    const result = moveSection(sections, "education", -1);

    expect(orderedKeys(result).slice(0, 3)).toEqual([
      "summary",
      "education",
      "workExperience",
    ]);
  });

  it("moves a section down by one position", () => {
    const sections = makeSections({
      summary: { order: 0 },
      workExperience: { order: 1 },
      education: { order: 2 },
    });

    const result = moveSection(sections, "summary", 1);

    expect(orderedKeys(result).slice(0, 3)).toEqual([
      "workExperience",
      "summary",
      "education",
    ]);
  });

  it("returns sections unchanged when moving up from the top", () => {
    const sections = makeSections({
      summary: { order: 0 },
      workExperience: { order: 1 },
    });

    const result = moveSection(sections, "summary", -1);

    expect(result).toBe(sections);
  });

  it("returns sections unchanged when moving down from the bottom", () => {
    const sections = makeSections({});
    const keys = orderedKeys(sections);
    const lastKey = keys[keys.length - 1];

    const result = moveSection(sections, lastKey, 1);

    expect(result).toBe(sections);
  });

  it("returns sections unchanged when the section key is not found", () => {
    const sections = makeSections({ summary: { order: 0 } });

    const result = moveSection(
      sections,
      "nonexistent" as ResumeSectionKey,
      1,
    );

    expect(result).toBe(sections);
  });
});

describe("setSectionVisibilityWithOrder", () => {
  it("hides a visible section and places it after remaining visible sections", () => {
    const sections = makeSections({
      summary: { order: 0, visible: true },
      workExperience: { order: 1, visible: true },
      projects: { order: 2, visible: true },
    });
    // Everything else stays visible by default

    const result = setSectionVisibilityWithOrder(sections, "projects", false);

    const entries = getOrderedSectionEntries(result);
    expect(entries[0][0]).toBe("summary");
    expect(entries[1][0]).toBe("workExperience");

    const idx = entries.findIndex(([k]) => k === "projects");
    expect(entries[idx][1].visible).toBe(false);
    // projects moved after all visible sections
    const visibleAfterProjects = entries
      .slice(idx + 1)
      .filter(([, v]) => v.visible);
    expect(visibleAfterProjects).toHaveLength(0);
  });

  it("shows a hidden section and places it after visible sections", () => {
    const sections = makeSections({
      summary: { order: 0, visible: true },
      workExperience: { order: 1, visible: true },
      projects: { order: 2, visible: false },
    });
    // Everything else stays visible by default

    const result = setSectionVisibilityWithOrder(sections, "projects", true);

    const entries = getOrderedSectionEntries(result);
    expect(entries[0][0]).toBe("summary");
    expect(entries[1][0]).toBe("workExperience");

    const idx = entries.findIndex(([k]) => k === "projects");
    expect(entries[idx][1].visible).toBe(true);
    // projects moved after all visible sections
    const visibleAfterProjects = entries
      .slice(idx + 1)
      .filter(([, v]) => v.visible);
    expect(visibleAfterProjects).toHaveLength(0);
  });
});

describe("nextOrderValue", () => {
  it("increments by +1", () => {
    expect(nextOrderValue(5, 1, 10)).toBe(6);
  });

  it("decrements by -1", () => {
    expect(nextOrderValue(5, -1, 10)).toBe(4);
  });

  it("clamps above max", () => {
    expect(nextOrderValue(10, 1, 10)).toBe(10);
  });

  it("clamps below zero", () => {
    expect(nextOrderValue(0, -1, 10)).toBe(0);
  });
});
