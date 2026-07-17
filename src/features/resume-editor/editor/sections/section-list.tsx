"use client";

import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "motion/react";
import { ChevronRightIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import type { EditorControlProps } from "@/features/resume-editor/controls/control-props";
import { EditorDocumentActions } from "@/features/resume-editor/controls/editor-document-actions";
import { AddSectionMenu } from "@/features/resume-editor/editor/sections/add-section-menu";
import { SectionRow } from "@/features/resume-editor/editor/sections/section-row";
import {
  SortableSectionRow,
  useSectionReorder,
} from "@/features/resume-editor/editor/sections/sortable-section-row";
import {
  partitionCollectionKeys,
  sectionLabels,
  type ResumeSectionPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type {
  ResumeEditorPanelKey,
} from "@/features/resume-editor/state/resume-editor-store";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { cn } from "@/lib/utils";

type SectionListProps = {
  draft: ResumeDraft;
  /** The highlighted row, or `null` when nothing is open. */
  activeSection: ResumeEditorPanelKey | null;
  onReorderSection: (
    sectionKey: ResumeSectionPanelKey,
    anchorKey: ResumeSectionPanelKey,
  ) => void;
  onSetSectionVisibility: (
    sectionKey: ResumeSectionPanelKey,
    visible: boolean,
  ) => void;
  controls: EditorControlProps;
  onOpen: (key: ResumeEditorPanelKey) => void;
  /** Scroll padding. Mobile clears its floating bottom nav; desktop doesn't. */
  className?: string;
};

/**
 * The editor's section index: document actions, the pinned Profile/Summary
 * rows, and the drag-sortable collection rows. Shared by the desktop sidebar
 * and the mobile Edit tab.
 */
export function SectionList({
  draft,
  activeSection,
  onReorderSection,
  onSetSectionVisibility,
  controls,
  onOpen,
  className,
}: SectionListProps) {
  const { sensors, onDragEnd } = useSectionReorder(onReorderSection);
  const { sortableKeys, hiddenKeys } = partitionCollectionKeys(draft.sections);

  const navChevron = (
    <ChevronRightIcon className="size-4 text-muted-foreground/60" />
  );

  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      <div className="px-4 pt-4">
        <EditorDocumentActions
          onExtractCv={controls.onExtractCv}
          onImportJson={controls.onImportJson}
          onExport={controls.onExport}
          onExportPdf={controls.onExportPdf}
          isExportingPdf={controls.isExportingPdf}
          isImportingPdf={controls.isImportingPdf}
        />
      </div>

      <Separator className="my-3" />

      <div className="px-2 pb-3">
        {/* Pinned — not reorderable, not removable */}
        <div className="flex flex-col gap-0.5">
          <SectionRow
            sectionKey="profile"
            label="Profile"
            active={activeSection === "profile"}
            onClick={() => onOpen("profile")}
            trailing={navChevron}
          />
          <SectionRow
            sectionKey="summary"
            label={sectionLabels.summary}
            active={activeSection === "summary"}
            onClick={() => onOpen("summary")}
            trailing={navChevron}
          />
        </div>

        <Separator className="my-2" />

        {/* Collection sections — drag-sortable */}
        <div className="flex flex-col gap-0.5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={sortableKeys}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence initial={false}>
                {sortableKeys.map((key) => (
                  <SortableSectionRow
                    key={key}
                    sectionKey={key}
                    label={sectionLabels[key]}
                    count={draft.sections[key].items.length}
                    active={activeSection === key}
                    onClick={() => onOpen(key)}
                    trailing={navChevron}
                  />
                ))}
              </AnimatePresence>
            </SortableContext>
          </DndContext>

          <AddSectionMenu
            hiddenKeys={hiddenKeys}
            onAdd={(key) => onSetSectionVisibility(key, true)}
            triggerVariant="ghost"
          />
        </div>
      </div>
    </div>
  );
}
