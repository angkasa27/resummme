export type CarouselScreenshot = {
  /** Matches presetId; also the filename stem: public/templates/<id>.webp */
  id: string;
  /** "Classic Modern", "Sidebar Slate" — shown on hover */
  label: string;
};

export const CAROUSEL_SCREENSHOTS: CarouselScreenshot[] = [
  { id: "classic-modern", label: "Classic Modern" },
  { id: "classic-executive", label: "Classic Executive" },
  { id: "sidebar-slate", label: "Sidebar Slate" },
  { id: "sidebar-forest", label: "Sidebar Forest" },
  { id: "centered-ocean", label: "Centered Ocean" },
  { id: "centered-editorial", label: "Centered Editorial" },
  { id: "timeline-indigo", label: "Timeline Indigo" },
  { id: "timeline-amber", label: "Timeline Amber" },
  { id: "academic-oxford", label: "Academic Oxford" },
  { id: "academic-burgundy", label: "Academic Burgundy" },
  { id: "minimal-air", label: "Minimal Air" },
  { id: "minimal-warm", label: "Minimal Warm" },
  { id: "inset-steel", label: "Inset Steel" },
  { id: "inset-crimson", label: "Inset Crimson" },
  { id: "banner-royal", label: "Banner Royal" },
  { id: "banner-emerald", label: "Banner Emerald" },
  { id: "split-midnight", label: "Split Midnight" },
  { id: "split-terracotta", label: "Split Terracotta" },
  { id: "bold-citrus", label: "Bold Citrus" },
  { id: "bold-lime", label: "Bold Lime" },
];
