export const pdfTemplateIds = [
  "classic",
  "sidebar",
  "modern-centered",
  "compact",
  "academic",
] as const;
export type PdfTemplateId = (typeof pdfTemplateIds)[number];

export const pdfFontScaleIds = ["sm", "md", "lg"] as const;
export type PdfFontScaleId = (typeof pdfFontScaleIds)[number];

export const pdfLineHeightIds = ["tight", "standard", "relaxed"] as const;
export type PdfLineHeightId = (typeof pdfLineHeightIds)[number];

export const pdfSpacingIds = ["compact", "standard", "airy"] as const;
export type PdfSpacingId = (typeof pdfSpacingIds)[number];

export type PdfPresentation = {
  templateId: PdfTemplateId;
  fontScale: PdfFontScaleId;
  spacing: PdfSpacingId;
  lineHeight: PdfLineHeightId;
  accent: string;
};

export type ResolvedPdfPresentation = {
  templateId: PdfTemplateId;
  vars: Record<string, string>;
};

export const pdfTemplateLabels: Record<PdfTemplateId, string> = {
  classic: "Classic",
  sidebar: "Sidebar",
  "modern-centered": "Modern Centered",
  compact: "Compact",
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

export const DEFAULT_ACCENT = "#2563eb";

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

export function isValidAccentHex(value: unknown): value is string {
  return typeof value === "string" && hexColorPattern.test(value);
}

export function createDefaultPdfPresentation(): PdfPresentation {
  return {
    templateId: "classic",
    fontScale: "md",
    spacing: "standard",
    lineHeight: "standard",
    accent: DEFAULT_ACCENT,
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
  };
}

export function resolvePdfPresentation(
  presentation?: PdfPresentation,
): ResolvedPdfPresentation {
  const p = normalizePdfPresentation(presentation);
  const base = fontBasePx[p.fontScale];
  const leading = lineHeightValues[p.lineHeight];

  const vars: Record<string, string> = {
    "--resume-font": 'var(--font-sans), "Helvetica Neue", Arial, sans-serif',
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
    "--resume-page-padding": "36px",
  };

  return { templateId: p.templateId, vars };
}
