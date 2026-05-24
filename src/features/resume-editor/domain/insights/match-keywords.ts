import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

import { extractResumeText } from "./extract-text";

export const KEYWORD_CATEGORIES = [
  "hard-skill",
  "soft-skill",
  "title",
  "qualification",
  "tool",
] as const;
export type KeywordCategory = (typeof KEYWORD_CATEGORIES)[number];

export type ExtractedKeyword = {
  term: string;
  category: KeywordCategory;
  /** 0..1 weight; higher = more important to match. */
  weight: number;
};

export type JobMatchResult = {
  jobDescription: string;
  keywords: ExtractedKeyword[];
  matched: ExtractedKeyword[];
  missing: ExtractedKeyword[];
  /** 0..1 — weighted coverage. */
  coverage: number;
};

/** Common acronym ↔ expansion pairs so "JS" matches "JavaScript" etc. */
const ALIASES: ReadonlyArray<[string, string]> = [
  ["javascript", "js"],
  ["typescript", "ts"],
  ["kubernetes", "k8s"],
  ["postgres", "postgresql"],
  ["amazon web services", "aws"],
  ["google cloud platform", "gcp"],
  ["continuous integration", "ci"],
  ["continuous delivery", "cd"],
  ["machine learning", "ml"],
  ["artificial intelligence", "ai"],
  ["user interface", "ui"],
  ["user experience", "ux"],
  ["application programming interface", "api"],
];

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function expandTerm(term: string): string[] {
  const normalized = normalize(term);
  if (!normalized) return [];
  const variants = new Set<string>([normalized]);
  for (const [long, short] of ALIASES) {
    if (normalized === long) variants.add(short);
    if (normalized === short) variants.add(long);
  }
  return [...variants];
}

function termMatches(haystack: string, term: string): boolean {
  for (const variant of expandTerm(term)) {
    // Word-boundary match on the variant (escape regex specials).
    const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(?:^|\\W)${escaped}(?:\\W|$)`, "i");
    if (pattern.test(haystack)) return true;
  }
  return false;
}

export function matchKeywords(
  draft: ResumeDraft,
  jobDescription: string,
  keywords: ExtractedKeyword[],
): JobMatchResult {
  const haystack = ` ${normalize(extractResumeText(draft))} `;
  const matched: ExtractedKeyword[] = [];
  const missing: ExtractedKeyword[] = [];

  for (const keyword of keywords) {
    if (termMatches(haystack, keyword.term)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  }

  const totalWeight = keywords.reduce((sum, kw) => sum + kw.weight, 0);
  const matchedWeight = matched.reduce((sum, kw) => sum + kw.weight, 0);
  const coverage = totalWeight === 0 ? 0 : matchedWeight / totalWeight;

  return { jobDescription, keywords, matched, missing, coverage };
}
