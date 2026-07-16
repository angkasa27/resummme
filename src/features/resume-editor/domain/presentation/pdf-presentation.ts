import {
  readableTextOn,
  tintHex,
} from "@/features/resume-editor/domain/presentation/color-utils";
import {
  DEFAULT_FONT_ID,
  getFont,
  resumeFontIds,
  type ResumeFontId,
} from "@/features/resume-editor/domain/presentation/font-collection";

export { resumeFontIds, type ResumeFontId };

export const pdfLayoutIds = [
  "classic",
  "sidebar",
  "modern-centered",
  "timeline",
  "academic",
  "minimal",
  "inset",
  "banner",
  "split",
  "tinted",
  "bold-type",
] as const;
export type PdfLayoutId = (typeof pdfLayoutIds)[number];

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

export const pdfPhotoShapeIds = ["square", "rectangle", "circle"] as const;
export type PdfPhotoShapeId = (typeof pdfPhotoShapeIds)[number];

export type PdfPresentation = {
  layoutId: PdfLayoutId;
  fontFamilyId: ResumeFontId;
  fontScale: PdfFontScaleId;
  spacing: PdfSpacingId;
  lineHeight: PdfLineHeightId;
  accent: string;
  /** Optional second theme color; falls back to `accent` when unset. */
  secondary?: string;
  paperSize: PdfPaperSize;
  pageMargin: PdfPageMargin;
  /**
   * Optional profile-photo shape override. When unset, each layout keeps its
   * own native photo aspect/radius; when set, it overrides every layout.
   */
  photoShape?: PdfPhotoShapeId;
};

export type ResolvedPdfPresentation = {
  layoutId: PdfLayoutId;
  vars: Record<string, string>;
};

export const pdfPhotoShapeLabels: Record<PdfPhotoShapeId, string> = {
  square: "Square",
  rectangle: "Rectangle",
  circle: "Circle",
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
  moderate: "Moderate",
  normal: "Normal",
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

const innerGapPx: Record<PdfSpacingId, number> = {
  compact: 4,
  standard: 6,
  airy: 8,
};

const indentPx: Record<PdfSpacingId, number> = {
  compact: 10,
  standard: 14,
  airy: 18,
};

export const paperDimensions: Record<
  PdfPaperSize,
  { widthMm: number; heightMm: number }
> = {
  a4: { widthMm: 210, heightMm: 297 },
  letter: { widthMm: 215.9, heightMm: 279.4 },
};

/** CSS px per millimetre at 96dpi — used to scale on-screen paper previews. */
const PX_PER_MM = 96 / 25.4;

/** Paper width in CSS pixels, for scaling a full-size document into a thumbnail. */
export function getPaperWidthPx(paperSize: PdfPaperSize): number {
  return paperDimensions[paperSize].widthMm * PX_PER_MM;
}

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

export function getEffectiveSecondary(presentation: PdfPresentation): string {
  return presentation.secondary ?? presentation.accent;
}

export function getPaperDimensionsMm(paperSize: PdfPaperSize) {
  return paperDimensions[paperSize];
}

export function getPageMarginMm(pageMargin: PdfPageMargin) {
  return pageMarginMm[pageMargin];
}

export function createDefaultPdfPresentation(): PdfPresentation {
  return {
    layoutId: "classic",
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
    layoutId: isMember(pdfLayoutIds, source.layoutId)
      ? source.layoutId
      : defaults.layoutId,
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
    secondary: isValidAccentHex(source.secondary) ? source.secondary : undefined,
    paperSize: isMember(pdfPaperSizes, source.paperSize)
      ? source.paperSize
      : defaults.paperSize,
    pageMargin: isMember(pdfPageMargins, source.pageMargin)
      ? source.pageMargin
      : defaults.pageMargin,
    photoShape: isMember(pdfPhotoShapeIds, source.photoShape)
      ? source.photoShape
      : undefined,
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
  const secondary = getEffectiveSecondary(p);

  const vars: Record<string, string> = {
    "--resume-font": getFont(p.fontFamilyId).stack,
    "--resume-text": "#111827",
    "--resume-muted": "#4b5563",
    "--resume-border": "#cbd5e1",
    "--resume-accent": p.accent,
    "--resume-secondary": secondary,
    "--resume-secondary-tint": tintHex(secondary, 0.9),
    "--resume-on-accent": readableTextOn(p.accent),
    "--resume-on-secondary": readableTextOn(secondary),
    "--resume-h1": `${Number((base * 2.3).toFixed(2))}px`,
    "--resume-h2": `${Number((base * 1.25).toFixed(2))}px`,
    "--resume-h3": `${Number((base * 1.05).toFixed(2))}px`,
    "--resume-meta": `${Number((base * 0.92).toFixed(2))}px`,
    "--resume-body": `${base}px`,
    "--resume-leading": String(leading),
    "--resume-gap-section": `${sectionGapPx[p.spacing]}px`,
    "--resume-gap-item": `${itemGapPx[p.spacing]}px`,
    "--resume-gap-inner": `${innerGapPx[p.spacing]}px`,
    "--resume-indent": `${indentPx[p.spacing]}px`,
    "--resume-paper-width": `${paper.widthMm}mm`,
    "--resume-page-margin": `${margin}mm`,
    "--resume-print-content-width": `${printContentWidth}mm`,
  };

  // Photo-shape override. Only emit when the user has picked a shape so each
  // layout keeps its native look by default (via CSS var fallbacks). Both
  // aspect and radius are forced for the chosen shape: `circle` is fully round,
  // while `square`/`rectangle` use a small radius so they read as sharp-cornered
  // even on layouts whose native photo is a circle.
  if (p.photoShape) {
    vars["--resume-photo-aspect"] =
      p.photoShape === "rectangle" ? "3 / 4" : "1 / 1";
    vars["--resume-photo-radius"] =
      p.photoShape === "circle" ? "50%" : "6px";
  }

  return { layoutId: p.layoutId, vars };
}
