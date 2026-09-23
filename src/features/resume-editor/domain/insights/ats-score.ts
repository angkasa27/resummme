import { parseMonthYear } from "@/features/resume-editor/domain/month-year";
import {
  getPaperDimensionsMm,
  NOMINAL_LENGTH_MARGIN_MM,
  normalizePdfPresentation,
  type PdfLayoutId,
  type PdfPresentation,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

import { extractBullets, stripRichText } from "./extract-text";
import type { JobMatchResult } from "./match-keywords";

/** Deterministic model of what ATS software does, in order: parse → sections → fields → content → match.
 *  Every check is computed locally; nothing here calls a model. */
export const ATS_CATEGORIES = [
  "parse",
  "structure",
  "contact",
  "content",
  "jobMatch",
] as const;
export type AtsCategory = (typeof ATS_CATEGORIES)[number];

export const ATS_CATEGORY_LABELS: Record<AtsCategory, string> = {
  parse: "Parseability",
  structure: "Structure",
  contact: "Contact & dates",
  content: "Content quality",
  jobMatch: "Job match",
};

type Severity = "ok" | "warn" | "fail";

export type Suggestion = {
  id: string;
  category: AtsCategory;
  severity: Severity;
  message: string;
  /** The offending strings behind the complaint. */
  evidence?: string[];
  fix?: { panel: EditorPanelKey };
};

export type CategoryScore = {
  /** 0..100 percentage for this category. */
  pct: number;
  /** Relative weight in the total. */
  weight: number;
};

type AtsScore = {
  /** 0..100 weighted total. */
  score: number;
  breakdown: Record<AtsCategory, CategoryScore | null>;
  suggestions: Suggestion[];
};

const CATEGORY_WEIGHTS: Record<AtsCategory, number> = {
  parse: 25,
  structure: 15,
  contact: 20,
  content: 25,
  jobMatch: 15,
};

/** `na` drops the check out of its category's average entirely. */
type CheckStatus = "pass" | "warn" | "fail" | "na";

type CheckOutcome = {
  status: CheckStatus;
  /** Overrides the check's default message. Used to fold counts/values into the copy. */
  message?: string;
  evidence?: string[];
};

type AtsCheck = {
  id: string;
  category: AtsCategory;
  /** Relative weight within its own category. */
  weight: number;
  /** Shown when the check passes. */
  pass: string;
  /** Default copy for a warn/fail; a check can override it per-outcome. */
  message: string;
  fix?: { panel: EditorPanelKey };
  run: (ctx: AtsContext) => CheckOutcome;
};

// Context — every derived value the checks share, computed once.

type DatedEntry = {
  /** Human label for evidence, e.g. "Engineer at Acme". */
  label: string;
  startDate: string;
  endDate: string;
  panel: EditorPanelKey;
};

/** The label the editor and the score agree on for a work-experience row. */
export function roleLabel(role: {
  position: string;
  companyName: string;
}): string {
  return (
    [role.position, role.companyName].filter(Boolean).join(" at ") ||
    "Untitled role"
  );
}

function datedEntriesFrom<T extends { startDate: string; endDate: string }>(
  items: readonly T[],
  panel: EditorPanelKey,
  label: (item: T) => string,
): DatedEntry[] {
  return items.map((item) => ({
    label: label(item),
    startDate: item.startDate,
    endDate: item.endDate,
    panel,
  }));
}

type AtsContext = {
  draft: ResumeDraft;
  presentation: PdfPresentation;
  /** Every rich-text field in the document, as raw HTML. */
  richTextHtml: string[];
  bullets: string[];
  /** Collection rows across visible sections — drives the page-length estimate. */
  visibleItemCount: number;
  /** Every dated entry across work, education, projects and volunteering. */
  datedEntries: DatedEntry[];
  jobMatch?: JobMatchResult;
};

function buildContext(
  draft: ResumeDraft,
  jobMatch?: JobMatchResult,
): AtsContext {
  const { sections } = draft;
  /** Hidden sections are never exported, so they can't break or pad anything. */
  const shown = <T>(
    section: { visible: boolean; items: T[] },
    pick: (item: T) => string,
  ) => (section.visible ? section.items.map(pick) : []);

  const richTextHtml = [
    sections.summary.visible ? sections.summary.content : "",
    ...shown(sections.workExperience, (item) => item.description),
    ...shown(sections.projects, (item) => item.description),
    ...shown(sections.education, (item) => item.description),
    ...shown(sections.publications, (item) => item.description),
    ...shown(sections.awards, (item) => item.description),
    ...shown(sections.organizationVolunteering, (item) => item.description),
  ].filter(Boolean);

  const datedEntries: DatedEntry[] = [
    ...datedEntriesFrom(sections.workExperience.items, "workExperience", (item) =>
      roleLabel(item),
    ),
    ...datedEntriesFrom(sections.education.items, "education", (item) =>
      [item.degree, item.name].filter(Boolean).join(", ") ||
      "Untitled education entry",
    ),
    ...datedEntriesFrom(sections.projects.items, "projects", (item) =>
      item.projectName || "Untitled project",
    ),
    ...datedEntriesFrom(
      sections.organizationVolunteering.items,
      "organizationVolunteering",
      (item) =>
        [item.position, item.organizationName].filter(Boolean).join(" at ") ||
        "Untitled organization entry",
    ),
  ];

  return {
    draft,
    presentation: normalizePdfPresentation(draft.pdfPresentation),
    richTextHtml,
    // Narrative sections only, and only the ones that reach the page.
    bullets: [
      ...shown(sections.workExperience, (item) => item.description),
      ...shown(sections.projects, (item) => item.description),
      ...shown(sections.education, (item) => item.description),
      ...shown(sections.organizationVolunteering, (item) => item.description),
      ...shown(sections.awards, (item) => item.description),
    ].flatMap((html) => extractBullets(html)),
    visibleItemCount: Object.values(sections).reduce(
      (total, section) =>
        total +
        (section.visible && "items" in section ? section.items.length : 0),
      0,
    ),
    datedEntries,
    jobMatch,
  };
}

// Shared helpers

/** Cap evidence so a badly broken resume doesn't render a wall of text. */
const EVIDENCE_LIMIT = 4;

function trim(list: string[]): string[] {
  if (list.length <= EVIDENCE_LIMIT) return list;
  return [
    ...list.slice(0, EVIDENCE_LIMIT),
    `…and ${list.length - EVIDENCE_LIMIT} more`,
  ];
}

/** Shorten a bullet to something that fits on one evidence row. */
function excerpt(text: string, max = 70): string {
  const clean = text.trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1)}…`;
}

function hasText(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/** `pass` above `good`, `warn` above `poor`, `fail` below. */
function byRatio(ratio: number, good: number, poor: number): CheckStatus {
  if (ratio >= good) return "pass";
  if (ratio >= poor) return "warn";
  return "fail";
}

/** A date field is machine-readable when it's blank, the `current` sentinel, or "MMM YYYY". */
function isReadableDate(value: string): boolean {
  if (!hasText(value) || value === "current") return true;
  return parseMonthYear(value) !== undefined;
}

/** Milliseconds → whole months, for gap detection. */
const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30.44;

// Parse — can the machine read the file at all?

type LayoutVerdict = { status: CheckStatus; message?: string };

/** Two-column layouts are the biggest parse risk: parsers read straight across both columns. */
const LAYOUT_VERDICTS: Record<PdfLayoutId, LayoutVerdict> = {
  classic: { status: "pass" },
  timeline: { status: "pass" },
  inset: { status: "pass" },
  "bold-type": { status: "pass" },
  studio: { status: "pass" },
  aurora: { status: "pass" },
  folio: { status: "pass" },
  academic: { status: "pass" },
  split: {
    status: "fail",
    message:
      "Parsers read two columns straight across, so both sides end up jumbled into one block. Switch to a single-column layout.",
  },
  duet: {
    status: "fail",
    message:
      "Parsers read two columns straight across, so both sides end up jumbled into one block. Switch to a single-column layout.",
  },
  crest: { status: "pass" },
  masthead: { status: "pass" },
  duotone: {
    status: "fail",
    message:
      "Parsers read two columns straight across, so the rail ends up jumbled into your experience — and the main column is a saturated fill behind light type, which prints badly. Switch to a single-column layout.",
  },
  monolith: {
    status: "warn",
    message:
      "The text order parses fine, but the page is one saturated colour behind light type. Some pipelines flatten a PDF to greyscale first, and it prints badly on a mono printer. Use a light layout if the file may be printed or converted.",
  },
  marquee: { status: "pass" },
  meridian: { status: "pass" },
  numeral: { status: "pass" },
  lintel: { status: "pass" },
  editorial: {
    status: "warn",
    message:
      "Each role's title sits in a column beside its bullets, so a parser reading line by line can splice the title into the first bullets. Use a single-column layout if you expect a strict parser.",
  },
  harvard: { status: "pass" },
  rirekisho: {
    status: "warn",
    message:
      "A 履歴書 is a form for a human reader, not a parser — the ruled table and Japanese labels are the point. Use a single-column layout if you also need to pass a Western ATS.",
  },
  compass: {
    status: "fail",
    message:
      "Parsers read two columns straight across, so the rail ends up mixed into your experience. Switch to a single-column layout.",
  },
  atlas: {
    status: "fail",
    message:
      "Sections tile across three columns here, which a parser reads straight across as one jumbled block. Switch to a single-column layout.",
  },
  ledger: {
    status: "fail",
    message:
      "Parsers read two columns straight across, so your details column ends up mixed into your experience. Switch to a single-column layout.",
  },
  dossier: {
    status: "fail",
    message:
      "Parsers read two columns straight across, so the rail ends up mixed into your experience. Switch to a single-column layout.",
  },
};

/** Dingbats, arrows, geometric shapes, emoji — parsers drop these or turn them into noise. */
const DECORATIVE_GLYPH_PATTERN =
  /[←-⇿─-➿⬀-⯿️\u{1F000}-\u{1FAFF}]/u;

const PARSE_CHECKS: AtsCheck[] = [
  {
    id: "parse/layout",
    category: "parse",
    weight: 3,
    pass: "Single column, so parsers read it top to bottom in the right order.",
    message: "This layout is risky to parse.",
    run: (ctx) => LAYOUT_VERDICTS[ctx.presentation.layoutId],
  },
  {
    id: "parse/photo",
    category: "parse",
    weight: 1,
    pass: "No photo, so there is no image block to trip the parser.",
    message:
      "Many parsers mishandle photos, and employers in the US, UK and Canada often discard resumes that carry one. Remove it unless your market expects it.",
    fix: { panel: "profile" },
    run: (ctx) =>
      hasText(ctx.draft.profile.photo) ? { status: "warn" } : { status: "pass" },
  },
  {
    id: "parse/tables",
    category: "parse",
    weight: 2,
    pass: "No tables in your content.",
    message:
      "Parsers read tables cell by cell, in an order you cannot predict. Rewrite these as plain paragraphs or bullets.",
    run: (ctx) => {
      if (ctx.richTextHtml.length === 0) return { status: "na" };
      return ctx.richTextHtml.some((html) => /<table\b/i.test(html))
        ? { status: "fail" }
        : { status: "pass" };
    },
  },
  {
    id: "parse/nested-lists",
    category: "parse",
    weight: 1,
    pass: "No nested lists.",
    message:
      "Nested bullets often collapse or disappear when the text is pulled out. Flatten them to one level.",
    run: (ctx) => {
      if (ctx.richTextHtml.length === 0) return { status: "na" };
      return ctx.richTextHtml.some((html) =>
        /<li\b[^>]*>(?:(?!<\/li>)[\s\S])*?<(?:ul|ol)\b/i.test(html),
      )
        ? { status: "warn" }
        : { status: "pass" };
    },
  },
  {
    id: "parse/glyphs",
    category: "parse",
    weight: 1,
    pass: "No decorative symbols in your text.",
    message:
      "Symbols and emoji are usually dropped or turned into junk characters. Use plain text.",
    run: (ctx) => {
      if (ctx.richTextHtml.length === 0) return { status: "na" };
      const offenders = ctx.richTextHtml
        .map((html) => stripRichText(html))
        .filter((text) => DECORATIVE_GLYPH_PATTERN.test(text))
        .map((text) => excerpt(text));
      return offenders.length > 0
        ? { status: "warn", evidence: trim(offenders) }
        : { status: "pass" };
    },
  },
];

// Structure — can it tell which block is which section?

const STRUCTURE_CHECKS: AtsCheck[] = [
  {
    id: "structure/core-sections",
    category: "structure",
    weight: 3,
    pass: "Experience, Education and Skills are all present.",
    message:
      "Parsers find your history by looking for standard section headings. Anything missing leaves that part of your background unread.",
    fix: { panel: "workExperience" },
    run: (ctx) => {
      const { sections } = ctx.draft;
      // Visible-but-blank equals absent to a parser — a Skills heading with no skills is nothing.
      const verdict = (
        label: string,
        section: { visible: boolean },
        hasContent: boolean,
      ) => {
        if (!section.visible) return `${label} is hidden`;
        if (!hasContent) return `${label} is empty`;
        return null;
      };

      const missing = [
        verdict(
          "Work experience",
          sections.workExperience,
          sections.workExperience.items.some(
            (item) => hasText(item.companyName) || hasText(item.position),
          ),
        ),
        verdict(
          "Education",
          sections.education,
          sections.education.items.some(
            (item) => hasText(item.name) || hasText(item.degree),
          ),
        ),
        verdict(
          "Skills",
          sections.skills,
          sections.skills.items.some(
            (item) => item.skills.some(hasText) || hasText(item.categoryName),
          ),
        ),
      ].filter((entry): entry is string => entry !== null);

      if (missing.length === 0) return { status: "pass" };
      return {
        status: missing.length > 1 ? "fail" : "warn",
        evidence: missing,
      };
    },
  },
  {
    id: "structure/complete-items",
    category: "structure",
    weight: 3,
    pass: "Every role has a title, an employer and a start date.",
    message:
      "A role needs a title, an employer and a start date to be indexed as a job. Without all three it will not count toward your years of experience.",
    fix: { panel: "workExperience" },
    run: (ctx) => {
      // Sections always hold ≥1 row (schema `min(1)`), so "no roles" is one blank row
      // that must still fail, not fall through to `na`.
      const items = ctx.draft.sections.workExperience.items;
      const incomplete = items
        .map((item) => {
          const gaps = [
            hasText(item.position) ? null : "job title",
            hasText(item.companyName) ? null : "employer",
            hasText(item.startDate) ? null : "start date",
          ].filter((gap): gap is string => gap !== null);
          if (gaps.length === 0) return null;
          const label =
            item.position || item.companyName || "Untitled role";
          return `${label}: missing ${gaps.join(", ")}`;
        })
        .filter((entry): entry is string => entry !== null);

      if (incomplete.length === 0) return { status: "pass" };
      return {
        status: incomplete.length === items.length ? "fail" : "warn",
        evidence: trim(incomplete),
      };
    },
  },
  {
    id: "structure/experience-first",
    category: "structure",
    weight: 1,
    pass: "Experience is ordered above Education.",
    message:
      "Once you have work history, Experience usually goes above Education. Recruiters look for it first.",
    fix: { panel: "workExperience" },
    run: (ctx) => {
      const { workExperience, education } = ctx.draft.sections;
      if (!workExperience.visible || !education.visible) return { status: "na" };
      const hasRoles = workExperience.items.some((item) =>
        hasText(item.companyName) || hasText(item.position),
      );
      if (!hasRoles) return { status: "na" };
      return workExperience.order < education.order
        ? { status: "pass" }
        : { status: "warn" };
    },
  },
  {
    id: "structure/summary",
    category: "structure",
    weight: 1,
    pass: "You have a summary at the top.",
    message:
      "Two or three sentences at the top are the first thing a recruiter reads, and a good place for the job's core terms.",
    fix: { panel: "summary" },
    run: (ctx) => {
      const { summary } = ctx.draft.sections;
      return summary.visible && hasText(stripRichText(summary.content))
        ? { status: "pass" }
        : { status: "warn" };
    },
  },
];

// Contact & dates — can it extract structured fields?

// Deliberately permissive: flags obvious typos, not RFC 5322.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

const CONTACT_CHECKS: AtsCheck[] = [
  {
    id: "contact/full-name",
    category: "contact",
    weight: 4,
    pass: "Your name is on the resume.",
    message:
      "Add your full name. Every parser builds the candidate record around it, and without one your application is unusable.",
    fix: { panel: "profile" },
    run: (ctx) =>
      hasText(ctx.draft.profile.fullName)
        ? { status: "pass" }
        : { status: "fail" },
  },
  {
    id: "contact/email",
    category: "contact",
    weight: 3,
    pass: "Your email address looks valid.",
    message:
      "This does not look like a valid email address. If it cannot be read, nothing else on the resume matters.",
    fix: { panel: "profile" },
    run: (ctx) => {
      const email = ctx.draft.profile.email.trim();
      if (!email) return { status: "fail", message: "Add a contact email." };
      return EMAIL_PATTERN.test(email)
        ? { status: "pass" }
        : { status: "fail", evidence: [email] };
    },
  },
  {
    id: "contact/phone",
    category: "contact",
    weight: 1,
    pass: "Your phone number looks complete.",
    message: "Add a phone number. It is the fastest way for a recruiter to reach you.",
    fix: { panel: "profile" },
    run: (ctx) => {
      const digits = ctx.draft.profile.phone.replace(/\D/g, "");
      if (digits.length === 0) return { status: "warn" };
      return digits.length >= 7
        ? { status: "pass" }
        : {
            status: "warn",
            message: "This phone number looks too short.",
            evidence: [ctx.draft.profile.phone],
          };
    },
  },
  {
    id: "contact/location",
    category: "contact",
    weight: 1,
    pass: "Your location is set.",
    message:
      "Add a location. Recruiters and ATS filters often search by place first.",
    fix: { panel: "profile" },
    run: (ctx) =>
      hasText(ctx.draft.profile.location)
        ? { status: "pass" }
        : { status: "warn" },
  },
  {
    id: "contact/links",
    category: "contact",
    weight: 1,
    pass: "Your links start with https://.",
    message:
      "Write links in full, starting with https://. A bare domain often is not recognised as a link and gets dropped.",
    fix: { panel: "profile" },
    run: (ctx) => {
      const links = ctx.draft.profile.extraLinks
        .map((link) => link.url.trim())
        .filter(Boolean);
      if (links.length === 0) {
        return {
          status: "warn",
          message:
            "Add at least one professional link (LinkedIn, portfolio, GitHub).",
        };
      }
      const schemeless = links.filter((url) => !/^https?:\/\//i.test(url));
      return schemeless.length === 0
        ? { status: "pass" }
        : { status: "warn", evidence: trim(schemeless) };
    },
  },
  {
    id: "contact/dates-readable",
    category: "contact",
    weight: 4,
    pass: "Every date is in a format a parser can read.",
    message:
      'Write dates as "MMM YYYY", like "Mar 2021". Anything else fails to parse, which quietly wipes out your years of experience.',
    fix: { panel: "workExperience" },
    run: (ctx) => {
      if (ctx.datedEntries.length === 0) return { status: "na" };
      const broken = ctx.datedEntries.flatMap((entry) =>
        [entry.startDate, entry.endDate]
          .filter((value) => !isReadableDate(value))
          .map((value) => `${entry.label}: "${value}"`),
      );
      return broken.length === 0
        ? { status: "pass" }
        : { status: "fail", evidence: trim(broken) };
    },
  },
  {
    id: "contact/chronological",
    category: "contact",
    weight: 2,
    pass: "Roles are listed newest first.",
    message:
      "List your roles newest first. Parsers and recruiters both assume the top entry is your current job.",
    fix: { panel: "workExperience" },
    run: (ctx) => {
      const items = ctx.draft.sections.workExperience.items;
      // Rank: current roles first, then by end date descending.
      const ranks = items.map((item) =>
        item.endDate === "current"
          ? Number.POSITIVE_INFINITY
          : (parseMonthYear(item.endDate) ?? parseMonthYear(item.startDate))
              ?.getTime(),
      );
      const known = ranks.filter(
        (rank): rank is number => typeof rank === "number",
      );
      if (known.length < 2) return { status: "na" };

      const outOfOrder = known.some((rank, i) => i > 0 && rank > known[i - 1]);
      return outOfOrder ? { status: "warn" } : { status: "pass" };
    },
  },
  {
    id: "contact/gaps",
    category: "contact",
    weight: 1,
    pass: "No unexplained gaps longer than six months.",
    message:
      "Long gaps get flagged in screening. Cover them with a project, a course, or contract work.",
    fix: { panel: "workExperience" },
    run: (ctx) => {
      const spans = ctx.draft.sections.workExperience.items
        .map((item) => ({
          label: item.position || item.companyName || "Untitled role",
          start: parseMonthYear(item.startDate),
          end:
            item.endDate === "current"
              ? new Date()
              : parseMonthYear(item.endDate),
        }))
        .filter(
          (span): span is { label: string; start: Date; end: Date } =>
            span.start !== undefined && span.end !== undefined,
        )
        .sort((a, b) => a.start.getTime() - b.start.getTime());

      if (spans.length < 2) return { status: "na" };

      const gaps: string[] = [];
      let coveredUntil = spans[0].end;
      for (const span of spans.slice(1)) {
        const months =
          (span.start.getTime() - coveredUntil.getTime()) / MS_PER_MONTH;
        if (months > 6) {
          gaps.push(`${Math.round(months)} months before ${span.label}`);
        }
        if (span.end > coveredUntil) coveredUntil = span.end;
      }

      return gaps.length === 0
        ? { status: "pass" }
        : { status: "warn", evidence: trim(gaps) };
    },
  },
];

// Content — will a human keep reading once it parses?

const ACTION_VERBS = new Set([
  "led", "built", "shipped", "drove", "owned", "architected", "designed",
  "developed", "delivered", "launched", "scaled", "automated", "implemented",
  "established", "introduced", "improved", "increased", "decreased", "reduced",
  "optimized", "rebuilt", "refactored", "migrated", "integrated", "negotiated",
  "managed", "mentored", "coached", "trained", "hired", "recruited",
  "presented", "authored", "wrote", "published", "researched", "investigated",
  "analyzed", "evaluated", "modeled", "forecasted", "executed", "orchestrated",
  "facilitated", "coordinated", "championed", "founded", "co-founded",
  "spearheaded", "expanded", "consolidated", "transformed", "modernized",
  "streamlined", "saved", "earned", "raised", "secured", "won", "pioneered",
  "boosted", "accelerated", "tripled", "doubled", "produced", "engineered",
  "validated", "tested", "deployed", "instrumented", "monitored", "debugged",
  "documented", "reviewed", "audited", "rolled", "supported", "consulted",
  "collaborated", "partnered",
]);

/** Filler that signals a duty list rather than an achievement. */
const CLICHES = [
  "responsible for",
  "duties included",
  "tasked with",
  "team player",
  "results-driven",
  "results oriented",
  "results-oriented",
  "hard worker",
  "hard-working",
  "detail-oriented",
  "self-starter",
  "go-getter",
  "think outside the box",
  "proven track record",
  "synergy",
];

/** Titles that no ATS title-matching dictionary contains. */
const NOVELTY_TITLE_WORDS = [
  "ninja",
  "rockstar",
  "rock star",
  "guru",
  "wizard",
  "jedi",
  "sherpa",
  "evangelist",
  "superhero",
];

const FIRST_PERSON_PATTERN = /^(?:i |my |me )/i;
const DIGIT_PATTERN = /\d/;

function firstWord(text: string): string {
  return (text.match(/[a-zA-Z][a-zA-Z'-]*/)?.[0] ?? "").toLowerCase();
}

// The ideal band and the flag point differ on purpose (25-28 words is long but
// not wrong), but every copy below quotes the number it actually uses.
const IDEAL_MIN_WORDS = 8;
const IDEAL_MAX_WORDS = 24;
const TOO_LONG_WORDS = 28;

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

const CONTENT_CHECKS: AtsCheck[] = [
  {
    id: "content/has-bullets",
    category: "content",
    weight: 2,
    pass: "Your roles are described in bullet points.",
    message:
      "Add bullet points under your roles. A solid block of prose is harder to skim and harder to match on keywords.",
    fix: { panel: "workExperience" },
    run: (ctx) =>
      ctx.bullets.length > 0 ? { status: "pass" } : { status: "fail" },
  },
  {
    id: "content/action-verbs",
    category: "content",
    weight: 3,
    pass: "Most bullets open with a strong action verb.",
    message:
      "Start bullets with a strong verb like Led, Built, Shipped or Drove. Recruiters and keyword tools both weight the first word heavily.",
    fix: { panel: "workExperience" },
    run: (ctx) => {
      if (ctx.bullets.length === 0) return { status: "na" };
      const weak = ctx.bullets.filter(
        (bullet) => !ACTION_VERBS.has(firstWord(bullet)),
      );
      const status = byRatio(
        1 - weak.length / ctx.bullets.length,
        0.5,
        0.3,
      );
      return status === "pass"
        ? { status }
        : { status, evidence: trim(weak.map((bullet) => excerpt(bullet))) };
    },
  },
  {
    id: "content/quantified",
    category: "content",
    weight: 3,
    pass: "Plenty of your bullets carry a number.",
    message:
      'Put a number in at least a third of your bullets. "Cut p95 latency 40%" beats "improved performance".',
    fix: { panel: "workExperience" },
    run: (ctx) => {
      if (ctx.bullets.length === 0) return { status: "na" };
      const unquantified = ctx.bullets.filter(
        (bullet) => !DIGIT_PATTERN.test(bullet),
      );
      const status = byRatio(
        1 - unquantified.length / ctx.bullets.length,
        0.3,
        0.15,
      );
      return status === "pass"
        ? { status }
        : {
            status,
            evidence: trim(unquantified.map((bullet) => excerpt(bullet))),
          };
    },
  },
  {
    id: "content/bullet-length",
    category: "content",
    weight: 2,
    pass: "Bullets are a readable length.",
    message: `Aim for ${IDEAL_MIN_WORDS} to ${IDEAL_MAX_WORDS} words per bullet: action, scope, then outcome.`,
    fix: { panel: "workExperience" },
    run: (ctx) => {
      if (ctx.bullets.length === 0) return { status: "na" };
      const short = ctx.bullets.filter(
        (bullet) => wordCount(bullet) < IDEAL_MIN_WORDS,
      );
      const long = ctx.bullets.filter(
        (bullet) => wordCount(bullet) > TOO_LONG_WORDS,
      );
      const offenders = [...short, ...long];
      if (offenders.length === 0) return { status: "pass" };
      const ratio = 1 - offenders.length / ctx.bullets.length;
      return {
        // Floor at `warn`: "pass" would render "readable length" above the named offenders.
        status: ratio >= 0.4 ? "warn" : "fail",
        message:
          short.length >= long.length
            ? `These bullets are under ${IDEAL_MIN_WORDS} words, too thin to carry an accomplishment. Aim for ${IDEAL_MIN_WORDS} to ${IDEAL_MAX_WORDS}: action, scope, outcome.`
            : `These bullets run past ${TOO_LONG_WORDS} words. Trim toward ${IDEAL_MIN_WORDS} to ${IDEAL_MAX_WORDS} so they stay easy to skim.`,
        evidence: trim(offenders.map((bullet) => excerpt(bullet))),
      };
    },
  },
  {
    id: "content/first-person",
    category: "content",
    weight: 1,
    pass: "No first-person pronouns.",
    message:
      'Drop "I" and "my" from your bullets. Resumes leave the subject implied.',
    fix: { panel: "workExperience" },
    run: (ctx) => {
      if (ctx.bullets.length === 0) return { status: "na" };
      const offenders = ctx.bullets.filter((bullet) =>
        FIRST_PERSON_PATTERN.test(bullet),
      );
      return offenders.length === 0
        ? { status: "pass" }
        : {
            status: "warn",
            evidence: trim(offenders.map((bullet) => excerpt(bullet))),
          };
    },
  },
  {
    id: "content/cliches",
    category: "content",
    weight: 2,
    pass: "No filler phrases or duty-list language.",
    message:
      'Replace duty-list filler with outcomes. "Responsible for X" describes the job; "Cut X by 30%" describes you.',
    fix: { panel: "workExperience" },
    run: (ctx) => {
      if (ctx.bullets.length === 0) return { status: "na" };
      const offenders = ctx.bullets.flatMap((bullet) => {
        const lower = bullet.toLowerCase();
        const hit = CLICHES.find((cliche) => lower.includes(cliche));
        return hit ? [`"${hit}" in: ${excerpt(bullet, 50)}`] : [];
      });
      return offenders.length === 0
        ? { status: "pass" }
        : { status: "warn", evidence: trim(offenders) };
    },
  },
  {
    id: "content/standard-titles",
    category: "content",
    weight: 1,
    pass: "Your job titles are standard.",
    message:
      "Novelty titles are not in any ATS title dictionary, so you will not show up in title searches. Use the standard title and keep the fun one in a bullet.",
    fix: { panel: "workExperience" },
    run: (ctx) => {
      const titles = ctx.draft.sections.workExperience.items
        .map((item) => item.position)
        .filter(hasText);
      if (titles.length === 0) return { status: "na" };
      const offenders = titles
        .filter((position) => {
          const lower = position.toLowerCase();
          return NOVELTY_TITLE_WORDS.some((word) => lower.includes(word));
        });
      return offenders.length === 0
        ? { status: "pass" }
        : { status: "warn", evidence: trim(offenders) };
    },
  },
  {
    id: "content/length",
    category: "content",
    weight: 2,
    pass: "Length looks right for one to two pages.",
    message: "Adjust the amount of content.",
    run: (ctx) => {
      if (ctx.bullets.length === 0) return { status: "na" };
      const paper = getPaperDimensionsMm(ctx.presentation.paperSize);
      const printableHeightMm = paper.heightMm - NOMINAL_LENGTH_MARGIN_MM * 2;

      const fontFactor =
        ctx.presentation.fontScale === "sm"
          ? 0.85
          : ctx.presentation.fontScale === "lg"
            ? 1.2
            : 1;
      const spacingFactor =
        ctx.presentation.spacing === "compact"
          ? 0.85
          : ctx.presentation.spacing === "airy"
            ? 1.2
            : 1;

      // ponytail: item-count heuristic, not a real measurement; swap for the paginator's page count if off.
      const pages =
        ((ctx.visibleItemCount * 18 + ctx.bullets.length * 6 + 60) *
          fontFactor *
          spacingFactor) /
        printableHeightMm;

      if (pages < 0.4) {
        return {
          status: "warn",
          message:
            "There is not enough here to fill half a page. Add scope and outcomes to the roles you already have.",
        };
      }
      if (pages > 2.2) {
        return {
          status: "warn",
          message:
            "This is likely to run past two pages. Trim older roles or condense bullets.",
        };
      }
      return { status: "pass" };
    },
  },
];

// Job match — how this resume scores against one specific req.

const JOB_MATCH_CHECKS: AtsCheck[] = [
  {
    id: "jobMatch/coverage",
    category: "jobMatch",
    weight: 4,
    pass: "You cover most of the job's key terms.",
    message: "You're missing terms the job description leans on.",
    run: (ctx) => {
      // No keywords = empty extraction; nothing for the user to fix, so don't drag the score.
      if (!ctx.jobMatch || ctx.jobMatch.keywords.length === 0)
        return { status: "na" };
      const status = byRatio(ctx.jobMatch.coverage, 0.75, 0.5);
      if (status === "pass") return { status };
      const topMissing = [...ctx.jobMatch.missing]
        .sort((a, b) => b.weight - a.weight)
        .map((keyword) => keyword.term);
      return { status, evidence: trim(topMissing) };
    },
  },
  {
    id: "jobMatch/acronyms",
    category: "jobMatch",
    weight: 2,
    pass: "Your terms are spelled the way the job description spells them.",
    message:
      "Keyword screens compare exact text, so an acronym will not match its full form. Write both once, like \"Kubernetes (K8s)\".",
    run: (ctx) => {
      if (!ctx.jobMatch || ctx.jobMatch.keywords.length === 0)
        return { status: "na" };
      if (ctx.jobMatch.partial.length === 0) return { status: "pass" };
      return {
        status: "warn",
        evidence: trim(
          ctx.jobMatch.partial.map(
            (keyword) =>
              `job asks "${keyword.term}", you wrote "${keyword.foundAs}"`,
          ),
        ),
      };
    },
  },
];

const ALL_CHECKS: AtsCheck[] = [
  ...PARSE_CHECKS,
  ...STRUCTURE_CHECKS,
  ...CONTACT_CHECKS,
  ...CONTENT_CHECKS,
  ...JOB_MATCH_CHECKS,
];

// Scoring

const STATUS_VALUE: Record<Exclude<CheckStatus, "na">, number> = {
  pass: 1,
  warn: 0.5,
  fail: 0,
};

const STATUS_SEVERITY: Record<Exclude<CheckStatus, "na">, Severity> = {
  pass: "ok",
  warn: "warn",
  fail: "fail",
};

export function computeAtsScore(
  draft: ResumeDraft,
  jobMatch?: JobMatchResult,
): AtsScore {
  const ctx = buildContext(draft, jobMatch);

  const results = ALL_CHECKS.map((check) => ({
    check,
    outcome: check.run(ctx),
  })).filter(
    (
      result,
    ): result is { check: AtsCheck; outcome: CheckOutcome & { status: Exclude<CheckStatus, "na"> } } =>
      result.outcome.status !== "na",
  );

  const scoredCategories = ATS_CATEGORIES.filter((category) =>
    results.some((r) => r.check.category === category),
  );
  // Categories with no checks (no JD) drop out; the rest rescale to 100 so the UI weight labels add up.
  const liveWeight = scoredCategories.reduce(
    (sum, category) => sum + CATEGORY_WEIGHTS[category],
    0,
  );

  const breakdown = {} as Record<AtsCategory, CategoryScore | null>;
  for (const category of ATS_CATEGORIES) {
    const scored = results.filter((r) => r.check.category === category);
    if (scored.length === 0) {
      breakdown[category] = null;
      continue;
    }
    const checkWeight = scored.reduce((sum, r) => sum + r.check.weight, 0);
    const earned = scored.reduce(
      (sum, r) => sum + r.check.weight * STATUS_VALUE[r.outcome.status],
      0,
    );
    breakdown[category] = {
      pct: Math.round((earned / checkWeight) * 100),
      weight: Math.round((CATEGORY_WEIGHTS[category] / liveWeight) * 100),
    };
  }

  const score =
    liveWeight === 0
      ? 0
      : Math.round(
          scoredCategories.reduce(
            (sum, category) =>
              sum +
              (breakdown[category]?.pct ?? 0) * CATEGORY_WEIGHTS[category],
            0,
          ) / liveWeight,
        );

  const suggestions: Suggestion[] = results.map(({ check, outcome }) => ({
    id: check.id,
    category: check.category,
    severity: STATUS_SEVERITY[outcome.status],
    message:
      outcome.status === "pass"
        ? check.pass
        : (outcome.message ?? check.message),
    ...(outcome.evidence?.length ? { evidence: outcome.evidence } : {}),
    ...(check.fix && outcome.status !== "pass" ? { fix: check.fix } : {}),
  }));

  // Severity first, then registry order — so a category's rows stay stable.
  const severityRank: Record<Severity, number> = { fail: 0, warn: 1, ok: 2 };
  suggestions.sort(
    (a, b) => severityRank[a.severity] - severityRank[b.severity],
  );

  return { score, breakdown, suggestions };
}
