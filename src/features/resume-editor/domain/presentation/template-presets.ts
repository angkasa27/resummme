import type { ResumeFontId } from "@/features/resume-editor/domain/presentation/font-collection";
import type {
  PdfFontScaleId,
  PdfLayoutId,
  PdfLineHeightId,
  PdfPageMargin,
  PdfPresentation,
  PdfSpacingId,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";

/**
 * The style half of a template: everything a preset curates on top of its
 * layout. `secondary` is deliberately explicit — a preset either sets it or
 * clears it back to the accent-derived fallback.
 */
export type ResumeTemplateStyle = {
  accent: string;
  secondary?: string;
  fontFamilyId: ResumeFontId;
  fontScale: PdfFontScaleId;
  spacing: PdfSpacingId;
  lineHeight: PdfLineHeightId;
  pageMargin?: PdfPageMargin;
};

/**
 * A template is a layout plus a curated style tuned for it. Applying one is a
 * single presentation commit (one undo step); it never touches paperSize, and
 * it resets photoShape so the layout's native photo look applies.
 */
export type ResumeTemplatePreset = {
  id: string;
  label: string;
  layoutId: PdfLayoutId;
  style: ResumeTemplateStyle;
};

export const resumeTemplatePresets: ReadonlyArray<ResumeTemplatePreset> = [
  // classic — traditional single column, rule-under-heading
  {
    id: "classic-executive",
    label: "Executive",
    layoutId: "classic",
    style: {
      accent: "#1e3a5f",
      fontFamilyId: "georgia",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "classic-modern",
    label: "Modern Blue",
    layoutId: "classic",
    style: {
      accent: "#2563eb",
      fontFamilyId: "inter",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "classic-compact",
    label: "Compact Teal",
    layoutId: "classic",
    style: {
      accent: "#0f766e",
      fontFamilyId: "lato",
      fontScale: "sm",
      spacing: "compact",
      lineHeight: "tight",
    },
  },
  // sidebar — tinted side rail
  {
    id: "sidebar-slate",
    label: "Slate",
    layoutId: "sidebar",
    style: {
      accent: "#334155",
      secondary: "#475569",
      fontFamilyId: "inter",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "sidebar-forest",
    label: "Forest",
    layoutId: "sidebar",
    style: {
      accent: "#166534",
      secondary: "#14532d",
      fontFamilyId: "lato",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  // Palettes inherited from the retired `tinted` layout — the rail wears a
  // tint of `secondary`, so they carry over intact.
  {
    id: "sidebar-lavender",
    label: "Lavender",
    layoutId: "sidebar",
    style: {
      accent: "#6d28d9",
      secondary: "#7c3aed",
      fontFamilyId: "inter",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "sidebar-mint",
    label: "Mint",
    layoutId: "sidebar",
    style: {
      accent: "#047857",
      secondary: "#059669",
      fontFamilyId: "lato",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  // modern-centered — centered header, airy feel
  {
    id: "centered-ocean",
    label: "Ocean",
    layoutId: "modern-centered",
    style: {
      accent: "#0369a1",
      fontFamilyId: "open-sans",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "centered-editorial",
    label: "Editorial",
    layoutId: "modern-centered",
    style: {
      accent: "#9f1239",
      fontFamilyId: "playfair-display",
      fontScale: "md",
      spacing: "airy",
      lineHeight: "relaxed",
    },
  },
  // timeline — dated rail down the left of each section
  {
    id: "timeline-indigo",
    label: "Indigo",
    layoutId: "timeline",
    style: {
      accent: "#4338ca",
      fontFamilyId: "roboto",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "timeline-amber",
    label: "Amber",
    layoutId: "timeline",
    style: {
      accent: "#b45309",
      fontFamilyId: "lora",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "relaxed",
    },
  },
  // academic — publication-friendly, serif-first
  {
    id: "academic-oxford",
    label: "Oxford",
    layoutId: "academic",
    style: {
      accent: "#1e3a8a",
      fontFamilyId: "georgia",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "academic-burgundy",
    label: "Burgundy",
    layoutId: "academic",
    style: {
      accent: "#7f1d1d",
      fontFamilyId: "merriweather",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  // minimal — quiet, whitespace-led
  {
    id: "minimal-air",
    label: "Air",
    layoutId: "minimal",
    style: {
      accent: "#0e7490",
      fontFamilyId: "inter",
      fontScale: "sm",
      spacing: "airy",
      lineHeight: "relaxed",
    },
  },
  {
    id: "minimal-warm",
    label: "Warm Stone",
    layoutId: "minimal",
    style: {
      accent: "#9a3412",
      fontFamilyId: "lora",
      fontScale: "md",
      spacing: "airy",
      lineHeight: "relaxed",
    },
  },
  // inset — framed page
  {
    id: "inset-steel",
    label: "Steel",
    layoutId: "inset",
    style: {
      accent: "#0f766e",
      fontFamilyId: "open-sans",
      fontScale: "sm",
      spacing: "compact",
      lineHeight: "standard",
    },
  },
  {
    id: "inset-crimson",
    label: "Crimson",
    layoutId: "inset",
    style: {
      accent: "#b91c1c",
      fontFamilyId: "georgia",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  // banner — edge-to-edge accent band
  {
    id: "banner-royal",
    label: "Royal",
    layoutId: "banner",
    style: {
      accent: "#1d4ed8",
      secondary: "#1e40af",
      fontFamilyId: "inter",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "banner-emerald",
    label: "Emerald",
    layoutId: "banner",
    style: {
      accent: "#047857",
      secondary: "#065f46",
      fontFamilyId: "lato",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "banner-charcoal",
    label: "Charcoal",
    layoutId: "banner",
    style: {
      accent: "#1f2937",
      secondary: "#111827",
      fontFamilyId: "roboto",
      fontScale: "md",
      spacing: "compact",
      lineHeight: "standard",
    },
  },
  // split — full-height colored rail
  {
    id: "split-midnight",
    label: "Midnight",
    layoutId: "split",
    style: {
      accent: "#0369a1",
      secondary: "#0f172a",
      fontFamilyId: "inter",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "split-terracotta",
    label: "Terracotta",
    layoutId: "split",
    style: {
      accent: "#9a3412",
      secondary: "#7c2d12",
      fontFamilyId: "lora",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  // bold-type — typographic poster
  {
    id: "bold-noir",
    label: "Noir",
    layoutId: "bold-type",
    style: {
      accent: "#111827",
      secondary: "#dc2626",
      fontFamilyId: "inter",
      fontScale: "md",
      spacing: "compact",
      lineHeight: "tight",
    },
  },
  {
    id: "bold-highlight",
    label: "Highlighter",
    layoutId: "bold-type",
    style: {
      accent: "#18181b",
      secondary: "#a3e635",
      fontFamilyId: "roboto",
      fontScale: "lg",
      spacing: "standard",
      lineHeight: "tight",
    },
  },
];

/** Presets grouped by layout, in registry order of first appearance. */
export function getTemplatePresetsByLayout(): Map<
  PdfLayoutId,
  ResumeTemplatePreset[]
> {
  const groups = new Map<PdfLayoutId, ResumeTemplatePreset[]>();
  for (const preset of resumeTemplatePresets) {
    const group = groups.get(preset.layoutId);
    if (group) {
      group.push(preset);
    } else {
      groups.set(preset.layoutId, [preset]);
    }
  }
  return groups;
}

/**
 * Applies a template in one shot: layout + curated style. Preserves the
 * user's paperSize (and pageMargin unless the preset opts in) and clears
 * photoShape so the layout's native photo look applies.
 */
export function applyTemplatePreset(
  preset: ResumeTemplatePreset,
  current: PdfPresentation,
): PdfPresentation {
  return {
    layoutId: preset.layoutId,
    accent: preset.style.accent,
    secondary: preset.style.secondary,
    fontFamilyId: preset.style.fontFamilyId,
    fontScale: preset.style.fontScale,
    spacing: preset.style.spacing,
    lineHeight: preset.style.lineHeight,
    paperSize: current.paperSize,
    pageMargin: preset.style.pageMargin ?? current.pageMargin,
    photoShape: undefined,
  };
}

/**
 * Derives the active template from the current presentation instead of
 * persisting a selection: the moment the user hand-tweaks any curated field,
 * the highlight naturally drops off.
 */
export function getActiveTemplatePresetId(
  presentation: PdfPresentation,
): string | null {
  for (const preset of resumeTemplatePresets) {
    const applied = applyTemplatePreset(preset, presentation);
    if (
      applied.layoutId === presentation.layoutId &&
      applied.accent === presentation.accent &&
      (applied.secondary ?? null) === (presentation.secondary ?? null) &&
      applied.fontFamilyId === presentation.fontFamilyId &&
      applied.fontScale === presentation.fontScale &&
      applied.spacing === presentation.spacing &&
      applied.lineHeight === presentation.lineHeight &&
      applied.pageMargin === presentation.pageMargin &&
      (presentation.photoShape ?? null) === null
    ) {
      return preset.id;
    }
  }
  return null;
}
