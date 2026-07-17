"use client";

import type { EditorControlProps } from "@/features/resume-editor/controls/control-props";
import { DesignPanel } from "@/features/resume-editor/controls/design-panel";
import { InsightsTab } from "@/features/resume-editor/controls/insights/insights-tab";
import type { RailKey } from "@/features/resume-editor/editor/desktop/editor-rail";
import { SectionEditPanel } from "@/features/resume-editor/editor/sections/section-edit-panel";
import { SectionFormHeader } from "@/features/resume-editor/editor/sections/section-form-header";
import type {
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
  onOpenSection,
  onBack,
}: EditorSidebarProps) {
  return (
    <aside className="flex w-80 shrink-0 flex-col overflow-hidden border-r bg-background print:hidden">
      {rail === "edit" ? (
        <>
          {/* Contextual header — only inside a section form. */}
          {openSection ? (
            <SectionFormHeader sectionKey={openSection} onBack={onBack} />
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
              onBack={onBack}
              onOpen={onOpenSection}
              controls={controls}
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
    </aside>
  );
}
