export const pdfLayoutIds = [
  "sidebar-headings",
  "classic-centered",
] as const;

export type PdfLayoutId = (typeof pdfLayoutIds)[number];

export const pdfTypeScaleIds = ["small", "standard", "large"] as const;
export type PdfTypeScaleId = (typeof pdfTypeScaleIds)[number];

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

export type PdfPresentationOverrides = {
  typeScale: PdfTypeScaleId;
  lineHeight: PdfLineHeightId;
  sectionSpacing: PdfSpacingId;
  itemSpacing: PdfSpacingId;
  accentTone: PdfAccentTone;
  accentStrength: PdfAccentStrength;
};

export type PdfPresentation = {
  layoutId: PdfLayoutId;
  overrides: PdfPresentationOverrides;
};

type LegacyPdfPresentationInput = {
  layoutId?: unknown;
  themeId?: unknown;
  overrides?: {
    typeScale?: unknown;
    lineHeight?: unknown;
    sectionSpacing?: unknown;
    itemSpacing?: unknown;
    fontSizePx?: number;
    sectionSpacingPx?: number;
    itemSpacingPx?: number;
    accentTone?: unknown;
    accentStrength?: unknown;
  };
};

type PdfLayoutDefinition = {
  id: PdfLayoutId;
  label: string;
  description: string;
  bodyFontFamily: string;
  headingFontFamily: string;
  bodyTextColor: string;
  mutedTextColor: string;
  defaults: PdfPresentationOverrides;
  headingWeight: number;
  sectionLabelWeight: number;
  sectionLabelLetterSpacingEm: number;
  sectionLabelTransform: "uppercase" | "none";
  summaryLabelVisible: boolean;
  sectionHeadingStyle: "sidebar" | "top-rule";
  headerAlignment: "left" | "center";
};

export type ResolvedPdfPresentation = {
  layout: PdfLayoutDefinition;
  layoutId: PdfLayoutId;
  bodyFontFamily: string;
  headingFontFamily: string;
  bodyTextColor: string;
  mutedTextColor: string;
  accentColor: string;
  articleGapPx: number;
  itemGapPx: number;
  bodyFontSizePx: number;
  bodyLineHeight: number;
  nameFontSizePx: number;
  sectionLabelFontSizePx: number;
  sectionLabelWeight: number;
  sectionLabelLetterSpacingEm: number;
  sectionLabelTransform: "uppercase" | "none";
  titleFontSizePx: number;
  titleLineHeight: number;
  metaFontSizePx: number;
  contactFontSizePx: number;
  dateFontSizePx: number;
  sectionBodyGapPx: number;
  itemPaddingBottomPx: number;
  itemBorderColor: string;
  headingWeight: number;
};

export const pdfLayoutLabels: Record<PdfLayoutId, string> = {
  "sidebar-headings": "Sidebar Headings",
  "classic-centered": "Classic Centered",
};

export const pdfTypeScaleLabels: Record<PdfTypeScaleId, string> = {
  small: "Small",
  standard: "Standard",
  large: "Large",
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

const accentPalette: Record<PdfAccentTone, Record<PdfAccentStrength, string>> = {
  slate: {
    soft: "#64748b",
    balanced: "#475569",
    strong: "#334155",
  },
  blue: {
    soft: "#3b82f6",
    balanced: "#2563eb",
    strong: "#1d4ed8",
  },
  emerald: {
    soft: "#10b981",
    balanced: "#059669",
    strong: "#047857",
  },
  rose: {
    soft: "#f43f5e",
    balanced: "#e11d48",
    strong: "#be123c",
  },
  amber: {
    soft: "#f59e0b",
    balanced: "#d97706",
    strong: "#b45309",
  },
};

const typeScaleValues: Record<PdfTypeScaleId, number> = {
  small: 12,
  standard: 13,
  large: 15,
};

const lineHeightValues: Record<PdfLineHeightId, number> = {
  tight: 1.5,
  standard: 1.7,
  relaxed: 1.9,
};

const sectionSpacingValues: Record<PdfSpacingId, number> = {
  compact: 20,
  standard: 24,
  airy: 32,
};

const itemSpacingValues: Record<PdfSpacingId, number> = {
  compact: 16,
  standard: 20,
  airy: 26,
};

export const pdfLayouts: Record<PdfLayoutId, PdfLayoutDefinition> = {
  "sidebar-headings": {
    id: "sidebar-headings",
    label: "Sidebar Headings",
    description: "Section labels sit in a slim left column.",
    bodyFontFamily: 'var(--font-sans), "Helvetica Neue", Arial, sans-serif',
    headingFontFamily: 'var(--font-sans), "Helvetica Neue", Arial, sans-serif',
    bodyTextColor: "#111827",
    mutedTextColor: "#6b7280",
    defaults: {
      typeScale: "standard",
      lineHeight: "standard",
      sectionSpacing: "standard",
      itemSpacing: "standard",
      accentTone: "blue",
      accentStrength: "balanced",
    },
    headingWeight: 600,
    sectionLabelWeight: 600,
    sectionLabelLetterSpacingEm: 0.18,
    sectionLabelTransform: "uppercase",
    summaryLabelVisible: true,
    sectionHeadingStyle: "sidebar",
    headerAlignment: "left",
  },
  "classic-centered": {
    id: "classic-centered",
    label: "Classic Centered",
    description: "Centered header and top section titles inspired by your CV.",
    bodyFontFamily: 'var(--font-sans), "Helvetica Neue", Arial, sans-serif',
    headingFontFamily: 'var(--font-sans), "Helvetica Neue", Arial, sans-serif',
    bodyTextColor: "#1f2937",
    mutedTextColor: "#4b5563",
    defaults: {
      typeScale: "standard",
      lineHeight: "standard",
      sectionSpacing: "standard",
      itemSpacing: "standard",
      accentTone: "slate",
      accentStrength: "balanced",
    },
    headingWeight: 700,
    sectionLabelWeight: 700,
    sectionLabelLetterSpacingEm: 0,
    sectionLabelTransform: "uppercase",
    summaryLabelVisible: false,
    sectionHeadingStyle: "top-rule",
    headerAlignment: "center",
  },
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function closestPresetId<T extends string>(
  value: number | undefined,
  presets: Record<T, number>,
  fallback: T
): T {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return (Object.entries(presets) as [T, number][])
    .sort(
      (left, right) =>
        Math.abs(left[1] - value) - Math.abs(right[1] - value)
    )[0]?.[0] ?? fallback;
}

function normalizeAccentTone(
  value: unknown,
  fallback: PdfAccentTone
): PdfAccentTone {
  return pdfAccentTones.includes(value as PdfAccentTone)
    ? (value as PdfAccentTone)
    : fallback;
}

function normalizeAccentStrength(
  value: unknown,
  fallback: PdfAccentStrength
): PdfAccentStrength {
  return pdfAccentStrengths.includes(value as PdfAccentStrength)
    ? (value as PdfAccentStrength)
    : fallback;
}

function normalizeLayoutId(
  layoutId: unknown,
  themeId: unknown
): PdfLayoutId {
  if (pdfLayoutIds.includes(layoutId as PdfLayoutId)) {
    return layoutId as PdfLayoutId;
  }

  if (typeof themeId === "string") {
    return "sidebar-headings";
  }

  return "sidebar-headings";
}

function normalizePresetOverrides(
  overrides: Record<string, unknown>,
  fallback: PdfPresentationOverrides
): PdfPresentationOverrides {
  return {
    typeScale: pdfTypeScaleIds.includes(overrides.typeScale as PdfTypeScaleId)
      ? (overrides.typeScale as PdfTypeScaleId)
      : fallback.typeScale,
    lineHeight: pdfLineHeightIds.includes(
      overrides.lineHeight as PdfLineHeightId
    )
      ? (overrides.lineHeight as PdfLineHeightId)
      : fallback.lineHeight,
    sectionSpacing: pdfSpacingIds.includes(
      overrides.sectionSpacing as PdfSpacingId
    )
      ? (overrides.sectionSpacing as PdfSpacingId)
      : fallback.sectionSpacing,
    itemSpacing: pdfSpacingIds.includes(overrides.itemSpacing as PdfSpacingId)
      ? (overrides.itemSpacing as PdfSpacingId)
      : fallback.itemSpacing,
    accentTone: normalizeAccentTone(overrides.accentTone, fallback.accentTone),
    accentStrength: normalizeAccentStrength(
      overrides.accentStrength,
      fallback.accentStrength
    ),
  };
}

function normalizeLegacyOverrides(
  overrides: LegacyPdfPresentationInput["overrides"],
  fallback: PdfPresentationOverrides
): PdfPresentationOverrides {
  return {
    typeScale: closestPresetId(
      overrides?.fontSizePx,
      typeScaleValues,
      fallback.typeScale
    ),
    lineHeight: closestPresetId(
      typeof overrides?.lineHeight === "number" ? overrides.lineHeight : undefined,
      lineHeightValues,
      fallback.lineHeight
    ),
    sectionSpacing: closestPresetId(
      overrides?.sectionSpacingPx,
      sectionSpacingValues,
      fallback.sectionSpacing
    ),
    itemSpacing: closestPresetId(
      overrides?.itemSpacingPx,
      itemSpacingValues,
      fallback.itemSpacing
    ),
    accentTone: normalizeAccentTone(overrides?.accentTone, fallback.accentTone),
    accentStrength: normalizeAccentStrength(
      overrides?.accentStrength,
      fallback.accentStrength
    ),
  };
}

export function createDefaultPdfPresentation(): PdfPresentation {
  return {
    layoutId: "sidebar-headings",
    overrides: {
      ...pdfLayouts["sidebar-headings"].defaults,
    },
  };
}

export function normalizePdfPresentation(input: unknown): PdfPresentation {
  if (!isObject(input)) {
    return createDefaultPdfPresentation();
  }

  const presentation = input as LegacyPdfPresentationInput;
  const layoutId = normalizeLayoutId(presentation.layoutId, presentation.themeId);
  const defaults = pdfLayouts[layoutId].defaults;

  const normalizedOverrides =
    isObject(presentation.overrides) &&
    ("typeScale" in presentation.overrides ||
      typeof presentation.overrides.lineHeight === "string" ||
      "sectionSpacing" in presentation.overrides ||
      "itemSpacing" in presentation.overrides)
      ? normalizePresetOverrides(presentation.overrides, defaults)
      : normalizeLegacyOverrides(presentation.overrides, defaults);

  return {
    layoutId,
    overrides: normalizedOverrides,
  };
}

export function resolvePdfPresentation(
  presentation?: PdfPresentation
): ResolvedPdfPresentation {
  const normalizedPresentation = normalizePdfPresentation(presentation);
  const layout = pdfLayouts[normalizedPresentation.layoutId];
  const overrides = {
    ...layout.defaults,
    ...normalizedPresentation.overrides,
  };
  const bodyFontSizePx = typeScaleValues[overrides.typeScale];
  const bodyLineHeight = lineHeightValues[overrides.lineHeight];
  const articleGapPx = sectionSpacingValues[overrides.sectionSpacing];
  const itemGapPx = itemSpacingValues[overrides.itemSpacing];
  const accentColor =
    accentPalette[overrides.accentTone][overrides.accentStrength];

  return {
    layout,
    layoutId: normalizedPresentation.layoutId,
    bodyFontFamily: layout.bodyFontFamily,
    headingFontFamily: layout.headingFontFamily,
    bodyTextColor: layout.bodyTextColor,
    mutedTextColor: layout.mutedTextColor,
    accentColor,
    articleGapPx,
    itemGapPx,
    bodyFontSizePx,
    bodyLineHeight,
    nameFontSizePx:
      normalizedPresentation.layoutId === "classic-centered"
        ? Number((bodyFontSizePx * 2.55).toFixed(2))
        : Number((bodyFontSizePx * 2.35).toFixed(2)),
    sectionLabelFontSizePx:
      normalizedPresentation.layoutId === "classic-centered"
        ? Number((bodyFontSizePx * 1.05).toFixed(2))
        : Number((bodyFontSizePx * 0.78).toFixed(2)),
    sectionLabelWeight: layout.sectionLabelWeight,
    sectionLabelLetterSpacingEm: layout.sectionLabelLetterSpacingEm,
    sectionLabelTransform: layout.sectionLabelTransform,
    titleFontSizePx: Number((bodyFontSizePx * 1.05).toFixed(2)),
    titleLineHeight: Number(Math.max(1.2, bodyLineHeight - 0.28).toFixed(2)),
    metaFontSizePx: Number((bodyFontSizePx * 0.92).toFixed(2)),
    contactFontSizePx: Number((bodyFontSizePx * 0.92).toFixed(2)),
    dateFontSizePx: Number((bodyFontSizePx * 0.88).toFixed(2)),
    sectionBodyGapPx: Number(Math.max(4, itemGapPx * 0.12).toFixed(2)),
    itemPaddingBottomPx: itemGapPx,
    itemBorderColor: "#cbd5e1",
    headingWeight: layout.headingWeight,
  };
}
