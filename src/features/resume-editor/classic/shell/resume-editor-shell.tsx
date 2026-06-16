"use client";

import React, { useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Loader } from "lucide-react";

import { SectionAccordion } from "@/features/resume-editor/classic/shell/section-accordion";
import { ResumeEditorMobileContent } from "@/features/resume-editor/classic/shell/resume-editor-mobile-content";
import { EditorControlPanel } from "@/features/resume-editor/shared/editor-control-panel";
import { PreviewSheet } from "@/features/resume-editor/preview/components/preview-sheet";
import { useResumeEditorController } from "@/features/resume-editor/state/use-resume-editor-controller";
import { ExtractCvDialog } from "@/features/resume-editor/canvas/controls/extract-cv-dialog";
import { PdfImportProgress } from "@/features/resume-editor/canvas/controls/pdf-import-progress";
import { useEditorHeader } from "@/features/resume-editor/shared/use-editor-header";
import { normalizePdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import {
  isCollectionSectionKey,
  type EditorPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import { useClientReady } from "@/hooks/use-client-ready";
import { useIsMobile } from "@/hooks/use-mobile";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { toast } from "sonner";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import type { DraftStorage } from "@/features/resume-editor/domain/draft/draft-storage";

type ResumeEditorShellProps = {
  initialDraft?: ResumeDraft;
  /** Persistence module ("batteries"). Defaults to local storage. */
  storage?: DraftStorage;
  /** Right-aligned header slot, identical to canvas. Defaults to the GitHub link. */
  headerActions?: ReactNode;
  /** Tab link targets, forwarded to EditorTopBar (default to the bare routes). */
  canvasHref?: string;
  classicHref?: string;
};

export function ResumeEditorShell({
  initialDraft,
  storage,
  headerActions,
  canvasHref,
  classicHref,
}: ResumeEditorShellProps) {
  const isClientReady = useClientReady();
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
    actions: headerActions,
    canvasHref,
    classicHref,
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

  if (!isClientReady) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader className="size-8 animate-spin" />
          <div className="space-y-1">
            <p className="text-sm font-semibold tracking-tight">
              Loading editor
            </p>
            <p className="text-sm text-muted-foreground">
              Preparing your resume draft...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Opening a section from Insights: ensure it's visible, then make it active
  // (the accordion expands it; the mobile content opens its form).
  function openSection(panel: EditorPanelKey) {
    if (
      panel !== "profile" &&
      isCollectionSectionKey(panel) &&
      !draft.sections[panel].visible
    ) {
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
  };

  const controlPanelProps = {
    presentation,
    draft,
    onPresentationChange: savePdfPresentation,
    onImportJson: openJsonImportPicker,
    onExtractCv: () => setIsExtractCvOpen(true),
    onExport: handleExport,
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
        {/* Desktop: Editor · Preview · Controls — resizable rails that default to
            the canvas width (320px) but can be dragged wider/narrower. */}
        <div className="hidden h-full lg:block">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize="320px" minSize="240px" maxSize="460px">
              <div className="h-full overflow-hidden">
                <SectionAccordion {...sectionProps} />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize="22rem">
              <div className="h-full overflow-hidden bg-muted">
                <PreviewSheet draft={draft} presentation={presentation} />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="320px" minSize="240px" maxSize="460px">
              <div className="h-full overflow-hidden border-l">
                <EditorControlPanel {...controlPanelProps} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile/Tablet: full-screen tabbed app */}
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
