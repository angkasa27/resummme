"use client";

import { ActiveSectionEditor } from "@/features/resume-editor/active-section-editor";
import { SectionNavigator } from "@/features/resume-editor/section-navigator";
import type { ResumeDraft } from "@/lib/resume/schema";
import type {
  ResumeEditorPanelKey,
  ResumeEditorViewMode,
  ResumeSectionKey,
} from "@/features/resume-editor/store/editor-store";

type EditorPaneProps = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  editorViewMode: ResumeEditorViewMode;
  onRequestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  onReturnToSectionList: () => void;
  onMoveSection: (sectionKey: ResumeSectionKey, direction: -1 | 1) => void;
  onReorderSection: (sectionKey: ResumeSectionKey, targetIndex: number) => void;
  onSetSectionVisibility: (
    sectionKey: ResumeSectionKey,
    visible: boolean,
  ) => void;
  onSaveProfile: (profile: ResumeDraft["profile"]) => void;
  onSaveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K],
  ) => void;
};

export function EditorPane({
  draft,
  activeSection,
  editorViewMode,
  onRequestSectionChange,
  onReturnToSectionList,
  onMoveSection,
  onReorderSection,
  onSetSectionVisibility,
  onSaveProfile,
  onSaveSection,
}: EditorPaneProps) {
  return (
    <>
      <div className="h-full min-h-0">
        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-card">
          <div className="min-h-0 flex-1">
            {editorViewMode === "list" ? (
              <SectionNavigator
                draft={draft}
                activeSection={activeSection}
                onRequestSectionChange={onRequestSectionChange}
                onMoveSection={onMoveSection}
                onReorderSection={onReorderSection}
                onSetSectionVisibility={onSetSectionVisibility}
              />
            ) : (
              <ActiveSectionEditor
                draft={draft}
                activeSection={activeSection}
                onBack={onReturnToSectionList}
                onSaveProfile={onSaveProfile}
                onSaveSection={onSaveSection}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
