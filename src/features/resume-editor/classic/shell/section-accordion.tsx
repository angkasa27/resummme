"use client";

import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Collapse } from "@/features/resume-editor/shared/collapse";
import { SectionBody } from "@/features/resume-editor/classic/sections/section-body";
import { AddSectionMenu } from "@/features/resume-editor/shared/add-section-menu";
import { SectionRow } from "@/features/resume-editor/shared/section-row";
import {
  SortableSectionRow,
  useSectionReorder,
} from "@/features/resume-editor/shared/sortable-section-row";
import {
  partitionCollectionKeys,
  sectionLabels,
  type ResumeSectionPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type {
  ResumeEditorPanelKey,
  ResumeSectionKey,
} from "@/features/resume-editor/state/resume-editor-store";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type SectionAccordionProps = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  onSelectSection: (sectionKey: ResumeEditorPanelKey) => void;
  onSaveProfile: (profile: ResumeDraft["profile"]) => void;
  onSaveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K],
  ) => void;
  onReorderSection: (
    sectionKey: ResumeSectionPanelKey,
    anchorKey: ResumeSectionPanelKey,
  ) => void;
  onSetSectionVisibility: (
    sectionKey: ResumeSectionPanelKey,
    visible: boolean,
  ) => void;
  idPrefix?: string;
};

/**
 * The classic editor's left panel: a single-open accordion that mirrors the
 * right control panel's shape (pinned block → Separator → scrollable list →
 * bottom action). Profile + Summary are pinned; collection sections are
 * drag-sortable below the divider; hidden sections are added from the
 * "Add section" menu. Each collection row shows a muted item count; section
 * removal lives inside the expanded body. Clicking the open section collapses
 * it for a compact list.
 */
export function SectionAccordion({
  draft,
  activeSection,
  onSelectSection,
  onSaveProfile,
  onSaveSection,
  onReorderSection,
  onSetSectionVisibility,
  idPrefix = "desktop",
}: SectionAccordionProps) {
  const { sensors, onDragEnd } = useSectionReorder(onReorderSection);

  // Track whether the active section is collapsed. When `activeSection` changes
  // (a different row, or an Insights "fix"), re-expand — done during render via
  // the documented "adjust state on prop change" pattern (no effect).
  const [collapsed, setCollapsed] = useState(false);
  const [prevActive, setPrevActive] = useState(activeSection);
  if (activeSection !== prevActive) {
    setPrevActive(activeSection);
    setCollapsed(false);
  }
  const expandedKey: ResumeEditorPanelKey | null = collapsed
    ? null
    : activeSection;

  function handleRowClick(key: ResumeEditorPanelKey) {
    if (key === activeSection) {
      setCollapsed((current) => !current);
    } else {
      onSelectSection(key);
    }
  }

  const { sortableKeys, hiddenKeys } = partitionCollectionKeys(draft.sections);

  function renderBody(
    sectionKey: ResumeEditorPanelKey,
    onRemoveSection?: () => void,
  ) {
    return (
      <div className="mt-1 mb-1.5 rounded-lg border bg-card p-3 @container/form">
        <SectionBody
          draft={draft}
          activeSection={sectionKey}
          onSaveProfile={onSaveProfile}
          onSaveSection={onSaveSection}
          onRemoveSection={onRemoveSection}
          idPrefix={idPrefix}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Pinned — not reorderable, not removable */}
      <div className="flex flex-col gap-0.5 px-2 pt-3">
        <div>
          <SectionRow
            sectionKey="profile"
            label="Profile"
            active={expandedKey === "profile"}
            onClick={() => handleRowClick("profile")}
            trailing={<DisclosureChevron open={expandedKey === "profile"} />}
          />
          <Collapse open={expandedKey === "profile"}>
            {renderBody("profile")}
          </Collapse>
        </div>
        <div>
          <SectionRow
            sectionKey="summary"
            label={sectionLabels.summary}
            active={expandedKey === "summary"}
            onClick={() => handleRowClick("summary")}
            trailing={<DisclosureChevron open={expandedKey === "summary"} />}
          />
          <Collapse open={expandedKey === "summary"}>
            {renderBody("summary")}
          </Collapse>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Collection sections — drag-sortable */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
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
              {sortableKeys.map((key) => (
                <SortableSectionRow
                  key={key}
                  sectionKey={key}
                  label={sectionLabels[key]}
                  count={draft.sections[key].items.length}
                  active={expandedKey === key}
                  onClick={() => handleRowClick(key)}
                  trailing={<DisclosureChevron open={expandedKey === key} />}
                >
                  <Collapse open={expandedKey === key}>
                    {renderBody(key, () => onSetSectionVisibility(key, false))}
                  </Collapse>
                </SortableSectionRow>
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* Add section — at the bottom */}
        <AddSectionMenu
          hiddenKeys={hiddenKeys}
          onAdd={(key) => onSetSectionVisibility(key, true)}
          triggerVariant="outline"
        />
      </div>
    </div>
  );
}

function DisclosureChevron({ open }: { open: boolean }) {
  return (
    <ChevronRightIcon
      className={cn(
        "size-4 transition-transform duration-200",
        open ? "rotate-90 text-muted-foreground" : "text-muted-foreground/60",
      )}
    />
  );
}
