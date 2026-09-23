import { describe, expect, it } from "vitest";

import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import {
  getOrderedSectionEntries,
  moveSectionToAnchor,
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

  // The store detects changes by reference; mutating the input would skip the re-render and the save.
  it("returns new sections and leaves the input untouched", () => {
    const sections = makeSections({
      summary: { order: 0 },
      workExperience: { order: 1 },
    });
    const before = structuredClone(sections);

    const result = reorderSections(sections, "summary", { ...sections.summary, order: 1 });

    expect(result).not.toBe(sections);
    expect(result.workExperience).not.toBe(sections.workExperience);
    expect(sections).toEqual(before);
  });
});

describe("moveSectionToAnchor", () => {
  // Why: "move down" anchors on the next visible sibling; the old index API silently
  // no-opped here — anchor semantics must move the section past its downward neighbor.
  it("moving onto a lower sibling lands the section after it", () => {
    const sections = makeSections({
      summary: { order: 0 },
      workExperience: { order: 1 },
      skills: { order: 2 },
      projects: { order: 3 },
    });

    const result = moveSectionToAnchor(sections, "workExperience", "skills");

    expect(orderedKeys(result).slice(0, 4)).toEqual([
      "summary",
      "skills",
      "workExperience",
      "projects",
    ]);
  });

  // Why: the old "move up" code overshot by one — landing on an upper anchor must
  // put the section immediately before it, one step never two.
  it("moving onto an upper sibling lands the section before it", () => {
    const sections = makeSections({
      summary: { order: 0 },
      workExperience: { order: 1 },
      skills: { order: 2 },
      projects: { order: 3 },
    });

    const result = moveSectionToAnchor(sections, "projects", "skills");

    expect(orderedKeys(result).slice(0, 4)).toEqual([
      "summary",
      "workExperience",
      "projects",
      "skills",
    ]);
  });

  // Why: order is one global space including hidden sections, but the user only
  // reorders visible ones — an anchor two slots away must still be landed beside.
  it("ignores hidden sections sitting between target and anchor", () => {
    const sections = makeSections({
      summary: { order: 0, visible: true },
      workExperience: { order: 1, visible: true },
      skills: { order: 2, visible: false },
      projects: { order: 3, visible: true },
    });

    // Visible order is [workExperience, projects]; moving projects up anchors
    // on workExperience even though hidden "skills" is between them globally.
    const result = moveSectionToAnchor(sections, "projects", "workExperience");

    const visibleOrder = orderedKeys(result).filter(
      (key) => result[key].visible,
    );
    expect(visibleOrder.slice(0, 3)).toEqual([
      "summary",
      "projects",
      "workExperience",
    ]);
  });

  it("returns sections unchanged when target and anchor are the same", () => {
    const sections = makeSections({ summary: { order: 0 } });

    const result = moveSectionToAnchor(sections, "summary", "summary");

    expect(result).toBe(sections);
  });

  it("returns sections unchanged when a key is not found", () => {
    const sections = makeSections({ summary: { order: 0 } });

    const result = moveSectionToAnchor(
      sections,
      "summary",
      "nonexistent" as ResumeSectionKey,
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
    

    const result = setSectionVisibilityWithOrder(sections, "projects", false);

    const entries = getOrderedSectionEntries(result);
    expect(entries[0][0]).toBe("summary");
    expect(entries[1][0]).toBe("workExperience");

    const idx = entries.findIndex(([k]) => k === "projects");
    expect(entries[idx][1].visible).toBe(false);
    
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
    

    const result = setSectionVisibilityWithOrder(sections, "projects", true);

    const entries = getOrderedSectionEntries(result);
    expect(entries[0][0]).toBe("summary");
    expect(entries[1][0]).toBe("workExperience");

    const idx = entries.findIndex(([k]) => k === "projects");
    expect(entries[idx][1].visible).toBe(true);
    
    const visibleAfterProjects = entries
      .slice(idx + 1)
      .filter(([, v]) => v.visible);
    expect(visibleAfterProjects).toHaveLength(0);
  });
});
