import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { HTMLMotionProps } from "motion/react";

import { motionTokens } from "@/lib/motion-tokens";

/**
 * Wires a row into dnd-kit's sortable context and returns the drag-handle
 * attributes and motion props both section rows and collection item rows
 * need. Shared so the drag/motion wiring can't drift between the two levels.
 *
 * Motion is opacity-only: dnd-kit owns `transform` for the reorder, so
 * animating `y` would clobber the drag's positioning and stop the keyboard
 * sensor from resolving a drop target.
 */
export function useSortableRow(id: string) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  // The row itself carries the drag role via RowDragHandle; a duplicate
  // role/tabIndex on the wrapping element would confuse assistive tech.
  const { role: _role, tabIndex: _tabIndex, ...dragAttributes } = attributes;
  void _role;
  void _tabIndex;

  const motionProps: HTMLMotionProps<"div"> = {
    style: { transform: CSS.Transform.toString(transform), transition },
    initial: { opacity: 0 },
    animate: { opacity: isDragging ? 0.8 : 1 },
    exit: { opacity: 0 },
    transition: { duration: motionTokens.duration.fast },
  };

  return { setNodeRef, isDragging, dragAttributes, listeners, motionProps };
}
