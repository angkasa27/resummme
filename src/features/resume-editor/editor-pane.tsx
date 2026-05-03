"use client";

import { ActiveSectionEditor } from "@/features/resume-editor/active-section-editor";
import { DirtyExitDialog } from "@/features/resume-editor/dirty-exit-dialog";
import { SectionNavigator } from "@/features/resume-editor/section-navigator";
import type { ResumeDraft } from "@/lib/resume/schema";
import type {
  ResumeEditorPanelKey,
  ResumeEditorPendingIntent,
  ResumeEditorViewMode,
  ResumeSectionKey,
} from "@/features/resume-editor/store/editor-store";

type EditorPaneProps = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  editorViewMode: ResumeEditorViewMode;
  pendingIntent: ResumeEditorPendingIntent | null;
  confirmExitOpen: boolean;
  onRequestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  onReturnToSectionList: () => void;
  onMoveSection: (sectionKey: ResumeSectionKey, direction: -1 | 1) => void;
  onReorderSection: (sectionKey: ResumeSectionKey, targetIndex: number) => void;
  onSetSectionVisibility: (
    sectionKey: ResumeSectionKey,
    visible: boolean,
  ) => void;
  onSetSectionDirty: (
    sectionKey: ResumeEditorPanelKey,
    isDirty: boolean,
  ) => void;
  onDiscardPendingChanges: () => void;
  onCancelPendingIntent: () => void;
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
  pendingIntent,
  confirmExitOpen,
  onRequestSectionChange,
  onReturnToSectionList,
  onMoveSection,
  onReorderSection,
  onSetSectionVisibility,
  onSetSectionDirty,
  onDiscardPendingChanges,
  onCancelPendingIntent,
  onSaveProfile,
  onSaveSection,
}: EditorPaneProps) {
  return (
    <>
      <DirtyExitDialog
        open={confirmExitOpen}
        pendingIntent={pendingIntent}
        onDiscardChanges={onDiscardPendingChanges}
        onStayEditing={onCancelPendingIntent}
      />
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
                onSetSectionDirty={onSetSectionDirty}
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
