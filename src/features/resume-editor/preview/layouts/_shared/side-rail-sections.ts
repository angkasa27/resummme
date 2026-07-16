import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { LayoutColumn } from "@/features/resume-editor/preview/layout-types";

/**
 * Sections that belong in a side rail: short, scannable, and self-contained
 * enough to read in a narrow column. Shared by the rail layouts (sidebar,
 * split) so the two can never drift apart on what a rail holds.
 */
const SIDE_SECTIONS = new Set<CollectionSectionKey>([
  "skills",
  "languages",
  "certifications",
  "references",
]);

export function getSideRailColumn(sectionKey: CollectionSectionKey): LayoutColumn {
  return SIDE_SECTIONS.has(sectionKey) ? "side" : "main";
}
