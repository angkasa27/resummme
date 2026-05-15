export const pdfLayoutIds = [
  "sidebar-headings",
  "classic-centered",
  "modern-block",
] as const;

export type PdfLayoutId = (typeof pdfLayoutIds)[number];

export const pdfProfileLayoutIds = [
  "sidebar-profile",
  "centered-portrait-profile",
  "compact-inline-profile",
  "banner-profile",
] as const;

export type PdfProfileLayoutId = (typeof pdfProfileLayoutIds)[number];

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
  spacing: PdfSpacingId;
  accentTone: PdfAccentTone;
  accentStrength: PdfAccentStrength;
};

export type PdfPresentation = {
  layoutId: PdfLayoutId;
  profileLayoutId: PdfProfileLayoutId;
  overrides: PdfPresentationOverrides;
};

type LegacyPdfPresentationInput = {
  layoutId?: unknown;
  profileLayoutId?: unknown;
  themeId?: unknown;
  overrides?: {
    typeScale?: unknown;
    lineHeight?: unknown;
    spacing?: unknown;
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
  defaults: PdfPresentationOverrides;
  headingWeight: number;
  sectionLabelWeight: number;
  sectionLabelLetterSpacingEm: number;
  sectionLabelTransform: "uppercase" | "none";
  summaryLabelVisible: boolean;
};

export type ResolvedPdfPresentation = {
  layout: PdfLayoutDefinition;
  layoutId: PdfLayoutId;
  profileLayoutId: PdfProfileLayoutId;
  bodyFontFamily: string;
  headingFontFamily: string;
  bodyTextColor: string;
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
  "modern-block": "Modern Block",
};

export const pdfProfileLayoutLabels: Record<PdfProfileLayoutId, string> = {
  "sidebar-profile": "Sidebar Profile",
  "centered-portrait-profile": "Centered Portrait",
  "compact-inline-profile": "Compact Inline",
  "banner-profile": "Accent Banner",
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

const accentPalette: Record<
  PdfAccentTone,
  Record<PdfAccentStrength, string>
> = {
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
  small: 11,
  standard: 12,
  large: 14,
};

const lineHeightValues: Record<PdfLineHeightId, number> = {
  tight: 1.4,
  standard: 1.6,
  relaxed: 1.9,
};

const sectionSpacingValues: Record<PdfSpacingId, number> = {
  compact: 16,
  standard: 20,
  airy: 24,
};

const itemSpacingValues: Record<PdfSpacingId, number> = {
  compact: 8,
  standard: 12,
  airy: 16,
};

export const pdfLayouts: Record<PdfLayoutId, PdfLayoutDefinition> = {
  "sidebar-headings": {
    id: "sidebar-headings",
    label: "Sidebar Headings",
    description: "Section labels sit in a slim left column.",
    bodyFontFamily: 'var(--font-sans), "Helvetica Neue", Arial, sans-serif',
    headingFontFamily: 'var(--font-sans), "Helvetica Neue", Arial, sans-serif',
    bodyTextColor: "#111827",
    defaults: {
      typeScale: "standard",
      lineHeight: "standard",
      spacing: "standard",
      accentTone: "blue",
      accentStrength: "balanced",
    },
    headingWeight: 600,
    sectionLabelWeight: 600,
    sectionLabelLetterSpacingEm: 0.18,
    sectionLabelTransform: "uppercase",
    summaryLabelVisible: true,
  },
  "classic-centered": {
    id: "classic-centered",
    label: "Classic Centered",
    description: "Centered header and top section titles inspired by your CV.",
    bodyFontFamily: 'var(--font-sans), "Helvetica Neue", Arial, sans-serif',
    headingFontFamily: 'var(--font-sans), "Helvetica Neue", Arial, sans-serif',
    bodyTextColor: "#1f2937",
    defaults: {
      typeScale: "standard",
      lineHeight: "standard",
      spacing: "standard",
      accentTone: "slate",
      accentStrength: "balanced",
    },
    headingWeight: 700,
    sectionLabelWeight: 700,
    sectionLabelLetterSpacingEm: 0,
    sectionLabelTransform: "uppercase",
    summaryLabelVisible: false,
  },
  "modern-block": {
    id: "modern-block",
    label: "Modern Block",
    description:
      "Single column with bold accent-marked block headings — ATS-friendly.",
    bodyFontFamily: 'var(--font-sans), "Helvetica Neue", Arial, sans-serif',
    headingFontFamily: 'var(--font-sans), "Helvetica Neue", Arial, sans-serif',
    bodyTextColor: "#0f172a",
    defaults: {
      typeScale: "standard",
      lineHeight: "standard",
      spacing: "standard",
      accentTone: "emerald",
      accentStrength: "balanced",
    },
    headingWeight: 700,
    sectionLabelWeight: 700,
    sectionLabelLetterSpacingEm: 0.12,
    sectionLabelTransform: "uppercase",
    summaryLabelVisible: true,
  },
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function closestPresetId<T extends string>(
  value: number | undefined,
  presets: Record<T, number>,
  fallback: T,
): T {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return (
    (Object.entries(presets) as [T, number][]).sort(
      (left, right) => Math.abs(left[1] - value) - Math.abs(right[1] - value),
    )[0]?.[0] ?? fallback
  );
}

function normalizeAccentTone(
  value: unknown,
  fallback: PdfAccentTone,
): PdfAccentTone {
  return pdfAccentTones.includes(value as PdfAccentTone)
    ? (value as PdfAccentTone)
    : fallback;
}

function normalizeAccentStrength(
  value: unknown,
  fallback: PdfAccentStrength,
): PdfAccentStrength {
  return pdfAccentStrengths.includes(value as PdfAccentStrength)
    ? (value as PdfAccentStrength)
    : fallback;
}

function normalizeLayoutId(layoutId: unknown, themeId: unknown): PdfLayoutId {
  if (pdfLayoutIds.includes(layoutId as PdfLayoutId)) {
    return layoutId as PdfLayoutId;
  }

  if (typeof themeId === "string") {
    return "sidebar-headings";
  }

  return "sidebar-headings";
}

function defaultProfileLayoutIdForLayout(
  layoutId: PdfLayoutId,
): PdfProfileLayoutId {
  if (layoutId === "classic-centered") {
    return "centered-portrait-profile";
  }

  return "sidebar-profile";
}

function normalizeProfileLayoutId(
  profileLayoutId: unknown,
  layoutId: PdfLayoutId,
): PdfProfileLayoutId {
  if (pdfProfileLayoutIds.includes(profileLayoutId as PdfProfileLayoutId)) {
    return profileLayoutId as PdfProfileLayoutId;
  }

  return defaultProfileLayoutIdForLayout(layoutId);
}

function normalizePresetOverrides(
  overrides: Record<string, unknown>,
  fallback: PdfPresentationOverrides,
): PdfPresentationOverrides {
  const normalizedSpacing = pdfSpacingIds.includes(
    overrides.spacing as PdfSpacingId,
  )
    ? (overrides.spacing as PdfSpacingId)
    : pdfSpacingIds.includes(overrides.sectionSpacing as PdfSpacingId)
      ? (overrides.sectionSpacing as PdfSpacingId)
      : fallback.spacing;

  return {
    typeScale: pdfTypeScaleIds.includes(overrides.typeScale as PdfTypeScaleId)
      ? (overrides.typeScale as PdfTypeScaleId)
      : fallback.typeScale,
    lineHeight: pdfLineHeightIds.includes(
      overrides.lineHeight as PdfLineHeightId,
    )
      ? (overrides.lineHeight as PdfLineHeightId)
      : fallback.lineHeight,
    spacing: normalizedSpacing,
    accentTone: normalizeAccentTone(overrides.accentTone, fallback.accentTone),
    accentStrength: normalizeAccentStrength(
      overrides.accentStrength,
      fallback.accentStrength,
    ),
  };
}

function normalizeLegacyOverrides(
  overrides: LegacyPdfPresentationInput["overrides"],
  fallback: PdfPresentationOverrides,
): PdfPresentationOverrides {
  return {
    typeScale: closestPresetId(
      overrides?.fontSizePx,
      typeScaleValues,
      fallback.typeScale,
    ),
    lineHeight: closestPresetId(
      typeof overrides?.lineHeight === "number"
        ? overrides.lineHeight
        : undefined,
      lineHeightValues,
      fallback.lineHeight,
    ),
    spacing: closestPresetId(
      overrides?.sectionSpacingPx,
      sectionSpacingValues,
      fallback.spacing,
    ),
    accentTone: normalizeAccentTone(overrides?.accentTone, fallback.accentTone),
    accentStrength: normalizeAccentStrength(
      overrides?.accentStrength,
      fallback.accentStrength,
    ),
  };
}

export function createDefaultPdfPresentation(): PdfPresentation {
  return {
    layoutId: "sidebar-headings",
    profileLayoutId: "sidebar-profile",
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
  const layoutId = normalizeLayoutId(
    presentation.layoutId,
    presentation.themeId,
  );
  const profileLayoutId = normalizeProfileLayoutId(
    presentation.profileLayoutId,
    layoutId,
  );
  const defaults = pdfLayouts[layoutId].defaults;

  const normalizedOverrides =
    isObject(presentation.overrides) &&
    ("typeScale" in presentation.overrides ||
      typeof presentation.overrides.lineHeight === "string" ||
      "spacing" in presentation.overrides ||
      "sectionSpacing" in presentation.overrides ||
      "itemSpacing" in presentation.overrides)
      ? normalizePresetOverrides(presentation.overrides, defaults)
      : normalizeLegacyOverrides(presentation.overrides, defaults);

  return {
    layoutId,
    profileLayoutId,
    overrides: normalizedOverrides,
  };
}

export function resolvePdfPresentation(
  presentation?: PdfPresentation,
): ResolvedPdfPresentation {
  const normalizedPresentation = normalizePdfPresentation(presentation);
  const layout = pdfLayouts[normalizedPresentation.layoutId];
  const overrides = {
    ...layout.defaults,
    ...normalizedPresentation.overrides,
  };
  const bodyFontSizePx = typeScaleValues[overrides.typeScale];
  const bodyLineHeight = lineHeightValues[overrides.lineHeight];
  const articleGapPx = sectionSpacingValues[overrides.spacing];
  const itemGapPx = itemSpacingValues[overrides.spacing];
  const accentColor =
    accentPalette[overrides.accentTone][overrides.accentStrength];

  return {
    layout,
    layoutId: normalizedPresentation.layoutId,
    profileLayoutId: normalizedPresentation.profileLayoutId,
    bodyFontFamily: layout.bodyFontFamily,
    headingFontFamily: layout.headingFontFamily,
    bodyTextColor: layout.bodyTextColor,
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
