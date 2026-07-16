import type { ResumeFontId } from "@/features/resume-editor/domain/presentation/font-collection";
import type {
  PdfFontScaleId,
  PdfLayoutId,
  PdfLineHeightId,
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
  // Curation rules, derived from what each layout's CSS actually reads:
  //
  // 1. `secondary` is set ONLY for the three layouts that render it —
  //    modern-centered (the rule under the name), sidebar (the rail tint) and
  //    split (the rail fill). Everywhere else it is invisible, so setting it
  //    would be dead data that getActiveTemplatePresetId still has to match on.
  // 2. `accent` is spent differently per layout. On banner/sidebar it is a
  //    full bleed band and needs enough depth for white text; on bold-type it is
  //    the heading highlighter and the dates, so it must be vivid rather than
  //    near-black; elsewhere it is heading text.
  // 3. Density follows the layout's structure, not taste: rails and label
  //    gutters spend width, so they run tighter; whitespace-led layouts run airy.
  // 4. Fonts are chosen for the layout's character, and every preset names one —
  //    no layout hardcodes a font behind the user's back.

  // classic — traditional single column, rule under each heading. The ATS-safest
  // layout, so one preset is a deliberately plain, maximum-compatibility pick.
  // Matches the stock default, so a fresh draft opens on a named template.
  {
    id: "classic-modern",
    label: "Modern",
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
  // Arial + near-black, no flourish: the safest thing to put in a parser.
  {
    id: "classic-ats",
    label: "ATS Safe",
    layoutId: "classic",
    style: {
      accent: "#1f2937",
      fontFamilyId: "arial",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },

  // sidebar — accent band over a secondary-tinted rail. Two colour slots, so
  // accent and secondary are siblings: same hue family, enough gap to read.
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
      secondary: "#15803d",
      fontFamilyId: "lato",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
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

  // modern-centered — secondary is the short rule under the name and headings,
  // so it is set a step brighter than the accent to actually register.
  {
    id: "centered-ocean",
    label: "Ocean",
    layoutId: "modern-centered",
    style: {
      accent: "#0369a1",
      secondary: "#38bdf8",
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
      secondary: "#e11d48",
      fontFamilyId: "playfair-display",
      fontScale: "md",
      spacing: "airy",
      lineHeight: "relaxed",
    },
  },

  // timeline — accent draws the dots and the date gutter. The gutter already
  // spends width, so these stay at standard density.
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

  // academic — dense CV in small-caps. Serif by convention, and small scale
  // because a real CV runs long.
  {
    id: "academic-oxford",
    label: "Oxford",
    layoutId: "academic",
    style: {
      accent: "#1e3a8a",
      fontFamilyId: "georgia",
      fontScale: "sm",
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
  {
    id: "academic-journal",
    label: "Journal",
    layoutId: "academic",
    style: {
      accent: "#111827",
      fontFamilyId: "times-new-roman",
      fontScale: "sm",
      spacing: "compact",
      lineHeight: "standard",
    },
  },

  // minimal — whitespace is the layout. Airy and relaxed, or it is just classic.
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
    label: "Warm",
    layoutId: "minimal",
    style: {
      accent: "#9a3412",
      fontFamilyId: "lora",
      fontScale: "md",
      spacing: "airy",
      lineHeight: "relaxed",
    },
  },
  // No colour at all — the most restrained thing the editor can produce.
  {
    id: "minimal-mono",
    label: "Mono",
    layoutId: "minimal",
    style: {
      accent: "#111827",
      fontFamilyId: "inter",
      fontScale: "sm",
      spacing: "airy",
      lineHeight: "relaxed",
    },
  },

  // inset — the label gutter eats 110px, so these run tight to keep the
  // content column wide enough to read.
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

  // banner — accent is a full-bleed band behind white text, so every pick is
  // deep enough to carry it. No secondary: banner never renders one.
  {
    id: "banner-royal",
    label: "Royal",
    layoutId: "banner",
    style: {
      accent: "#1d4ed8",
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
      fontFamilyId: "roboto",
      fontScale: "md",
      spacing: "compact",
      lineHeight: "standard",
    },
  },

  // split — secondary fills the full-height rail and accent is the name beside
  // it, so the two are set far enough apart to separate the columns.
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

  // bold-type — accent is the marker highlight under each heading and the date
  // colour, NOT the heading text. It has to be vivid; a near-black accent here
  // renders the highlight as a grey smudge.
  {
    id: "bold-citrus",
    label: "Citrus",
    layoutId: "bold-type",
    style: {
      accent: "#ea580c",
      fontFamilyId: "inter",
      fontScale: "md",
      spacing: "compact",
      lineHeight: "tight",
    },
  },
  {
    id: "bold-lime",
    label: "Lime",
    layoutId: "bold-type",
    style: {
      accent: "#65a30d",
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
 * user's paperSize and clears photoShape so the layout's native photo look
 * applies. Page margin follows the layout, so a preset never sets it.
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
      (presentation.photoShape ?? null) === null
    ) {
      return preset.id;
    }
  }
  return null;
}
