import {
  resumeTemplateLayouts,
  templateCategories,
  templateCategoryIds,
  type TemplateCategoryId,
} from "@/features/resume-editor/domain/presentation/template-presets";

/** "All" plus every domain category, derived — a new category becomes a chip
 *  without a second list to keep in step. */
export const templateFilters = ["all", ...templateCategoryIds] as const;
export type CategoryFilter = "all" | TemplateCategoryId;

export function filterLabel(filter: CategoryFilter): string {
  return filter === "ats" ? "ATS" : filter[0].toUpperCase() + filter.slice(1);
}

/** The chips are links, not state — each category is its own shareable URL and
 *  the page needs no client JS. */
export function readCategory(
  raw: string | string[] | undefined,
): CategoryFilter {
  return templateFilters.includes(raw as CategoryFilter)
    ? (raw as CategoryFilter)
    : "all";
}

export function categoryHref(filter: CategoryFilter): string {
  return filter === "all" ? "/templates" : `/templates?category=${filter}`;
}

/** One card per layout, sorted by layout name like the editor gallery, so a
 *  chip only removes cards rather than reshuffling the ones that stay. */
export function layoutsInCategory(filter: CategoryFilter) {
  return resumeTemplateLayouts.filter(
    ({ presets }) =>
      filter === "all" || templateCategories(presets[0]).includes(filter),
  );
}
