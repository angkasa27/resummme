"use client";

import { useRef } from "react";

import type { EditorControlProps } from "@/features/resume-editor/controls/control-props";
import { SidebarResizeHandle } from "@/features/resume-editor/editor/desktop/sidebar-resize-handle";
import { useSidebarWidth } from "@/features/resume-editor/editor/desktop/use-sidebar-width";
import { DesignPanel } from "@/features/resume-editor/controls/design-panel";
import { InsightsTab } from "@/features/resume-editor/controls/insights/insights-tab";
import type { RailKey } from "@/features/resume-editor/editor/desktop/editor-rail";
import { SectionEditPanel } from "@/features/resume-editor/editor/sections/section-edit-panel";
import { SectionFormHeader } from "@/features/resume-editor/editor/sections/section-form-header";
import type {
  CollectionSectionKey,
  EditorPanelKey,
  ResumeSectionPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type {
  ResumeEditorPanelKey,
  ResumeSectionKey,
} from "@/features/resume-editor/state/resume-editor-store";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type EditorSidebarProps = {
  rail: RailKey;
  draft: ResumeDraft;
  controls: EditorControlProps;
  openSection: ResumeEditorPanelKey | null;
  direction: number;
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
  onAutoSortSection: (sectionKey: CollectionSectionKey) => void;
  onOpenSection: (panel: EditorPanelKey) => void;
  onBack: () => void;
};

/**
 * The second sidebar: whichever panel the rail selects. Fixed width — the paper
 * keeps the rest.
 */
export function EditorSidebar({
  rail,
  draft,
  controls,
  openSection,
  direction,
  onSaveProfile,
  onSaveSection,
  onReorderSection,
  onSetSectionVisibility,
  onAutoSortSection,
  onOpenSection,
  onBack,
}: EditorSidebarProps) {
  const asideRef = useRef<HTMLElement | null>(null);
  const { width, commitWidth, resetWidth } = useSidebarWidth();

  return (
    <aside
      ref={asideRef}
      style={{ width }}
      className="relative flex shrink-0 flex-col overflow-hidden border-r bg-background print:hidden"
    >
      {rail === "edit" ? (
        <>
          {/* Contextual header — only inside a section form. */}
          {openSection ? (
            <SectionFormHeader
              sectionKey={openSection}
              onBack={onBack}
              onAutoSortSection={onAutoSortSection}
              onSetSectionVisibility={onSetSectionVisibility}
            />
          ) : null}
          <div className="min-h-0 flex-1">
            <SectionEditPanel
              draft={draft}
              openSection={openSection}
              activeSection={openSection}
              direction={direction}
              onSaveProfile={onSaveProfile}
              onSaveSection={onSaveSection}
              onReorderSection={onReorderSection}
              onSetSectionVisibility={onSetSectionVisibility}
              onOpen={onOpenSection}
              onExtractCv={controls.onExtractCv}
              onImportJson={controls.onImportJson}
              onExportJson={controls.onExport}
              isImportingPdf={controls.isImportingPdf}
              idPrefix="desktop"
            />
          </div>
        </>
      ) : null}

      {rail === "design" ? (
        <DesignPanel
          presentation={controls.presentation}
          draft={draft}
          onPresentationChange={controls.onPresentationChange}
        />
      ) : null}

      {rail === "insights" ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <InsightsTab draft={draft} onOpenSection={onOpenSection} />
        </div>
      ) : null}

      <SidebarResizeHandle
        targetRef={asideRef}
        width={width}
        onCommit={commitWidth}
        onReset={resetWidth}
      />
    </aside>
  );
}
