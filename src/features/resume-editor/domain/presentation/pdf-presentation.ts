import {
  DEFAULT_FONT_ID,
  getFont,
  resumeFontIds,
  type ResumeFontId,
} from "@/features/resume-editor/domain/presentation/font-collection";

export { resumeFontIds, type ResumeFontId };

export const pdfTemplateIds = [
  "classic",
  "sidebar",
  "modern-centered",
  "timeline",
  "academic",
] as const;
export type PdfTemplateId = (typeof pdfTemplateIds)[number];

export const pdfFontScaleIds = ["sm", "md", "lg"] as const;
export type PdfFontScaleId = (typeof pdfFontScaleIds)[number];

export const pdfLineHeightIds = ["tight", "standard", "relaxed"] as const;
export type PdfLineHeightId = (typeof pdfLineHeightIds)[number];

export const pdfSpacingIds = ["compact", "standard", "airy"] as const;
export type PdfSpacingId = (typeof pdfSpacingIds)[number];

export const pdfPaperSizes = ["a4", "letter"] as const;
export type PdfPaperSize = (typeof pdfPaperSizes)[number];

export const pdfPageMargins = ["narrow", "normal", "moderate"] as const;
export type PdfPageMargin = (typeof pdfPageMargins)[number];

export type PdfPresentation = {
  templateId: PdfTemplateId;
  fontFamilyId: ResumeFontId;
  fontScale: PdfFontScaleId;
  spacing: PdfSpacingId;
  lineHeight: PdfLineHeightId;
  accent: string;
  paperSize: PdfPaperSize;
  pageMargin: PdfPageMargin;
};

export type ResolvedPdfPresentation = {
  templateId: PdfTemplateId;
  vars: Record<string, string>;
};

export const pdfTemplateLabels: Record<PdfTemplateId, string> = {
  classic: "Classic",
  sidebar: "Sidebar",
  "modern-centered": "Modern",
  timeline: "Timeline",
  academic: "Academic",
};

export const pdfFontScaleLabels: Record<PdfFontScaleId, string> = {
  sm: "Small",
  md: "Medium",
  lg: "Large",
};

export const pdfLineHeightLabels: Record<PdfLineHeightId, string> = {
  tight: "Tight",
  standard: "Standard",
  relaxed: "Relaxed",
};

export const pdfSpacingLabels: Record<PdfSpacingId, string> = {
  compact: "Compact",
  standard: "Standard",
  airy: "Airy",
};

export const pdfPaperSizeLabels: Record<PdfPaperSize, string> = {
  a4: "A4",
  letter: "Letter",
};

export const pdfPageMarginLabels: Record<PdfPageMargin, string> = {
  narrow: "Narrow",
  normal: "Normal",
  moderate: "Moderate",
};

const fontBasePx: Record<PdfFontScaleId, number> = {
  sm: 11,
  md: 12,
  lg: 14,
};

const lineHeightValues: Record<PdfLineHeightId, number> = {
  tight: 1.4,
  standard: 1.6,
  relaxed: 1.9,
};

const sectionGapPx: Record<PdfSpacingId, number> = {
  compact: 12,
  standard: 16,
  airy: 20,
};

const itemGapPx: Record<PdfSpacingId, number> = {
  compact: 6,
  standard: 10,
  airy: 14,
};

const paperDimensions: Record<
  PdfPaperSize,
  { widthMm: number; heightMm: number }
> = {
  a4: { widthMm: 210, heightMm: 297 },
  letter: { widthMm: 215.9, heightMm: 279.4 },
};

const pageMarginMm: Record<PdfPageMargin, number> = {
  narrow: 12.7, // 0.5"
  normal: 25.4, // 1"
  moderate: 19.05, // 0.75"
};

export const DEFAULT_ACCENT = "#2563eb";

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

export function isValidAccentHex(value: unknown): value is string {
  return typeof value === "string" && hexColorPattern.test(value);
}

export function getPaperDimensionsMm(paperSize: PdfPaperSize) {
  return paperDimensions[paperSize];
}

export function getPageMarginMm(pageMargin: PdfPageMargin) {
  return pageMarginMm[pageMargin];
}

export function createDefaultPdfPresentation(): PdfPresentation {
  return {
    templateId: "classic",
    fontFamilyId: DEFAULT_FONT_ID,
    fontScale: "md",
    spacing: "standard",
    lineHeight: "standard",
    accent: DEFAULT_ACCENT,
    paperSize: "a4",
    pageMargin: "narrow",
  };
}

function isMember<T extends string>(
  ids: ReadonlyArray<T>,
  value: unknown,
): value is T {
  return typeof value === "string" && ids.includes(value as T);
}

export function normalizePdfPresentation(input: unknown): PdfPresentation {
  const defaults = createDefaultPdfPresentation();
  if (typeof input !== "object" || input === null) return defaults;

  const source = input as Record<string, unknown>;

  return {
    templateId: isMember(pdfTemplateIds, source.templateId)
      ? source.templateId
      : defaults.templateId,
    fontFamilyId: isMember(resumeFontIds, source.fontFamilyId)
      ? source.fontFamilyId
      : defaults.fontFamilyId,
    fontScale: isMember(pdfFontScaleIds, source.fontScale)
      ? source.fontScale
      : defaults.fontScale,
    spacing: isMember(pdfSpacingIds, source.spacing)
      ? source.spacing
      : defaults.spacing,
    lineHeight: isMember(pdfLineHeightIds, source.lineHeight)
      ? source.lineHeight
      : defaults.lineHeight,
    accent: isValidAccentHex(source.accent) ? source.accent : defaults.accent,
    paperSize: isMember(pdfPaperSizes, source.paperSize)
      ? source.paperSize
      : defaults.paperSize,
    pageMargin: isMember(pdfPageMargins, source.pageMargin)
      ? source.pageMargin
      : defaults.pageMargin,
  };
}

export function resolvePdfPresentation(
  presentation?: PdfPresentation,
): ResolvedPdfPresentation {
  const p = normalizePdfPresentation(presentation);
  const base = fontBasePx[p.fontScale];
  const leading = lineHeightValues[p.lineHeight];
  const paper = paperDimensions[p.paperSize];
  const margin = pageMarginMm[p.pageMargin];
  const printContentWidth = Number((paper.widthMm - margin * 2).toFixed(3));

  const vars: Record<string, string> = {
    "--resume-font": getFont(p.fontFamilyId).stack,
    "--resume-text": "#111827",
    "--resume-muted": "#4b5563",
    "--resume-border": "#cbd5e1",
    "--resume-accent": p.accent,
    "--resume-h1": `${Number((base * 2.4).toFixed(2))}px`,
    "--resume-h2": `${Number((base * 0.92).toFixed(2))}px`,
    "--resume-h3": `${Number((base * 1.08).toFixed(2))}px`,
    "--resume-body": `${base}px`,
    "--resume-leading": String(leading),
    "--resume-gap-section": `${sectionGapPx[p.spacing]}px`,
    "--resume-gap-item": `${itemGapPx[p.spacing]}px`,
    "--resume-paper-width": `${paper.widthMm}mm`,
    "--resume-page-margin": `${margin}mm`,
    "--resume-print-content-width": `${printContentWidth}mm`,
  };

  return { templateId: p.templateId, vars };
}
