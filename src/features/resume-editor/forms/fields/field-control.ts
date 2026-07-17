/**
 * The single box every form control in an item form wears.
 *
 * Exists because the floating label punches a `bg-background` chip out of the
 * control's top border: the moment a control drifts to any other background —
 * `hover:bg-muted`, `aria-expanded:bg-muted`, `bg-transparent` — the chip reads
 * as a white pill stuck on a grey box. So the background is pinned across every
 * state, and hover feedback is carried by the border/ring instead, exactly like
 * `Input` (which has no hover background at all).
 */
export const FIELD_CONTROL_CLASS = [
  "h-9 w-full rounded-md border border-input px-2.5 py-1 text-base shadow-xs md:text-sm",
  "transition-[color,box-shadow] outline-none",
  // Pinned in every state a control can reach.
  "bg-background hover:bg-background aria-expanded:bg-background data-popup-open:bg-background",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
  "disabled:pointer-events-none disabled:opacity-50",
].join(" ");
