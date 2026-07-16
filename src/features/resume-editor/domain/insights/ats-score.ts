import {
  getPaperDimensionsMm,
  getPageMarginMm,
  normalizePdfPresentation,
  type PdfLayoutId,
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

/** Each scorer owns its suggestions instead of a threaded push callback. */
type ScorerResult = { score: number; suggestions: Suggestion[] };

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

type ParseabilityNote = Omit<Suggestion, "fix">;

type ParseabilityEntry = { score: number; note?: ParseabilityNote };

const SIDEBAR_LAYOUT_NOTE: ParseabilityNote = {
  id: "parseability/sidebar-layout",
  category: "parseability",
  severity: "warn",
  message:
    "Multi-column layouts can confuse ATS parsers. Switch to a single-column layout for stricter ATS reliability.",
};

const NON_STANDARD_LAYOUT_NOTE: ParseabilityNote = {
  id: "parseability/non-standard-layout",
  category: "parseability",
  severity: "ok",
  message:
    "Most ATS parsers handle this layout; classic / timeline score slightly higher.",
};

// Score + optional advisory note per layout, driven by data instead of a
// per-layoutId `if` ladder. Preserves the exact prior notes.
const PARSEABILITY_BY_LAYOUT: Record<PdfLayoutId, ParseabilityEntry> = {
  classic: { score: 100 },
  "modern-centered": { score: 80, note: NON_STANDARD_LAYOUT_NOTE },
  timeline: { score: 100 },
  academic: { score: 80, note: NON_STANDARD_LAYOUT_NOTE },
  sidebar: { score: 55, note: SIDEBAR_LAYOUT_NOTE },
  minimal: { score: 100 },
  inset: { score: 100 },
  banner: { score: 90 },
  split: { score: 55 },
  "bold-type": { score: 90 },
};

const ACTION_VERBS = new Set([
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
  "pioneered",
  "boosted",
  "accelerated",
  "tripled",
  "doubled",
  "produced",
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
  "rolled",
  "supported",
  "consulted",
  "collaborated",
  "partnered",
]);

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

function scoreParseability(draft: ResumeDraft): ScorerResult {
  const presentation = normalizePdfPresentation(draft.pdfPresentation);
  const entry = PARSEABILITY_BY_LAYOUT[presentation.layoutId];
  const suggestions: Suggestion[] = [];
  if (entry.note) suggestions.push(entry.note);
  return { score: entry.score, suggestions };
}

type ContentMetrics = {
  actionPct: number;
  quantifiedPct: number;
  medianWords: number;
  firstPersonCount: number;
};

function computeContentMetrics(bullets: string[]): ContentMetrics {
  const actionVerbStart = bullets.filter((bullet) =>
    ACTION_VERBS.has(firstWord(bullet)),
  ).length;
  const quantified = bullets.filter((bullet) =>
    DIGIT_PATTERN.test(bullet),
  ).length;
  const firstPersonCount = bullets.filter((bullet) =>
    FIRST_PERSON_PATTERN.test(bullet),
  ).length;
  const wordCounts = bullets
    .map((bullet) => bullet.split(/\s+/).filter(Boolean).length)
    .sort((a, b) => a - b);
  const medianWords = wordCounts.length
    ? wordCounts[Math.floor(wordCounts.length / 2)]
    : 0;

  return {
    actionPct: actionVerbStart / bullets.length,
    quantifiedPct: quantified / bullets.length,
    medianWords,
    firstPersonCount,
  };
}

function contentLengthScore(medianWords: number): number {
  if (medianWords >= 8 && medianWords <= 24) return 100;
  return medianWords < 8
    ? lerp(medianWords, 0, 8, 30, 80)
    : lerp(medianWords, 24, 50, 80, 30);
}

function collectContentSuggestions(metrics: ContentMetrics): Suggestion[] {
  const { actionPct, quantifiedPct, medianWords, firstPersonCount } = metrics;
  const suggestions: Suggestion[] = [];
  const push = (s: Suggestion) => suggestions.push(s);

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
  if (firstPersonCount > 0) {
    push({
      id: "content/first-person",
      category: "content",
      severity: "warn",
      message:
        'Drop first-person pronouns ("I", "my") from bullets, resume convention.',
    });
  }

  return suggestions;
}

function scoreContent(draft: ResumeDraft): ScorerResult {
  const bullets = extractAllBullets(draft);
  if (bullets.length === 0) {
    return {
      score: 20,
      suggestions: [
        {
          id: "content/no-bullets",
          category: "content",
          severity: "fail",
          message:
            "Add bullet points to your Work Experience or Projects, concrete impact statements parse better and read faster.",
          fix: { panel: "workExperience" },
        },
      ],
    };
  }

  const metrics = computeContentMetrics(bullets);
  const actionScore = lerp(metrics.actionPct, 0.4, 0.7, 30, 100);
  const quantifiedScore = lerp(metrics.quantifiedPct, 0.2, 0.4, 40, 100);
  const lengthScore = contentLengthScore(metrics.medianWords);
  const firstPersonPenalty = metrics.firstPersonCount > 0 ? 15 : 0;

  return {
    score: clamp(
      actionScore * 0.4 +
        quantifiedScore * 0.35 +
        lengthScore * 0.25 -
        firstPersonPenalty,
    ),
    suggestions: collectContentSuggestions(metrics),
  };
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

type CompletenessCheck = { penalty: number; suggestion: Suggestion | null };

function checkFullName(draft: ResumeDraft): CompletenessCheck {
  if (draft.profile.fullName.trim()) return { penalty: 0, suggestion: null };
  return {
    penalty: 25,
    suggestion: {
      id: "completeness/full-name",
      category: "completeness",
      severity: "fail",
      message: "Add your full name to the profile.",
      fix: { panel: "profile" },
    },
  };
}

function checkEmail(draft: ResumeDraft): CompletenessCheck {
  if (draft.profile.email.trim()) return { penalty: 0, suggestion: null };
  return {
    penalty: 20,
    suggestion: {
      id: "completeness/email",
      category: "completeness",
      severity: "fail",
      message:
        "Add a contact email, ATS systems will not be able to reach you otherwise.",
      fix: { panel: "profile" },
    },
  };
}

function checkPhone(draft: ResumeDraft): CompletenessCheck {
  if (draft.profile.phone.trim()) return { penalty: 0, suggestion: null };
  return {
    penalty: 5,
    suggestion: {
      id: "completeness/phone",
      category: "completeness",
      severity: "warn",
      message: "Adding a phone number gives recruiters a faster channel.",
      fix: { panel: "profile" },
    },
  };
}

function checkWorkExperience(draft: ResumeDraft): CompletenessCheck {
  const hasWE = hasItemContent(draft.sections.workExperience.items, [
    "companyName",
    "position",
  ]);
  if (hasWE) return { penalty: 0, suggestion: null };
  return {
    penalty: 25,
    suggestion: {
      id: "completeness/work-experience",
      category: "completeness",
      severity: "fail",
      message: "Add at least one Work Experience entry.",
      fix: { panel: "workExperience" },
    },
  };
}

function checkEducationOrProjects(draft: ResumeDraft): CompletenessCheck {
  const hasEdu = hasItemContent(draft.sections.education.items, [
    "name",
    "degree",
  ]);
  const hasProj = hasItemContent(draft.sections.projects.items, [
    "projectName",
  ]);
  if (hasEdu || hasProj) return { penalty: 0, suggestion: null };
  return {
    penalty: 15,
    suggestion: {
      id: "completeness/education-or-projects",
      category: "completeness",
      severity: "warn",
      message:
        "Add at least one Education or Project entry to round out your background.",
      fix: { panel: hasEdu ? "projects" : "education" },
    },
  };
}

function checkSkills(draft: ResumeDraft): CompletenessCheck {
  if (draft.sections.skills.visible && draft.sections.skills.items.length > 0)
    return { penalty: 0, suggestion: null };
  return {
    penalty: 10,
    suggestion: {
      id: "completeness/skills",
      category: "completeness",
      severity: "warn",
      message:
        "Enable a Skills section, ATS keyword matching often looks at it explicitly.",
      fix: { panel: "skills" },
    },
  };
}

function checkSummary(draft: ResumeDraft): CompletenessCheck {
  const hasSummary =
    draft.sections.summary.visible &&
    draft.sections.summary.content.replace(/<[^>]*>/g, "").trim();
  if (hasSummary) return { penalty: 0, suggestion: null };
  return {
    penalty: 5,
    suggestion: {
      id: "completeness/summary",
      category: "completeness",
      severity: "ok",
      message:
        "A 2–3 sentence summary gives recruiters the quick read they're looking for.",
      fix: { panel: "summary" },
    },
  };
}

function checkLinks(draft: ResumeDraft): CompletenessCheck {
  if (draft.profile.extraLinks.some((link) => link.url.trim()))
    return { penalty: 0, suggestion: null };
  return {
    penalty: 5,
    suggestion: {
      id: "completeness/links",
      category: "completeness",
      severity: "ok",
      message:
        "Add at least one professional link (LinkedIn, portfolio, GitHub).",
      fix: { panel: "profile" },
    },
  };
}

function scoreCompleteness(draft: ResumeDraft): ScorerResult {
  const checks = [
    checkFullName(draft),
    checkEmail(draft),
    checkPhone(draft),
    checkWorkExperience(draft),
    checkEducationOrProjects(draft),
    checkSkills(draft),
    checkSummary(draft),
    checkLinks(draft),
  ];

  const score = checks.reduce((total, check) => total - check.penalty, 100);
  const suggestions = checks
    .map((check) => check.suggestion)
    .filter((suggestion): suggestion is Suggestion => suggestion !== null);

  return { score: clamp(score), suggestions };
}

/**
 * Rough page estimate to flag "way too short" or "way too long" resumes.
 * Item-count based, weighted by section type and font scale, normalised against
 * the printable page area. Returns 100 in the sweet spot.
 */
function scoreLength(draft: ResumeDraft): ScorerResult {
  const suggestions: Suggestion[] = [];
  const push = (s: Suggestion) => suggestions.push(s);
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
    return { score: clamp(lerp(pages, 0.1, 0.4, 30, 80)), suggestions };
  }
  if (pages > 2.2) {
    push({
      id: "length/too-long",
      category: "length",
      severity: "warn",
      message:
        "Resume may overflow 2 pages, trim older roles or condense bullets to keep recruiters engaged.",
    });
    return { score: clamp(lerp(pages, 2.2, 4, 80, 30)), suggestions };
  }
  return { score: 100, suggestions };
}

function scoreJobMatch(jobMatch: JobMatchResult): ScorerResult {
  const suggestions: Suggestion[] = [];
  const push = (s: Suggestion) => suggestions.push(s);
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
  return { score: clamp(pct), suggestions };
}

export function computeAtsScore(
  draft: ResumeDraft,
  jobMatch?: JobMatchResult,
): AtsScore {
  const parseability = scoreParseability(draft);
  const content = scoreContent(draft);
  const completeness = scoreCompleteness(draft);
  const length = scoreLength(draft);
  const jobMatchResult = jobMatch ? scoreJobMatch(jobMatch) : null;

  // Same category order as the previous push sequence (final sort below makes
  // ordering deterministic regardless).
  const suggestions: Suggestion[] = [
    ...parseability.suggestions,
    ...content.suggestions,
    ...completeness.suggestions,
    ...length.suggestions,
    ...(jobMatchResult?.suggestions ?? []),
  ];

  const weights = jobMatch ? BASE_WEIGHTS_WITH_JD : BASE_WEIGHTS_NO_JD;

  const breakdown: Record<AtsCategory, CategoryScore | null> = {
    parseability: { pct: parseability.score, weight: weights.parseability },
    content: { pct: content.score, weight: weights.content },
    completeness: { pct: completeness.score, weight: weights.completeness },
    length: { pct: length.score, weight: weights.length },
    jobMatch:
      jobMatchResult === null
        ? null
        : { pct: jobMatchResult.score, weight: weights.jobMatch },
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
