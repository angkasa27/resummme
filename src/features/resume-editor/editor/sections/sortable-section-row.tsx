"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

import { SectionRow } from "@/features/resume-editor/editor/sections/section-row";
import { RowDragHandle } from "@/features/resume-editor/editor/sections/row-drag-handle";
import { useDndReorder } from "@/features/resume-editor/editor/sections/use-dnd-reorder";
import { useSortableRow } from "@/features/resume-editor/editor/sections/use-sortable-row";
import type { ResumeSectionPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";

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
  const { setNodeRef, isDragging, dragAttributes, listeners, motionProps } =
    useSortableRow(sectionKey);

  return (
    // Wrapped by the list's `AnimatePresence initial={false}`, so existing
    // rows don't fade on load — only sections added/removed do.
    <motion.div
      ref={setNodeRef}
      className={isDragging ? "relative z-50" : undefined}
      {...motionProps}
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
