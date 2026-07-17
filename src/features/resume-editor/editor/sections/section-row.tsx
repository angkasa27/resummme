"use client";

import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { EditorRow } from "@/features/resume-editor/editor/sections/editor-row";
import { SectionIcon } from "@/features/resume-editor/ui/section-icons";
import type {
  CollectionSectionKey,
  EditorPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";

type SectionRowProps = {
  sectionKey: EditorPanelKey | CollectionSectionKey;
  label: string;
  active?: boolean;
  onClick: () => void;
  /** Drag-handle slot (collection rows only). */
  leading?: ReactNode;
  /** Glanceable item count (collection rows only). */
  count?: number;
  /** Nav chevron. */
  trailing?: ReactNode;
  /** The row's "⋯" menu. */
  menu?: ReactNode;
  className?: string;
};

/**
 * A section row in the editor's section list. Same `EditorRow` the collection
 * item rows use — only the slots differ.
 */
export function SectionRow({
  sectionKey,
  label,
  active = false,
  onClick,
  leading,
  count,
  trailing,
  menu,
  className,
}: SectionRowProps) {
  return (
    <EditorRow
      handle={leading}
      leading={<SectionIcon sectionKey={sectionKey} />}
      title={label}
      badge={
        count !== undefined ? (
          <Badge variant="outline" className="shrink-0 bg-background text-xs!">
            {count} item{count === 1 ? "" : "s"}
          </Badge>
        ) : undefined
      }
      indicator={trailing}
      menu={menu}
      active={active}
      onActivate={onClick}
      className={className}
    />
  );
}
