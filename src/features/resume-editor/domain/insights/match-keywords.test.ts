import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";

import { matchKeywords } from "./match-keywords";

function draftWithSkills(...skills: string[]) {
  const draft = createDefaultResumeDraft();
  draft.sections.skills.items = [
    {
      id: "skill-1",
      categoryName: "Frontend",
      skills,
    },
  ];
  return draft;
}

describe("matchKeywords", () => {
  it("marks present keywords as matched and absent ones as missing", () => {
    const draft = draftWithSkills("React", "TypeScript", "Tailwind");
    const result = matchKeywords(draft, "...", [
      { term: "React", category: "hard-skill", weight: 1 },
      { term: "GraphQL", category: "hard-skill", weight: 1 },
    ]);

    expect(result.matched.map((m) => m.term)).toEqual(["React"]);
    expect(result.missing.map((m) => m.term)).toEqual(["GraphQL"]);
    expect(result.coverage).toBe(0.5);
  });

  it("respects keyword weights when computing coverage", () => {
    const draft = draftWithSkills("React");
    const result = matchKeywords(draft, "...", [
      { term: "React", category: "hard-skill", weight: 1 },
      { term: "Kubernetes", category: "tool", weight: 3 },
    ]);

    // 1 / (1 + 3) = 0.25
    expect(result.coverage).toBe(0.25);
  });

  it("matches via the alias map (JS ↔ JavaScript)", () => {
    const draft = draftWithSkills("JavaScript");
    const result = matchKeywords(draft, "...", [
      { term: "JS", category: "hard-skill", weight: 1 },
    ]);
    expect(result.matched).toHaveLength(1);
  });

  it("uses word boundaries (does not match substrings)", () => {
    // Use a synthetic probe ("solidipotent") so the default lorem-ipsum
    // resume content can't accidentally satisfy the substring.
    const draft = draftWithSkills("Solidipotent");
    const result = matchKeywords(draft, "...", [
      { term: "Solid", category: "hard-skill", weight: 1 },
    ]);
    expect(result.missing).toHaveLength(1);
  });

  it("returns zero coverage with no keywords", () => {
    const draft = createDefaultResumeDraft();
    expect(matchKeywords(draft, "", []).coverage).toBe(0);
  });
});
