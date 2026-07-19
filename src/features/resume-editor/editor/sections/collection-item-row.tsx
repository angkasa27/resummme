"use client";

import { ChevronRightIcon } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

import { Collapse } from "@/features/resume-editor/editor/shared/collapse";
import { EditorRow } from "@/features/resume-editor/editor/sections/editor-row";
import { RowDragHandle } from "@/features/resume-editor/editor/sections/row-drag-handle";
import { RowDeleteButton } from "@/features/resume-editor/editor/sections/row-delete-button";
import { useSortableRow } from "@/features/resume-editor/editor/sections/use-sortable-row";
import { cn } from "@/lib/utils";

type CollectionItemRowProps = {
  /** The item's own stable id — also the dnd-kit sortable id. */
  itemId: string;
  summary: string;
  itemTitle: string;
  open: boolean;
  onToggle: () => void;
  onRequestDelete: () => void;
  /** The last remaining item can't be removed. */
  deleteDisabled: boolean;
  children: ReactNode;
};

/**
 * One item inside a collection section: a row identical to a section row when
 * collapsed, expanding to reveal its fields.
 *
 * The border only appears while open — collapsed, this is pixel-identical to a
 * section row (that's the point); open, the border marks where a long form ends.
 */
export function CollectionItemRow({
  itemId,
  summary,
  itemTitle,
  open,
  onToggle,
  onRequestDelete,
  deleteDisabled,
  children,
}: CollectionItemRowProps) {
  const { setNodeRef, isDragging, dragAttributes, listeners, motionProps } =
    useSortableRow(itemId);

  return (
    <motion.div
      ref={setNodeRef}
      data-testid="collection-item-card"
      data-open={open || undefined}
      {...motionProps}
      // No border here: the row now carries its own, and an expanded card
      // continues it down the body — a wrapper border would double the line.
      className={cn(
        "overflow-hidden rounded-md",
        isDragging && "relative z-50",
      )}
    >
      <EditorRow
        handle={
          <RowDragHandle label={summary} {...dragAttributes} {...listeners} />
        }
        indicator={
          <ChevronRightIcon
            className={cn(
              "transition-transform duration-200 size-4 shrink-0 text-muted-foreground/60",
              open && "rotate-90",
            )}
          />
        }
        title={summary}
        active={open}
        onActivate={onToggle}
        menu={
          <RowDeleteButton
            label={itemTitle.toLowerCase()}
            onDelete={onRequestDelete}
            disabled={deleteDisabled}
          />
        }
        className={open ? "rounded-b-none border-b-0" : undefined}
      />
      <Collapse open={open}>
        {/* bg-background, not muted: the floating field labels punch a chip out
            of the control's border, and that chip has to match this surface.
            The side/bottom borders continue the row's own box. */}
        <div className="@container/fields rounded-b-md border border-t bg-background p-4">
          {children}
        </div>
      </Collapse>
    </motion.div>
  );
}
