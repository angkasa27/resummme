import {
  getPaperDimensionsMm,
  getPageMarginMm,
  normalizePdfPresentation,
  type PdfTemplateId,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

import { extractAllBullets } from "./extract-text";
import type { JobMatchResult } from "./match-keywords";

export const ATS_CATEGORIES = [
  "parseability",
  "content",
  "completeness",
  "length",
  "jobMatch",
] as const;
export type AtsCategory = (typeof ATS_CATEGORIES)[number];

export const ATS_CATEGORY_LABELS: Record<AtsCategory, string> = {
  parseability: "Parseability",
  content: "Content quality",
  completeness: "Completeness",
  length: "Length",
  jobMatch: "Job match",
};

export type Severity = "ok" | "warn" | "fail";

export type Suggestion = {
  id: string;
  category: AtsCategory;
  severity: Severity;
  message: string;
  fix?: { panel: EditorPanelKey };
};

export type CategoryScore = {
  /** 0..100 percentage for this category. */
  pct: number;
  /** Final weight applied (after JD-absent redistribution). */
  weight: number;
};

export type AtsScore = {
  /** 0..100 weighted total. */
  score: number;
  breakdown: Record<AtsCategory, CategoryScore | null>;
  suggestions: Suggestion[];
};

const BASE_WEIGHTS_WITH_JD: Record<AtsCategory, number> = {
  parseability: 25,
  content: 25,
  completeness: 20,
  length: 10,
  jobMatch: 20,
};

const BASE_WEIGHTS_NO_JD: Record<AtsCategory, number> = {
  parseability: 30,
  content: 30,
  completeness: 25,
  length: 15,
  jobMatch: 0,
};

const PARSEABILITY_BY_TEMPLATE: Record<PdfTemplateId, number> = {
  classic: 100,
  "modern-centered": 80,
  timeline: 100,
  academic: 80,
  sidebar: 55,
  minimal: 100,
  inset: 100,
  banner: 90,
  split: 55,
  tinted: 85,
  "bold-type": 90,
};

const ACTION_VERBS = new Set(
  [
    "led",
    "built",
    "shipped",
    "drove",
    "owned",
    "architected",
    "designed",
    "developed",
    "delivered",
    "launched",
    "scaled",
    "automated",
    "implemented",
    "established",
    "introduced",
    "improved",
    "increased",
    "decreased",
    "reduced",
    "optimized",
    "rebuilt",
    "refactored",
    "migrated",
    "integrated",
    "negotiated",
    "managed",
    "mentored",
    "coached",
    "trained",
    "hired",
    "recruited",
    "presented",
    "authored",
    "wrote",
    "published",
    "researched",
    "investigated",
    "analyzed",
    "evaluated",
    "modeled",
    "forecasted",
    "executed",
    "orchestrated",
    "facilitated",
    "coordinated",
    "championed",
    "founded",
    "co-founded",
    "led",
    "spearheaded",
    "expanded",
    "consolidated",
    "transformed",
    "modernized",
    "streamlined",
    "saved",
    "earned",
    "raised",
    "secured",
    "won",
    "delivered",
    "pioneered",
    "boosted",
    "accelerated",
    "tripled",
    "doubled",
    "produced",
    "shipped",
    "engineered",
    "validated",
    "tested",
    "deployed",
    "instrumented",
    "monitored",
    "debugged",
    "documented",
    "reviewed",
    "audited",
    "secured",
    "rolled",
    "drove",
    "supported",
    "consulted",
    "collaborated",
    "partnered",
  ].map((verb) => verb.toLowerCase()),
);

const FIRST_PERSON_PATTERN = /^(?:i |my |me )/i;
const DIGIT_PATTERN = /\d/;

function clamp(value: number, min = 0, max = 100): number {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function lerp(
  value: number,
  lo: number,
  hi: number,
  outLo: number,
  outHi: number,
) {
  if (value <= lo) return outLo;
  if (value >= hi) return outHi;
  const t = (value - lo) / (hi - lo);
  return outLo + t * (outHi - outLo);
}

function firstWord(text: string): string {
  return (text.match(/[a-zA-Z][a-zA-Z'-]*/)?.[0] ?? "").toLowerCase();
}

function scoreParseability(
  draft: ResumeDraft,
  push: (s: Suggestion) => void,
): number {
  const presentation = normalizePdfPresentation(draft.pdfPresentation);
  const base = PARSEABILITY_BY_TEMPLATE[presentation.templateId];

  if (presentation.templateId === "sidebar") {
    push({
      id: "parseability/sidebar-template",
      category: "parseability",
      severity: "warn",
      message:
        "Multi-column templates can confuse ATS parsers. Switch to a single-column template for stricter ATS reliability.",
    });
  }
  if (
    presentation.templateId === "modern-centered" ||
    presentation.templateId === "academic"
  ) {
    push({
      id: "parseability/non-standard-template",
      category: "parseability",
      severity: "ok",
      message:
        "Most ATS parsers handle this template; classic / timeline score slightly higher.",
    });
  }

  return base;
}

function scoreContent(
  draft: ResumeDraft,
  push: (s: Suggestion) => void,
): number {
  const bullets = extractAllBullets(draft);
  if (bullets.length === 0) {
    push({
      id: "content/no-bullets",
      category: "content",
      severity: "fail",
      message:
        "Add bullet points to your Work Experience or Projects, concrete impact statements parse better and read faster.",
      fix: { panel: "workExperience" },
    });
    return 20;
  }

  const actionVerbStart = bullets.filter((bullet) =>
    ACTION_VERBS.has(firstWord(bullet)),
  ).length;
  const quantified = bullets.filter((bullet) =>
    DIGIT_PATTERN.test(bullet),
  ).length;
  const firstPerson = bullets.filter((bullet) =>
    FIRST_PERSON_PATTERN.test(bullet),
  ).length;
  const wordCounts = bullets.map(
    (bullet) => bullet.split(/\s+/).filter(Boolean).length,
  );
  const medianWords = wordCounts.length
    ? wordCounts.sort((a, b) => a - b)[Math.floor(wordCounts.length / 2)]
    : 0;

  const actionPct = actionVerbStart / bullets.length;
  const quantifiedPct = quantified / bullets.length;

  const actionScore = lerp(actionPct, 0.4, 0.7, 30, 100);
  const quantifiedScore = lerp(quantifiedPct, 0.2, 0.4, 40, 100);
  const lengthScore =
    medianWords >= 8 && medianWords <= 24
      ? 100
      : medianWords < 8
        ? lerp(medianWords, 0, 8, 30, 80)
        : lerp(medianWords, 24, 50, 80, 30);
  const firstPersonPenalty = firstPerson > 0 ? 15 : 0;

  if (actionPct < 0.5) {
    push({
      id: "content/action-verbs",
      category: "content",
      severity: actionPct < 0.3 ? "fail" : "warn",
      message:
        "Start more bullets with a strong action verb (Led, Built, Shipped, Drove). Recruiters and ATS keyword pipelines both weight openers.",
      fix: { panel: "workExperience" },
    });
  }
  if (quantifiedPct < 0.3) {
    push({
      id: "content/quantified-impact",
      category: "content",
      severity: quantifiedPct < 0.15 ? "fail" : "warn",
      message:
        'Quantify impact: add numbers or percentages to at least a third of your bullets (e.g. "cut p95 latency by 40%").',
      fix: { panel: "workExperience" },
    });
  }
  if (medianWords < 8) {
    push({
      id: "content/bullets-too-short",
      category: "content",
      severity: "warn",
      message:
        "Bullets are very short. Aim for 1–2 lines that combine action + scope + outcome.",
    });
  }
  if (medianWords > 28) {
    push({
      id: "content/bullets-too-long",
      category: "content",
      severity: "warn",
      message:
        "Bullets are long. Trim to one or two lines so recruiters and ATS systems can skim quickly.",
    });
  }
  if (firstPerson > 0) {
    push({
      id: "content/first-person",
      category: "content",
      severity: "warn",
      message:
        'Drop first-person pronouns ("I", "my") from bullets, resume convention.',
    });
  }

  return clamp(
    actionScore * 0.4 +
      quantifiedScore * 0.35 +
      lengthScore * 0.25 -
      firstPersonPenalty,
  );
}

function hasItemContent(items: unknown[], requiredFields: string[]): boolean {
  return items.some((item) =>
    requiredFields.some(
      (field) =>
        typeof (item as Record<string, unknown>)[field] === "string" &&
        ((item as Record<string, string>)[field] ?? "").trim().length > 0,
    ),
  );
}

function scoreCompleteness(
  draft: ResumeDraft,
  push: (s: Suggestion) => void,
): number {
  let score = 100;

  if (!draft.profile.fullName.trim()) {
    score -= 25;
    push({
      id: "completeness/full-name",
      category: "completeness",
      severity: "fail",
      message: "Add your full name to the profile.",
      fix: { panel: "profile" },
    });
  }
  if (!draft.profile.email.trim()) {
    score -= 20;
    push({
      id: "completeness/email",
      category: "completeness",
      severity: "fail",
      message:
        "Add a contact email, ATS systems will not be able to reach you otherwise.",
      fix: { panel: "profile" },
    });
  }
  if (!draft.profile.phone.trim()) {
    score -= 5;
    push({
      id: "completeness/phone",
      category: "completeness",
      severity: "warn",
      message: "Adding a phone number gives recruiters a faster channel.",
      fix: { panel: "profile" },
    });
  }

  const hasWE = hasItemContent(draft.sections.workExperience.items, [
    "companyName",
    "position",
  ]);
  const hasEdu = hasItemContent(draft.sections.education.items, [
    "name",
    "degree",
  ]);
  const hasProj = hasItemContent(draft.sections.projects.items, [
    "projectName",
  ]);

  if (!hasWE) {
    score -= 25;
    push({
      id: "completeness/work-experience",
      category: "completeness",
      severity: "fail",
      message: "Add at least one Work Experience entry.",
      fix: { panel: "workExperience" },
    });
  }
  if (!hasEdu && !hasProj) {
    score -= 15;
    push({
      id: "completeness/education-or-projects",
      category: "completeness",
      severity: "warn",
      message:
        "Add at least one Education or Project entry to round out your background.",
      fix: { panel: hasEdu ? "projects" : "education" },
    });
  }

  if (
    !draft.sections.skills.visible ||
    draft.sections.skills.items.length === 0
  ) {
    score -= 10;
    push({
      id: "completeness/skills",
      category: "completeness",
      severity: "warn",
      message:
        "Enable a Skills section, ATS keyword matching often looks at it explicitly.",
      fix: { panel: "skills" },
    });
  }

  if (
    !draft.sections.summary.visible ||
    !draft.sections.summary.content.replace(/<[^>]*>/g, "").trim()
  ) {
    score -= 5;
    push({
      id: "completeness/summary",
      category: "completeness",
      severity: "ok",
      message:
        "A 2–3 sentence summary gives recruiters the quick read they're looking for.",
      fix: { panel: "summary" },
    });
  }

  if (draft.profile.extraLinks.every((link) => !link.url.trim())) {
    score -= 5;
    push({
      id: "completeness/links",
      category: "completeness",
      severity: "ok",
      message:
        "Add at least one professional link (LinkedIn, portfolio, GitHub).",
      fix: { panel: "profile" },
    });
  }

  return clamp(score);
}

/**
 * Rough page estimate to flag "way too short" or "way too long" resumes.
 * Item-count based, weighted by section type and font scale, normalised against
 * the printable page area. Returns 100 in the sweet spot.
 */
function scoreLength(
  draft: ResumeDraft,
  push: (s: Suggestion) => void,
): number {
  const presentation = normalizePdfPresentation(draft.pdfPresentation);
  const paper = getPaperDimensionsMm(presentation.paperSize);
  const margin = getPageMarginMm(presentation.pageMargin);
  const printableHeightMm = paper.heightMm - margin * 2;

  const bulletCount = extractAllBullets(draft).length;
  const itemCount =
    draft.sections.workExperience.items.length +
    draft.sections.projects.items.length +
    draft.sections.education.items.length +
    draft.sections.publications.items.length +
    draft.sections.certifications.items.length +
    draft.sections.awards.items.length +
    draft.sections.organizationVolunteering.items.length +
    draft.sections.references.items.length;

  const fontFactor =
    presentation.fontScale === "sm"
      ? 0.85
      : presentation.fontScale === "lg"
        ? 1.2
        : 1;
  const spacingFactor =
    presentation.spacing === "compact"
      ? 0.85
      : presentation.spacing === "airy"
        ? 1.2
        : 1;

  const approxContentMm =
    (itemCount * 18 + bulletCount * 6 + 60) * fontFactor * spacingFactor;
  const pages = approxContentMm / printableHeightMm;

  if (pages < 0.4) {
    push({
      id: "length/too-short",
      category: "length",
      severity: "warn",
      message:
        "Resume looks light on content. Add more impact statements or context to fill at least half a page.",
    });
    return clamp(lerp(pages, 0.1, 0.4, 30, 80));
  }
  if (pages > 2.2) {
    push({
      id: "length/too-long",
      category: "length",
      severity: "warn",
      message:
        "Resume may overflow 2 pages, trim older roles or condense bullets to keep recruiters engaged.",
    });
    return clamp(lerp(pages, 2.2, 4, 80, 30));
  }
  return 100;
}

function scoreJobMatch(
  jobMatch: JobMatchResult,
  push: (s: Suggestion) => void,
): number {
  const pct = jobMatch.coverage * 100;
  if (jobMatch.missing.length > 0) {
    const topMissing = jobMatch.missing
      .slice()
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map((m) => m.term)
      .join(", ");
    push({
      id: "jobMatch/missing",
      category: "jobMatch",
      severity: pct < 50 ? "fail" : "warn",
      message: `Missing high-weight terms from the job description: ${topMissing}.`,
    });
  }
  if (pct >= 80) {
    push({
      id: "jobMatch/strong",
      category: "jobMatch",
      severity: "ok",
      message: `Strong keyword coverage (${Math.round(pct)}%).`,
    });
  }
  return clamp(pct);
}

export function computeAtsScore(
  draft: ResumeDraft,
  jobMatch?: JobMatchResult,
): AtsScore {
  const suggestions: Suggestion[] = [];
  const push = (s: Suggestion) => suggestions.push(s);

  const parseability = scoreParseability(draft, push);
  const content = scoreContent(draft, push);
  const completeness = scoreCompleteness(draft, push);
  const length = scoreLength(draft, push);
  const jobMatchPct = jobMatch ? scoreJobMatch(jobMatch, push) : null;

  const weights = jobMatch ? BASE_WEIGHTS_WITH_JD : BASE_WEIGHTS_NO_JD;

  const breakdown: Record<AtsCategory, CategoryScore | null> = {
    parseability: { pct: parseability, weight: weights.parseability },
    content: { pct: content, weight: weights.content },
    completeness: { pct: completeness, weight: weights.completeness },
    length: { pct: length, weight: weights.length },
    jobMatch:
      jobMatchPct === null
        ? null
        : { pct: jobMatchPct, weight: weights.jobMatch },
  };

  const totalWeight = Object.values(breakdown).reduce(
    (sum, cat) => sum + (cat?.weight ?? 0),
    0,
  );
  const weightedSum = Object.values(breakdown).reduce(
    (sum, cat) => sum + (cat ? cat.pct * cat.weight : 0),
    0,
  );
  const score = Math.round(weightedSum / totalWeight);

  // Severity-first sort, then category order.
  const severityRank: Record<Severity, number> = { fail: 0, warn: 1, ok: 2 };
  const categoryRank: Record<AtsCategory, number> = ATS_CATEGORIES.reduce(
    (acc, key, index) => {
      acc[key] = index;
      return acc;
    },
    {} as Record<AtsCategory, number>,
  );
  suggestions.sort((a, b) => {
    const sev = severityRank[a.severity] - severityRank[b.severity];
    if (sev !== 0) return sev;
    return categoryRank[a.category] - categoryRank[b.category];
  });

  return { score, breakdown, suggestions };
}
