"use client";

import { ActiveSectionEditor } from "@/features/resume-editor/active-section-editor";
import { EditorWarning } from "@/features/resume-editor/editor-warning";
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
  dirtySections: ResumeEditorPanelKey[];
  pendingSection: ResumeEditorPanelKey | null;
  pendingViewMode: ResumeEditorViewMode | null;
  warningOpen: boolean;
  onRequestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  onReturnToSectionList: () => void;
  onMoveSection: (sectionKey: ResumeSectionKey, direction: -1 | 1) => void;
  onSetSectionVisibility: (sectionKey: ResumeSectionKey, visible: boolean) => void;
  onSetSectionDirty: (sectionKey: ResumeEditorPanelKey, isDirty: boolean) => void;
  onDiscardPendingSectionChanges: () => void;
  onCancelPendingSectionChange: () => void;
  onSaveProfile: (profile: ResumeDraft["profile"]) => void;
  onSaveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K]
  ) => void;
};

export function EditorPane({
  draft,
  activeSection,
  editorViewMode,
  dirtySections,
  pendingSection,
  pendingViewMode,
  warningOpen,
  onRequestSectionChange,
  onReturnToSectionList,
  onMoveSection,
  onSetSectionVisibility,
  onSetSectionDirty,
  onDiscardPendingSectionChanges,
  onCancelPendingSectionChange,
  onSaveProfile,
  onSaveSection,
}: EditorPaneProps) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-[28px] border bg-background shadow-sm">
      {warningOpen ? (
        <div className="border-b px-4 py-3">
          <EditorWarning
            pendingSection={pendingSection}
            pendingViewMode={pendingViewMode}
            onDiscardPendingSectionChanges={onDiscardPendingSectionChanges}
            onCancelPendingSectionChange={onCancelPendingSectionChange}
          />
        </div>
      ) : null}

      <div className="min-h-0 flex-1">
        {editorViewMode === "list" ? (
          <SectionNavigator
            draft={draft}
            activeSection={activeSection}
            dirtySections={dirtySections}
            onRequestSectionChange={onRequestSectionChange}
            onMoveSection={onMoveSection}
            onSetSectionVisibility={onSetSectionVisibility}
          />
        ) : (
          <ActiveSectionEditor
            draft={draft}
            activeSection={activeSection}
            dirtySections={dirtySections}
            onBack={onReturnToSectionList}
            onSetSectionDirty={onSetSectionDirty}
            onSaveProfile={onSaveProfile}
            onSaveSection={onSaveSection}
          />
        )}
      </div>
    </div>
  );
}
