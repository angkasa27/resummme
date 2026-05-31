export const RESUME_FONTS = [
  // Sans-serif — Google Fonts
  {
    id: "inter",
    name: "Inter",
    category: "sans",
    source: "google",
    // Reuses the existing --font-sans variable (Inter is already loaded in layout).
    stack: 'var(--font-sans), sans-serif',
  },
  {
    id: "lato",
    name: "Lato",
    category: "sans",
    source: "google",
    stack: 'var(--font-lato), sans-serif',
  },
  {
    id: "open-sans",
    name: "Open Sans",
    category: "sans",
    source: "google",
    stack: 'var(--font-open-sans), sans-serif',
  },
  {
    id: "roboto",
    name: "Roboto",
    category: "sans",
    source: "google",
    stack: 'var(--font-roboto), sans-serif',
  },
  // Serif — Google Fonts
  {
    id: "merriweather",
    name: "Merriweather",
    category: "serif",
    source: "google",
    stack: 'var(--font-merriweather), serif',
  },
  {
    id: "playfair-display",
    name: "Playfair Display",
    category: "serif",
    source: "google",
    stack: 'var(--font-playfair-display), serif',
  },
  {
    id: "lora",
    name: "Lora",
    category: "serif",
    source: "google",
    stack: 'var(--font-lora), serif',
  },
  // System / web-safe fonts — no CSS variable needed
  {
    id: "arial",
    name: "Arial",
    category: "sans",
    source: "system",
    stack: 'Arial, Helvetica, sans-serif',
  },
  {
    id: "georgia",
    name: "Georgia",
    category: "serif",
    source: "system",
    stack: 'Georgia, "Times New Roman", serif',
  },
  {
    id: "times-new-roman",
    name: "Times New Roman",
    category: "serif",
    source: "system",
    stack: '"Times New Roman", Times, serif',
  },
] as const;

export type ResumeFontId = (typeof RESUME_FONTS)[number]["id"];

export const resumeFontIds = RESUME_FONTS.map(
  (f) => f.id,
) as [ResumeFontId, ...ResumeFontId[]];

export const DEFAULT_FONT_ID: ResumeFontId = "inter";

export function getFont(id: ResumeFontId) {
  return RESUME_FONTS.find((f) => f.id === id) ?? RESUME_FONTS[0];
}
