"use client";

import { GripVerticalIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type RowDragHandleProps = ComponentProps<"button"> & {
  /** Announced as "Drag <label>". */
  label: string;
};

/**
 * The grip on a sortable row. Shared by section rows and collection item rows
 * so both levels drag with the same target and the same affordance.
 */
export function RowDragHandle({
  label,
  className,
  onKeyDown,
  ...props
}: RowDragHandleProps) {
  return (
    <button
      type="button"
      aria-label={`Drag ${label}`}
      // The row is the click target; the grip must not activate it.
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        // dnd-kit's KeyboardSensor lifts and drops on Space, from this element.
        onKeyDown?.(event);
        // Space on a focused <button> natively fires a click on keyup, which
        // lands mid-drag and cancels it. Suppress that default — but never
        // stopPropagation: dnd-kit tracks the arrows and the drop on document,
        // so a blocked event silently breaks the drop instead of the click.
        if (event.key === " ") event.preventDefault();
      }}
      className={cn(
        "flex cursor-grab touch-none items-center text-muted-foreground/40 transition-colors group-hover/row:text-muted-foreground/70 hover:text-foreground! active:cursor-grabbing",
        className,
      )}
      {...props}
    >
      <GripVerticalIcon className="size-4" />
    </button>
  );
}
