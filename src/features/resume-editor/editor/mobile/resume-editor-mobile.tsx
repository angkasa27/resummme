"use client";

import React, { useMemo, useState } from "react";

import { ResumeEditorMobileContent } from "@/features/resume-editor/editor/mobile/mobile-content";
import type { EditorControlProps } from "@/features/resume-editor/controls/control-props";
import { useResumeEditorController } from "@/features/resume-editor/state/use-resume-editor-controller";
import { ExtractCvDialog } from "@/features/resume-editor/controls/extract-cv-dialog";
import { PdfImportProgress } from "@/features/resume-editor/controls/pdf-import-progress";
import { useEditorHeader } from "@/features/resume-editor/chrome/use-editor-header";
import { normalizePdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import {
  needsSectionReveal,
  type EditorPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import { useIsMobile } from "@/hooks/use-mobile";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { toast } from "sonner";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import type { DraftStorage } from "@/features/resume-editor/domain/draft/draft-storage";

type ResumeEditorMobileProps = {
  initialDraft?: ResumeDraft;
  /** Persistence module ("batteries"). Defaults to local storage. */
  storage?: DraftStorage;
};

export function ResumeEditorMobile({
  initialDraft,
  storage,
}: ResumeEditorMobileProps) {
  const isMobile = useIsMobile();
  const [isExtractCvOpen, setIsExtractCvOpen] = useState(false);
  const {
    jsonFileInputRef,
    draft,
    activeSection,
    isExportingPdf,
    isImportingPdf,
    openJsonImportPicker,
    handleJsonImport,
    submitPdfFile,
    handleExport,
    handlePrint,
    requestSectionChange,
    reorderSection,
    setSectionVisibility,
    autoSortSection,
    savePdfPresentation,
    saveProfile,
    saveSection,
    undo,
    redo,
    canUndo,
    canRedo,
    saveStatus,
  } = useResumeEditorController({ initialDraft, storage });

  useEditorHeader({
    saveStatus,
    canUndo,
    canRedo,
    onUndo: undo,
    onRedo: redo,
    onExportPdf: handlePrint,
    isExportingPdf,
  });

  useKeyboardShortcuts({
    "mod+z": undo,
    "mod+shift+z": redo,
    "mod+s": {
      handler: () => toast.success("Auto-saved"),
      ignoreInputFocus: true,
    },
  });

  const presentation = useMemo(
    () => normalizePdfPresentation(draft.pdfPresentation),
    [draft.pdfPresentation],
  );

  // Opening a section from Insights: ensure it's visible, then make it active
  // so the mobile content opens its form.
  function openSection(panel: EditorPanelKey) {
    if (needsSectionReveal(draft.sections, panel)) {
      setSectionVisibility(panel, true);
    }
    requestSectionChange(panel);
  }

  const sectionProps = {
    draft,
    activeSection,
    onSelectSection: requestSectionChange,
    onSaveProfile: saveProfile,
    onSaveSection: saveSection,
    onReorderSection: reorderSection,
    onSetSectionVisibility: setSectionVisibility,
    onAutoSortSection: autoSortSection,
  };

  const controlPanelProps: EditorControlProps = {
    presentation,
    draft,
    onPresentationChange: savePdfPresentation,
    onImportJson: openJsonImportPicker,
    onExtractCv: () => setIsExtractCvOpen(true),
    onExportJson: handleExport,
    onExportPdf: handlePrint,
    onOpenSection: openSection,
    isExportingPdf,
    isImportingPdf,
  };

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ "--header-height": "3rem" } as React.CSSProperties}
    >
      <input
        ref={jsonFileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleJsonImport}
      />

      {/* AI PDF import — same highlighted flow as canvas. */}
      <ExtractCvDialog
        open={isExtractCvOpen}
        onOpenChange={setIsExtractCvOpen}
        onSubmit={(file) => {
          void submitPdfFile(file);
        }}
        isMobile={isMobile}
      />
      <PdfImportProgress open={isImportingPdf} />

      <div className="min-h-0 flex-1">
        <ResumeEditorMobileContent
          sectionProps={sectionProps}
          controlPanelProps={controlPanelProps}
          draft={draft}
          presentation={presentation}
        />
      </div>
    </div>
  );
}
