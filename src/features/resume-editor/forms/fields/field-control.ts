/**
 * The single box every form control in an item form wears.
 *
 * The background is pinned across every state — hover, expanded, dark — so the
 * control box stays visually consistent instead of drifting to `hover:bg-muted`
 * or similar per-state backgrounds; hover feedback is carried by the
 * border/ring instead, exactly like `Input` (which has no hover background at
 * all).
 */
export const FIELD_CONTROL_CLASS = [
  "h-9 w-full rounded-md border border-input px-2.5 py-1 text-base shadow-xs md:text-sm",
  "transition-[color,box-shadow] outline-none",
  // Pinned in every state a control can reach.
  "bg-background hover:bg-background aria-expanded:bg-background data-popup-open:bg-background",
  // Dark needs saying explicitly: Input/Textarea/SelectTrigger/Button-outline
  // each carry their own `dark:bg-input/30`, and twMerge keeps it (different
  // modifier). `.dark\:bg-input\/30:is(.dark *)` then outranks a bare
  // `bg-background` on specificity — which would put every control back on grey
  // under a `bg-background` chip: the exact artifact this file prevents.
  "dark:bg-background dark:hover:bg-background",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
  "disabled:pointer-events-none disabled:opacity-50",
].join(" ");

/**
 * The focus-ring every interactive element in the editor wears. Extracted to a
 * constant after a ring-width rename required a manual multi-file sweep.
 */
export const FOCUS_RING_CLASS =
  "focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * Destructive icon buttons (delete a row, delete a link). Paired with
 * `variant="ghost" size="icon-sm"` — a filled `destructive` button repeated
 * down a list shouts; the intent only needs to show on hover.
 */
export const DESTRUCTIVE_ICON_CLASS =
  "shrink-0 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive";
