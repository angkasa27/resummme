"use client";

import type { KeyboardEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { FOCUS_RING_CLASS } from "@/features/resume-editor/forms/fields/field-control";

type EditorRowProps = {
  /** Drag grip. A fixed-width spacer takes its place when absent so every row
   * in a list keeps the same left edge, grip or not. */
  handle?: ReactNode;
  /** Section icon (section rows) or disclosure chevron (item rows). */
  leading?: ReactNode;
  title: string;
  /** Muted meta after the title — the item count on section rows. */
  badge?: ReactNode;
  /** Affordance before the menu — the nav chevron on section rows. */
  indicator?: ReactNode;
  /** The overflow menu. Same slot and geometry on every row kind, so delete
   * always sits in one place. */
  menu?: ReactNode;
  active?: boolean;
  /** Section rows open the form; item rows toggle their accordion. */
  onActivate: () => void;
  className?: string;
};

/**
 * One row, both levels of the editor: sections in the list and items inside a
 * section. Navigate-vs-expand is entirely a matter of what the caller passes to
 * `onActivate` / `leading` / `indicator` — padding, radius, hover, active state,
 * focus ring and grip geometry are shared by construction, so the two levels
 * cannot drift apart visually.
 *
 * A `div role="button"` rather than a `<button>` because rows nest interactive
 * controls (grip, menu); those stop propagation.
 */
export function EditorRow({
  handle,
  leading,
  title,
  badge,
  indicator,
  menu,
  active = false,
  onActivate,
  className,
}: EditorRowProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // Only keys aimed at the row itself. The nested grip and "⋯" trigger have
    // their own Space/Enter meaning — dnd-kit lifts and drops on Space — and
    // those events bubble through here on their way to dnd-kit's document
    // listeners. Blocking them at the grip would break the drop; ignoring them
    // here is what keeps a lift from also toggling the row.
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onActivate();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={active}
      onClick={onActivate}
      onKeyDown={handleKeyDown}
      className={cn(
        "group/row flex cursor-pointer select-none items-center gap-2 rounded-md border border-border bg-background p-2 outline-none transition-colors",
        FOCUS_RING_CLASS,
        "aria-pressed:bg-muted aria-[pressed=false]:hover:bg-muted/60",
        className,
      )}
    >
      {handle ? (
        <span className="flex w-4 shrink-0 items-center justify-center">
          {handle}
        </span>
      ) : null}
      {leading ? (
        <span
          className={cn(
            "flex shrink-0 text-muted-foreground group-aria-pressed/row:text-foreground [&_svg]:size-4",
          )}
        >
          {leading}
        </span>
      ) : null}
      <span className={cn("min-w-0 truncate text-sm font-medium")}>
        {title}
      </span>
      {badge}
      <span className="flex-1" />
      {menu}
      {indicator}
    </div>
  );
}
