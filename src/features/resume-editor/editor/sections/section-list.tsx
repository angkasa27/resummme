"use client";

import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "motion/react";
import { ChevronRightIcon, PinIcon } from "lucide-react";
import { useState } from "react";

import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { Separator } from "@/components/ui/separator";
import { AddSectionMenu } from "@/features/resume-editor/editor/sections/add-section-menu";
import { DocumentActions } from "@/features/resume-editor/editor/sections/document-actions";
import { RowDeleteButton } from "@/features/resume-editor/editor/sections/row-delete-button";
import { SectionRow } from "@/features/resume-editor/editor/sections/section-row";
import {
  SortableSectionRow,
  useSectionReorder,
} from "@/features/resume-editor/editor/sections/sortable-section-row";
import {
  partitionCollectionKeys,
  sectionLabels,
  type CollectionSectionKey,
  type ResumeSectionPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeEditorPanelKey } from "@/features/resume-editor/state/resume-editor-store";
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
  onOpen: (key: ResumeEditorPanelKey) => void;
  /** Document-level actions shown above the list. */
  onExtractCv: () => void;
  onImportJson: () => void;
  onExportJson: () => void;
  isImportingPdf?: boolean;
  /** Scroll padding. Mobile clears its floating bottom nav; desktop doesn't. */
  className?: string;
};

/**
 * The editor's section index: the pinned Profile/Summary rows and the
 * drag-sortable collection rows. Shared by the desktop sidebar and the mobile
 * Edit tab.
 */
export function SectionList({
  draft,
  activeSection,
  onReorderSection,
  onSetSectionVisibility,
  onOpen,
  onExtractCv,
  onImportJson,
  onExportJson,
  isImportingPdf,
  className,
}: SectionListProps) {
  const { sensors, onDragEnd } = useSectionReorder(onReorderSection);
  const { sortableKeys, hiddenKeys } = partitionCollectionKeys(draft.sections);
  const [pendingRemoveKey, setPendingRemoveKey] =
    useState<CollectionSectionKey | null>(null);

  const navChevron = (
    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground/60" />
  );

  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      {/* p-2 (8px): a nav list stays a step tighter than a form (p-3). A 12px
          inset around rows that are themselves py-2 reads heavy. */}
      <div className="p-2">
        <DocumentActions
          onExtractCv={onExtractCv}
          onImportJson={onImportJson}
          onExportJson={onExportJson}
          isImportingPdf={isImportingPdf}
        />

        <Separator fullBleed />

        {/* Pinned — not reorderable, not removable */}
        <div className="flex flex-col gap-2">
          <SectionRow
            sectionKey="profile"
            label="Profile"
            active={activeSection === "profile"}
            onClick={() => onOpen("profile")}
            trailing={navChevron}
            className="h-12.5 pl-3"
          />
          <SectionRow
            sectionKey="summary"
            label={sectionLabels.summary}
            active={activeSection === "summary"}
            onClick={() => onOpen("summary")}
            trailing={navChevron}
            className="h-12.5 pl-3"
          />
        </div>

        <Separator fullBleed />

        {/* Collection sections — drag-sortable */}
        <div className="flex flex-col gap-2">
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
                    menu={
                      <RowDeleteButton
                        label={`${sectionLabels[key]} section`}
                        onDelete={() => setPendingRemoveKey(key)}
                      />
                    }
                  />
                ))}
              </AnimatePresence>
            </SortableContext>
          </DndContext>

          <AddSectionMenu
            hiddenKeys={hiddenKeys}
            onAdd={(key) => onSetSectionVisibility(key, true)}
          />
        </div>
      </div>

      <ConfirmDeleteDialog
        open={pendingRemoveKey !== null}
        onOpenChange={(open) => {
          if (!open) setPendingRemoveKey(null);
        }}
        onConfirm={() => {
          if (pendingRemoveKey) onSetSectionVisibility(pendingRemoveKey, false);
          setPendingRemoveKey(null);
        }}
        title={
          pendingRemoveKey
            ? `Remove ${sectionLabels[pendingRemoveKey]} section?`
            : "Remove section?"
        }
        description="Its content is kept — you can add the section back at any time."
      />
    </div>
  );
}
