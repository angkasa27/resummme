"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";
import { motion } from "motion/react";

import { SectionRow } from "@/features/resume-editor/editor/sections/section-row";
import { RowDragHandle } from "@/features/resume-editor/editor/sections/row-drag-handle";
import { useDndReorder } from "@/features/resume-editor/editor/sections/use-dnd-reorder";
import type { ResumeSectionPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { motionTokens } from "@/lib/motion-tokens";

/** Section-list flavour of {@link useDndReorder} — ids are section keys. */
export function useSectionReorder(
  onReorder: (
    sectionKey: ResumeSectionPanelKey,
    anchorKey: ResumeSectionPanelKey,
  ) => void,
) {
  return useDndReorder<ResumeSectionPanelKey>(onReorder);
}

type SortableSectionRowProps = {
  sectionKey: ResumeSectionPanelKey;
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  /** Nav chevron. */
  trailing?: ReactNode;
  /** The row's "⋯" menu. */
  menu?: ReactNode;
};

/**
 * A drag-sortable section row: grip + `SectionRow`.
 */
export function SortableSectionRow({
  sectionKey,
  label,
  count,
  active,
  onClick,
  trailing,
  menu,
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
    // Opacity-only enter/exit so a section added/removed from the list fades in
    // and out. Transform stays owned by dnd-kit (reorder), so motion only
    // touches opacity — no fight over `transform`. Wrapped by the list's
    // `AnimatePresence initial={false}`, so existing rows don't fade on load.
    <motion.div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "relative z-50" : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: isDragging ? 0.8 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: motionTokens.duration.fast }}
    >
      <SectionRow
        sectionKey={sectionKey}
        label={label}
        active={active}
        onClick={onClick}
        count={count}
        leading={
          <RowDragHandle label={label} {...dragAttributes} {...listeners} />
        }
        trailing={trailing}
        menu={menu}
      />
    </motion.div>
  );
}
