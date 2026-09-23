import type { ResumeFontId } from "@/features/resume-editor/domain/presentation/font-collection";
import type {
  PdfFontScaleId,
  PdfLayoutId,
  PdfLineHeightId,
  PdfPresentation,
  PdfSpacingId,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";

/** The style half of a template. `secondary` is explicit — a preset either sets it or clears it back to the accent fallback. */
type ResumeTemplateStyle = {
  accent: string;
  secondary?: string;
  fontFamilyId: ResumeFontId;
  fontScale: PdfFontScaleId;
  spacing: PdfSpacingId;
  lineHeight: PdfLineHeightId;
};

/** A layout plus a curated style. Applying one is a single undo step; paperSize is untouched, photoShape resets. */
export type ResumeTemplatePreset = {
  id: string;
  label: string;
  layoutId: PdfLayoutId;
  style: ResumeTemplateStyle;
};

export const resumeTemplatePresets: ReadonlyArray<ResumeTemplatePreset> = [
  // Curation rules: `secondary` only for layouts that render it (else it's dead data the
  // active-template match still compares); density follows layout structure, not taste.
  // A display sans (Poppins, Montserrat) only goes on a layout whose type is large;
  // narrow-column layouts get a text sans that stays readable at 11px.

  // classic — traditional single column. Plain, ATS-safest pick; matches the stock default.
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

  // folio — the accent draws the frame around every sheet as well as the rule
  // under each heading, so it carries more of the page than most: it wants a
  // colour with enough body to hold a 2px line, and no secondary, which the
  // layout never renders.
  {
    id: "folio-slate",
    label: "Slate",
    layoutId: "folio",
    style: {
      accent: "#5b7c99",
      fontFamilyId: "open-sans",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "folio-ink",
    label: "Ink",
    layoutId: "folio",
    style: {
      accent: "#1f2937",
      fontFamilyId: "lora",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "folio-claret",
    label: "Claret",
    layoutId: "folio",
    style: {
      accent: "#9f1239",
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

  // inset — the label gutter eats 110px, so these run tight to keep the
  // content column wide enough to read.
  {
    id: "inset-steel",
    label: "Steel",
    layoutId: "inset",
    style: {
      accent: "#0f766e",
      fontFamilyId: "work-sans",
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

  // duet — accent is the pale left column, secondary inks the banded headings.
  {
    id: "duet-stone",
    label: "Stone",
    layoutId: "duet",
    style: {
      accent: "#e4e4e7",
      secondary: "#3f3f46",
      fontFamilyId: "lora",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "duet-harbor",
    label: "Harbor",
    layoutId: "duet",
    style: {
      accent: "#e0f2f1",
      secondary: "#0f766e",
      fontFamilyId: "inter",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },

  // bold-type — accent is the marker highlight and date colour, not the heading text;
  // it has to be vivid, or the highlight reads as a grey smudge.
  {
    id: "bold-citrus",
    label: "Citrus",
    layoutId: "bold-type",
    style: {
      accent: "#ea580c",
      fontFamilyId: "poppins",
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

  // studio — badges and chips carry the page, so the accent has to survive being
  // shrunk to a 12% tint. Mid-tone hues only; pale ones vanish in the chip fill.
  {
    id: "studio-violet",
    label: "Violet",
    layoutId: "studio",
    style: {
      accent: "#7c3aed",
      fontFamilyId: "plus-jakarta-sans",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "studio-teal",
    label: "Teal",
    layoutId: "studio",
    style: {
      accent: "#0d9488",
      fontFamilyId: "open-sans",
      fontScale: "md",
      spacing: "airy",
      lineHeight: "relaxed",
    },
  },

  // aurora — two soft colour circles at the top of the band, fading to paper
  // white. Both stay light: the name and contacts sit on them in dark text.
  {
    id: "aurora-haze",
    label: "Haze",
    layoutId: "aurora",
    style: {
      accent: "#a78bfa",
      secondary: "#a5f3fc",
      fontFamilyId: "inter",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "aurora-peach",
    label: "Peach",
    layoutId: "aurora",
    style: {
      accent: "#fda4af",
      secondary: "#fdba74",
      fontFamilyId: "dm-sans",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  // ledger — monochrome by construction: accent only paints the heading rule,
  // so near-black reads as intended, not a colour the layout forgot.
  {
    id: "ledger-graphite",
    label: "Graphite",
    layoutId: "ledger",
    style: {
      accent: "#111827",
      fontFamilyId: "lato",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "ledger-ink",
    label: "Ink",
    layoutId: "ledger",
    style: {
      accent: "#1e3a5f",
      fontFamilyId: "georgia",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },

  // dossier — accent is heading text in the main column, secondary fills the
  // right rail. Deep secondary, near-black accent: the rail is the only colour.
  {
    id: "dossier-navy",
    label: "Navy",
    layoutId: "dossier",
    style: {
      accent: "#111827",
      secondary: "#152a4a",
      fontFamilyId: "lato",
      fontScale: "sm",
      spacing: "compact",
      lineHeight: "standard",
    },
  },
  {
    id: "dossier-forest",
    label: "Forest",
    layoutId: "dossier",
    style: {
      accent: "#14261d",
      secondary: "#1f3d2b",
      fontFamilyId: "manrope",
      fontScale: "sm",
      spacing: "compact",
      lineHeight: "standard",
    },
  },

  // crest — accent is the whole band behind the photo, name and contact strip,
  // so it must be dark enough for on-accent text to sit on it.
  {
    id: "crest-charcoal",
    label: "Charcoal",
    layoutId: "crest",
    style: {
      accent: "#2f2f2f",
      fontFamilyId: "georgia",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "crest-burgundy",
    label: "Burgundy",
    layoutId: "crest",
    style: {
      accent: "#5b1f2a",
      fontFamilyId: "georgia",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },

  // masthead — accent is the name plate (large, can be bright); secondary fills
  // heading badges (small, dark enough for white text at caption size).
  {
    id: "masthead-citrus",
    label: "Citrus",
    layoutId: "masthead",
    style: {
      accent: "#f7d949",
      secondary: "#111827",
      fontFamilyId: "montserrat",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "masthead-cobalt",
    label: "Cobalt",
    layoutId: "masthead",
    style: {
      accent: "#2563eb",
      secondary: "#0f172a",
      fontFamilyId: "inter",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  // compass — accent is the marginal glyph and the rail links, nothing else.
  // Mid-tone hues: at 1em a pale glyph disappears against paper.
  {
    id: "compass-slate",
    label: "Slate",
    layoutId: "compass",
    style: {
      accent: "#475569",
      fontFamilyId: "ibm-plex-sans",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "compass-cerulean",
    label: "Cerulean",
    layoutId: "compass",
    style: {
      accent: "#0284c7",
      fontFamilyId: "open-sans",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },

  // numeral — accent is the 01/02/03 index and nothing else, so it reads as a
  // single spot colour on an otherwise black-and-white page.
  {
    id: "numeral-mono",
    label: "Mono",
    layoutId: "numeral",
    style: {
      accent: "#111827",
      fontFamilyId: "arial",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "numeral-signal",
    label: "Signal",
    layoutId: "numeral",
    style: {
      accent: "#dc2626",
      fontFamilyId: "inter",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },

  // atlas — accent fills the numbered disc on every item, so it needs enough
  // weight to carry white text at 0.7em.
  {
    id: "atlas-onyx",
    label: "Onyx",
    layoutId: "atlas",
    style: {
      accent: "#171717",
      fontFamilyId: "source-sans-3",
      fontScale: "sm",
      spacing: "compact",
      lineHeight: "standard",
    },
  },
  {
    id: "atlas-marine",
    label: "Marine",
    layoutId: "atlas",
    style: {
      accent: "#075985",
      fontFamilyId: "lato",
      fontScale: "sm",
      spacing: "compact",
      lineHeight: "standard",
    },
  },

  // editorial — secondary tints the opening band behind display-size text, so
  // it has to stay pale; accent is spent on headings and links only.
  {
    id: "editorial-sand",
    label: "Sand",
    layoutId: "editorial",
    style: {
      accent: "#44403c",
      secondary: "#d6c3a5",
      fontFamilyId: "lora",
      fontScale: "sm",
      spacing: "airy",
      lineHeight: "relaxed",
    },
  },
  {
    id: "editorial-sage",
    label: "Sage",
    layoutId: "editorial",
    style: {
      accent: "#334155",
      secondary: "#a7c4b5",
      fontFamilyId: "inter",
      fontScale: "sm",
      spacing: "airy",
      lineHeight: "relaxed",
    },
  },
  // harvard — the MCS format is monochrome by construction and never reads the
  // accent. Sans takes a lighter slate only so the two presets' gallery swatches
  // tell apart; it changes nothing on the page.
  {
    id: "harvard-serif",
    label: "Serif",
    layoutId: "harvard",
    style: {
      accent: "#111827",
      fontFamilyId: "times-new-roman",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "harvard-sans",
    label: "Sans",
    layoutId: "harvard",
    style: {
      accent: "#64748b",
      fontFamilyId: "lato",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },

  // rirekisho — a printed form, so the accent only inks the section rows: dark
  // for Gothic, a lighter slate for Mincho, so the gallery swatches tell apart.
  // Both fonts are system stacks: their generic fallback is what picks up a
  // Japanese face (gothic for sans, mincho for serif).
  {
    id: "rirekisho-gothic",
    label: "Gothic",
    layoutId: "rirekisho",
    style: {
      accent: "#111827",
      fontFamilyId: "arial",
      fontScale: "md",
      spacing: "compact",
      lineHeight: "standard",
    },
  },
  {
    id: "rirekisho-mincho",
    label: "Mincho",
    layoutId: "rirekisho",
    style: {
      accent: "#64748b",
      fontFamilyId: "times-new-roman",
      fontScale: "md",
      spacing: "compact",
      lineHeight: "standard",
    },
  },

  // marquee — two colours doing two jobs: the secondary paints the band and the
  // heading glyphs, the accent lights the name, the heading bars and the dates.
  // Both are curated, and the secondary must stay dark enough that
  // `readableTextOn` answers white — the band is the only surface on the page.
  // The accent has to read against that dark band *and* against white paper, so
  // these lean warm and mid-toned rather than pastel.
  {
    id: "marquee-amber",
    label: "Amber",
    layoutId: "marquee",
    style: {
      accent: "#e8a33d",
      secondary: "#2f2f2f",
      fontFamilyId: "work-sans",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "marquee-teal",
    label: "Teal",
    layoutId: "marquee",
    style: {
      accent: "#2bb6a3",
      secondary: "#14343a",
      fontFamilyId: "dm-sans",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "marquee-oxblood",
    label: "Oxblood",
    layoutId: "marquee",
    style: {
      accent: "#c2544a",
      secondary: "#2b1c1c",
      fontFamilyId: "source-sans-3",
      fontScale: "md",
      spacing: "airy",
      lineHeight: "relaxed",
    },
  },

  // meridian — both colours land in one place, the rail, and they are read as a
  // journey rather than as a tint: two *different* hues, roughly a quarter to a
  // third of the wheel apart, so the ramp has somewhere to travel. Same hue at
  // two depths reads as a shadow, not a gradient. Further apart than this and
  // even oklab runs the middle through mud. Nothing on the page sits on either
  // colour, so neither has to hold text — only the pairing has to be good.
  {
    // Amber into plum, by way of a warm rose.
    id: "meridian-sunset",
    label: "Sunset",
    layoutId: "meridian",
    style: {
      accent: "#f2a25c",
      secondary: "#6d3b8f",
      fontFamilyId: "nunito-sans",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    // Teal into indigo, through the cyans. The coolest of the three.
    id: "meridian-lagoon",
    label: "Lagoon",
    layoutId: "meridian",
    style: {
      accent: "#2ec4b6",
      secondary: "#22357f",
      fontFamilyId: "raleway",
      fontScale: "md",
      spacing: "airy",
      lineHeight: "relaxed",
    },
  },
  {
    // Warm yellow into forest, the whole ramp passing through green.
    id: "meridian-meadow",
    label: "Meadow",
    layoutId: "meridian",
    style: {
      accent: "#eec84a",
      secondary: "#1a6b52",
      fontFamilyId: "source-sans-3",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },

  // monolith — the accent is the entire page, not a detail on it, so these are
  // the only presets whose accent has to be a colour you would paint a wall.
  // It must also stay dark enough that `readableTextOn` answers white: the
  // layout has one foreground and it is that answer. No secondary — the design
  // is two colours, and a curated third would be data the page cannot show.
  // The font pick chooses which voice leads: a sans here puts serif in the rail
  // and the prose, a serif flips both.
  {
    id: "monolith-cobalt",
    label: "Cobalt",
    layoutId: "monolith",
    style: {
      accent: "#2f4fbf",
      fontFamilyId: "inter",
      fontScale: "sm",
      spacing: "airy",
      lineHeight: "standard",
    },
  },
  {
    id: "monolith-ink",
    label: "Ink",
    layoutId: "monolith",
    style: {
      accent: "#18181b",
      fontFamilyId: "lora",
      fontScale: "sm",
      spacing: "airy",
      lineHeight: "standard",
    },
  },
  {
    id: "monolith-clay",
    label: "Clay",
    layoutId: "monolith",
    style: {
      accent: "#7c3a2a",
      fontFamilyId: "open-sans",
      fontScale: "sm",
      spacing: "airy",
      lineHeight: "standard",
    },
  },

  // duotone — a 0.42fr tint rail beside a saturated main column. The accent is
  // spent as a full-page fill, so it has to stay dark enough for light type;
  // narrow rail means a text sans, never a display one.
  {
    id: "duotone-iris",
    label: "Iris",
    layoutId: "duotone",
    style: {
      accent: "#5348a8",
      fontFamilyId: "source-sans-3",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "duotone-pine",
    label: "Pine",
    layoutId: "duotone",
    style: {
      accent: "#255c4b",
      fontFamilyId: "lato",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "duotone-slate",
    label: "Slate",
    layoutId: "duotone",
    style: {
      accent: "#3b4a5a",
      fontFamilyId: "ibm-plex-sans",
      fontScale: "sm",
      spacing: "standard",
      lineHeight: "standard",
    },
  },

  // lintel — the accent is spent twice: the band behind every heading (at 5%)
  // and the heading text on it, so it has to stay dark enough to read against
  // its own tint. No secondary, which the layout never renders.
  {
    id: "lintel-harbour",
    label: "Harbour",
    layoutId: "lintel",
    style: {
      accent: "#1e4b6b",
      fontFamilyId: "lato",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "lintel-forest",
    label: "Forest",
    layoutId: "lintel",
    style: {
      accent: "#14532d",
      fontFamilyId: "source-sans-3",
      fontScale: "md",
      spacing: "standard",
      lineHeight: "standard",
    },
  },
  {
    id: "lintel-plum",
    label: "Plum",
    layoutId: "lintel",
    style: {
      accent: "#6b21a8",
      fontFamilyId: "work-sans",
      fontScale: "md",
      spacing: "airy",
      lineHeight: "relaxed",
    },
  },
];

export const templateCategoryIds = ["ats", "professional", "creative"] as const;
export type TemplateCategoryId = (typeof templateCategoryIds)[number];

/** Categories hang off the layout, not the preset — a layout carries every category
 *  it honestly reads as. Keying on PdfLayoutId makes a new layout a type error. */
const layoutCategories: Record<
  PdfLayoutId,
  ReadonlyArray<TemplateCategoryId>
> = {
  classic: ["ats"],
  academic: ["ats"],
  // Two columns, so not an "ats" chip however plain it looks — the ATS scorer
  // fails every two-column layout, and the chip must not promise otherwise.
  ledger: ["professional"],
  dossier: ["professional"],
  crest: ["professional", "creative"],
  masthead: ["creative"],
  compass: ["professional"],
  numeral: ["ats", "professional"],
  atlas: ["creative"],
  editorial: ["creative"],
  harvard: ["ats", "professional"],
  // A Japanese form: it is read by a person, never fed to a Western parser.
  rirekisho: ["professional"],
  folio: ["ats", "professional"],
  marquee: ["professional", "creative"],
  meridian: ["professional", "creative"],
  lintel: ["ats", "professional"],
  inset: ["ats", "professional"],
  timeline: ["ats", "creative"],
  split: ["professional"],
  duet: ["professional"],
  "bold-type": ["creative"],
  studio: ["creative"],
  aurora: ["creative"],
  monolith: ["creative"],
  duotone: ["creative"],
};

export function templateCategories(
  preset: ResumeTemplatePreset,
): ReadonlyArray<TemplateCategoryId> {
  return layoutCategories[preset.layoutId];
}

/** "Bold Type Citrus" — the layout id titled, then the preset's own label. */
/** "bold-type" → "Bold Type". */
export function layoutLabel(layoutId: PdfLayoutId): string {
  return layoutId
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

/** One entry per layout, its presets in curation order, sorted by layout name.
 * The editor gallery and /templates both show a card per entry. */
export const resumeTemplateLayouts: ReadonlyArray<{
  layoutId: PdfLayoutId;
  presets: ReadonlyArray<ResumeTemplatePreset>;
}> = Object.values(
  Object.groupBy(resumeTemplatePresets, (preset) => preset.layoutId),
)
  .filter((presets) => presets !== undefined)
  .map((presets) => ({ layoutId: presets[0].layoutId, presets }))
  .sort((a, b) => layoutLabel(a.layoutId).localeCompare(layoutLabel(b.layoutId)));

export function templateLabel(preset: ResumeTemplatePreset): string {
  return `${layoutLabel(preset.layoutId)} ${preset.label}`;
}

/** Applies layout + curated style in one shot; preserves paperSize, clears photoShape. */
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
    // A user preference, not part of a curated style — preserved like paperSize.
    linkHighlight: current.linkHighlight,
  };
}

/** Applies only the preset's layout, preserving all of the user's style. */
export function applyTemplatePresetLayoutOnly(
  preset: ResumeTemplatePreset,
  current: PdfPresentation,
): PdfPresentation {
  return { ...current, layoutId: preset.layoutId };
}

/** Derives the active template from the current presentation (not a stored selection), so a hand-tweak drops the highlight naturally. */
export function getActiveTemplatePresetId(
  presentation: PdfPresentation,
): string | null {
  for (const preset of resumeTemplatePresets) {
    const applied = applyTemplatePreset(preset, presentation);
    // Compare only the keys `applyTemplatePreset` writes, so a new style key is covered
    // once applied there too; `?? null` bridges undefined (preset) vs null (stored).
    const isActive = (
      Object.keys(applied) as Array<keyof typeof applied>
    ).every((key) => (applied[key] ?? null) === (presentation[key] ?? null));
    if (isActive) return preset.id;
  }
  return null;
}
