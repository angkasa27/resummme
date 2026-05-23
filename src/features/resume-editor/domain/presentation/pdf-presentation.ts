export const pdfLayoutIds = ["single-column", "two-column"] as const;
export type PdfLayoutId = (typeof pdfLayoutIds)[number];

export const pdfFontScaleIds = ["sm", "md", "lg"] as const;
export type PdfFontScaleId = (typeof pdfFontScaleIds)[number];

export const pdfLineHeightIds = ["tight", "standard", "relaxed"] as const;
export type PdfLineHeightId = (typeof pdfLineHeightIds)[number];

export const pdfSpacingIds = ["compact", "standard", "airy"] as const;
export type PdfSpacingId = (typeof pdfSpacingIds)[number];

export const pdfAccentTones = [
  "slate",
  "blue",
  "emerald",
  "rose",
  "amber",
] as const;
export type PdfAccentTone = (typeof pdfAccentTones)[number];

export const pdfAccentStrengths = ["soft", "balanced", "strong"] as const;
export type PdfAccentStrength = (typeof pdfAccentStrengths)[number];

export type PdfPresentation = {
  layoutId: PdfLayoutId;
  fontScale: PdfFontScaleId;
  spacing: PdfSpacingId;
  lineHeight: PdfLineHeightId;
  accentTone: PdfAccentTone;
  accentStrength: PdfAccentStrength;
};

export type ResolvedPdfPresentation = {
  layoutId: PdfLayoutId;
  vars: Record<string, string>;
};

export const pdfLayoutLabels: Record<PdfLayoutId, string> = {
  "single-column": "Single Column",
  "two-column": "Two Column",
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

export const pdfAccentToneLabels: Record<PdfAccentTone, string> = {
  slate: "Slate",
  blue: "Blue",
  emerald: "Emerald",
  rose: "Rose",
  amber: "Amber",
};

export const pdfAccentStrengthLabels: Record<PdfAccentStrength, string> = {
  soft: "Soft",
  balanced: "Balanced",
  strong: "Strong",
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
  compact: 16,
  standard: 20,
  airy: 24,
};

const itemGapPx: Record<PdfSpacingId, number> = {
  compact: 8,
  standard: 12,
  airy: 16,
};

const accentPalette: Record<
  PdfAccentTone,
  Record<PdfAccentStrength, string>
> = {
  slate: { soft: "#64748b", balanced: "#475569", strong: "#334155" },
  blue: { soft: "#3b82f6", balanced: "#2563eb", strong: "#1d4ed8" },
  emerald: { soft: "#10b981", balanced: "#059669", strong: "#047857" },
  rose: { soft: "#f43f5e", balanced: "#e11d48", strong: "#be123c" },
  amber: { soft: "#f59e0b", balanced: "#d97706", strong: "#b45309" },
};

export const accentSwatchPreview: Record<PdfAccentTone, string> =
  Object.fromEntries(
    pdfAccentTones.map((tone) => [tone, accentPalette[tone].balanced]),
  ) as Record<PdfAccentTone, string>;

export function createDefaultPdfPresentation(): PdfPresentation {
  return {
    layoutId: "single-column",
    fontScale: "md",
    spacing: "standard",
    lineHeight: "standard",
    accentTone: "blue",
    accentStrength: "balanced",
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
    fontScale: isMember(pdfFontScaleIds, source.fontScale)
      ? source.fontScale
      : defaults.fontScale,
    spacing: isMember(pdfSpacingIds, source.spacing)
      ? source.spacing
      : defaults.spacing,
    lineHeight: isMember(pdfLineHeightIds, source.lineHeight)
      ? source.lineHeight
      : defaults.lineHeight,
    accentTone: isMember(pdfAccentTones, source.accentTone)
      ? source.accentTone
      : defaults.accentTone,
    accentStrength: isMember(pdfAccentStrengths, source.accentStrength)
      ? source.accentStrength
      : defaults.accentStrength,
  };
}

export function resolvePdfPresentation(
  presentation?: PdfPresentation,
): ResolvedPdfPresentation {
  const p = normalizePdfPresentation(presentation);
  const base = fontBasePx[p.fontScale];
  const leading = lineHeightValues[p.lineHeight];
  const accent = accentPalette[p.accentTone][p.accentStrength];

  const vars: Record<string, string> = {
    "--resume-font": 'var(--font-sans), "Helvetica Neue", Arial, sans-serif',
    "--resume-text": "#111827",
    "--resume-muted": "#4b5563",
    "--resume-border": "#cbd5e1",
    "--resume-accent": accent,
    "--resume-h1": `${Number((base * 2.4).toFixed(2))}px`,
    "--resume-h2": `${Number((base * 0.92).toFixed(2))}px`,
    "--resume-h3": `${Number((base * 1.08).toFixed(2))}px`,
    "--resume-body": `${base}px`,
    "--resume-leading": String(leading),
    "--resume-gap-section": `${sectionGapPx[p.spacing]}px`,
    "--resume-gap-item": `${itemGapPx[p.spacing]}px`,
    "--resume-page-padding": "36px",
  };

  return { layoutId: p.layoutId, vars };
}
