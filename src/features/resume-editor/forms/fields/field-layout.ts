import type { ItemFieldConfig } from "@/features/resume-editor/domain/sections/collection-section-config";

type FieldKind = ItemFieldConfig["kind"];

/**
 * Columns each field kind takes in the item grid.
 *
 * Derived from the kind rather than declared per field: 0 config edits instead
 * of 44, and a new section config gets a sane layout for free. If one field
 * ever needs to deviate, add `span?: 1 | 2` to `ItemFieldConfig` and fall back
 * to this table — don't hand-annotate all of them.
 */
export const fieldSpanByKind: Record<FieldKind, 1 | 2> = {
  text: 1,
  email: 1,
  monthYear: 1,
  proficiency: 1,
  // URLs truncate badly in a half-width column.
  url: 2,
  stringArray: 2,
  textarea: 2,
  richText: 2,
  // Splits into its own start/end pair, so it needs the full row.
  dateRange: 2,
};

/**
 * Where the label sits. Rule: float it into the control when the control's
 * *empty* height is a single line; stack it above otherwise — a floating label
 * over a 3-row textarea or a rich-text toolbar has nowhere sensible to rest and
 * animates across the chrome.
 *
 * `richText` is the exception: it draws its own in-editor placeholder and takes
 * an `ariaLabel`, so a visible label would just repeat what the hint already
 * says above a control that's tall enough to be unmistakable.
 */
export const fieldLabelVariantByKind: Record<
  FieldKind,
  "float" | "stacked" | "none"
> = {
  text: "float",
  email: "float",
  url: "float",
  monthYear: "float",
  proficiency: "float",
  stringArray: "float",
  dateRange: "float",
  textarea: "stacked",
  richText: "none",
};

/** `Field`'s `className` for a control taking `span` columns in the item grid. */
export function spanClassName(span?: 1 | 2): string | undefined {
  return span === 2 ? "col-span-full" : undefined;
}
