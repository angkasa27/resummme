"use client";

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon } from "lucide-react";
import type { ReactNode } from "react";

import { SectionRow } from "@/features/resume-editor/shared/section-row";
import type { ResumeSectionPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";

/**
 * Shared dnd-kit wiring for a section list: pointer + keyboard sensors and a
 * drag-end handler that maps the dragged key onto the key it was dropped over.
 */
export function useSectionReorder(
  onReorder: (
    sectionKey: ResumeSectionPanelKey,
    anchorKey: ResumeSectionPanelKey,
  ) => void,
) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function onDragEnd(event: DragEndEvent) {
    const activeKey = event.active.id as ResumeSectionPanelKey;
    const overKey = event.over?.id as ResumeSectionPanelKey | undefined;
    if (!overKey || activeKey === overKey) return;
    onReorder(activeKey, overKey);
  }

  return { sensors, onDragEnd };
}

type SortableSectionRowProps = {
  sectionKey: ResumeSectionPanelKey;
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  /** Trailing slot — the disclosure chevron (desktop) or nav chevron (mobile). */
  trailing?: ReactNode;
  /** Expanded body rendered below the row (desktop accordion only). */
  children?: ReactNode;
};

/**
 * A drag-sortable section row: the grip handle + `SectionRow`, plus an optional
 * expanded body. Shared by the desktop accordion and the mobile section list —
 * each supplies its own `trailing` and (for desktop) `children`.
 */
export function SortableSectionRow({
  sectionKey,
  label,
  count,
  active,
  onClick,
  trailing,
  children,
}: SortableSectionRowProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: sectionKey });
  const { role: _role, tabIndex: _tabIndex, ...dragAttributes } = attributes;
  void _role;
  void _tabIndex;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "relative z-50 opacity-80" : undefined}
    >
      <SectionRow
        sectionKey={sectionKey}
        label={label}
        active={active}
        onClick={onClick}
        count={count}
        leading={
          <button
            type="button"
            aria-label={`Drag ${label}`}
            className="flex cursor-grab touch-none items-center text-muted-foreground/40 transition-colors group-hover/row:text-muted-foreground/70 hover:text-foreground! active:cursor-grabbing"
            onClick={(event) => event.stopPropagation()}
            {...dragAttributes}
            {...listeners}
          >
            <GripVerticalIcon className="size-4" />
          </button>
        }
        trailing={trailing}
      />
      {children}
    </div>
  );
}
