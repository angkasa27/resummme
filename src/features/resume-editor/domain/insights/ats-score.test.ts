import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";

import { computeAtsScore } from "./ats-score";
import type { JobMatchResult } from "./match-keywords";

function getCategoryPct(
  score: ReturnType<typeof computeAtsScore>,
  category: "parseability" | "content" | "completeness" | "length" | "jobMatch",
) {
  return score.breakdown[category]?.pct ?? 0;
}

describe("computeAtsScore", () => {
  it("returns a 0-100 score for the default draft", () => {
    const result = computeAtsScore(createDefaultResumeDraft());
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.breakdown.jobMatch).toBeNull();
  });

  it("docks parseability when switching to the sidebar layout", () => {
    const classic = createDefaultResumeDraft();
    classic.pdfPresentation.layoutId = "classic";
    const sidebar = createDefaultResumeDraft();
    sidebar.pdfPresentation.layoutId = "sidebar";

    expect(getCategoryPct(computeAtsScore(classic), "parseability")).toBe(100);
    expect(getCategoryPct(computeAtsScore(sidebar), "parseability")).toBe(55);
    expect(
      computeAtsScore(sidebar).suggestions.some(
        (s) => s.id === "parseability/sidebar-layout",
      ),
    ).toBe(true);
  });

  it("flags missing email as a failing completeness suggestion", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.email = "";

    const result = computeAtsScore(draft);
    expect(
      result.suggestions.some(
        (s) => s.id === "completeness/email" && s.severity === "fail",
      ),
    ).toBe(true);
  });

  it("rewards quantified bullets in content quality", () => {
    const without = createDefaultResumeDraft();
    without.sections.workExperience.items = [
      {
        id: "we-1",
        companyName: "Acme",
        position: "Engineer",
        location: "Remote",
        startDate: "Jan 2024",
        endDate: "current",
        description: "<ul><li>Worked on features</li></ul>",
      },
    ];

    const withImpact = createDefaultResumeDraft();
    withImpact.sections.workExperience.items = [
      {
        id: "we-1",
        companyName: "Acme",
        position: "Engineer",
        location: "Remote",
        startDate: "Jan 2024",
        endDate: "current",
        description:
          "<ul><li>Led migration that cut p95 latency by 40%</li><li>Shipped onboarding revamp lifting activation 22%</li></ul>",
      },
    ];

    expect(getCategoryPct(computeAtsScore(withImpact), "content")).toBeGreaterThan(
      getCategoryPct(computeAtsScore(without), "content"),
    );
  });

  it("includes Job Match in the breakdown when a jobMatch is provided", () => {
    const jobMatch: JobMatchResult = {
      jobDescription: "Senior engineer with React + Node experience",
      keywords: [
        { term: "React", category: "hard-skill", weight: 1 },
        { term: "Node", category: "hard-skill", weight: 1 },
      ],
      matched: [{ term: "React", category: "hard-skill", weight: 1 }],
      missing: [{ term: "Node", category: "hard-skill", weight: 1 }],
      coverage: 0.5,
    };

    const result = computeAtsScore(createDefaultResumeDraft(), jobMatch);
    expect(result.breakdown.jobMatch).not.toBeNull();
    expect(result.breakdown.jobMatch?.pct).toBe(50);
    expect(
      result.suggestions.some((s) => s.id === "jobMatch/missing"),
    ).toBe(true);
  });

  it("sorts suggestions with fail first, then warn, then ok", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.email = ""; // fail
    draft.profile.phone = ""; // warn

    const severities = computeAtsScore(draft).suggestions.map((s) => s.severity);
    const failIndex = severities.indexOf("fail");
    const warnIndex = severities.indexOf("warn");
    expect(failIndex).toBeGreaterThanOrEqual(0);
    expect(warnIndex).toBeGreaterThan(failIndex);
  });
});
