"use client";

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

/**
 * Shared dnd-kit wiring for a sortable list: pointer + keyboard sensors and a
 * drag-end handler that maps the dragged id onto the id it was dropped over.
 *
 * Used by both the section list (ids = section keys) and the item list inside a
 * section (ids = react-hook-form field keys), so the two levels of the editor
 * reorder with identical feel and identical keyboard support.
 */
export function useDndReorder<TId extends string>(
  onReorder: (activeId: TId, overId: TId) => void,
) {
  const sensors = useSensors(
    // Distance constraint so a drag never swallows the row's click.
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function onDragEnd(event: DragEndEvent) {
    const activeId = event.active.id as TId;
    const overId = event.over?.id as TId | undefined;
    if (!overId || activeId === overId) return;
    onReorder(activeId, overId);
  }

  return { sensors, onDragEnd };
}
