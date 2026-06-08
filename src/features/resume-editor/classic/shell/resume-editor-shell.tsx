"use client";

import React from "react";
import type { ReactNode } from "react";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Loader } from "lucide-react";

import { ActiveSectionEditor } from "@/features/resume-editor/classic/sections/active-section-editor";
import { useResumeEditorController } from "@/features/resume-editor/state/use-resume-editor-controller";
import { ResumeEditorSidebar } from "@/features/resume-editor/classic/resume-editor-sidebar";
import { ResumeEditorMobileContent } from "@/features/resume-editor/classic/shell/resume-editor-mobile-content";
import { ResumeEditorShellActions } from "@/features/resume-editor/classic/shell/resume-editor-shell-actions";
import { EditorTopBar } from "@/features/resume-editor/shared/editor-top-bar";
import { PreviewPane } from "@/features/resume-editor/preview/components/preview-pane";
import { useClientReady } from "@/hooks/use-client-ready";
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
};

export function ResumeEditorShell({
  initialDraft,
  storage,
  headerActions,
}: ResumeEditorShellProps) {
  const isClientReady = useClientReady();
  const {
    jsonFileInputRef,
    pdfFileInputRef,
    draft,
    activeSection,
    isExportingPdf,
    isImportingPdf,
    openJsonImportPicker,
    openPdfImportPicker,
    handleJsonImport,
    handlePdfImport,
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

  useKeyboardShortcuts({
    "mod+z": undo,
    "mod+shift+z": redo,
    "mod+s": {
      handler: () => toast.success("Auto-saved"),
      ignoreInputFocus: true,
    },
  });

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

  // Built once, threaded into both desktop panes and the mobile content so the
  // sidebar trigger and import/export controls live in Row 2 (per-pane headers).
  const sidebarTrigger = <SidebarTrigger className="-ml-1" />;
  const previewActions = (
    <ResumeEditorShellActions
      onImportJson={openJsonImportPicker}
      onImportPdf={openPdfImportPicker}
      onExport={handleExport}
      onExportPdf={handlePrint}
      isExportingPdf={isExportingPdf}
      isImportingPdf={isImportingPdf}
    />
  );

  function handleOpenPreviewSection(panel: Parameters<typeof requestSectionChange>[0]) {
    if (panel !== "profile" && panel !== "summary") {
      requestSectionChange(panel);
    }
  }

  return (
    <div
      className="flex h-dvh flex-col overflow-hidden"
      style={{ "--header-height": "3rem" } as React.CSSProperties}
    >
      <input
        ref={jsonFileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleJsonImport}
      />
      <input
        ref={pdfFileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handlePdfImport}
      />

      {/* Row 1 — identical to canvas, full width, fixed (no shift on mode switch). */}
      <EditorTopBar
        activeView="classic"
        saveStatus={saveStatus}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        actions={headerActions}
      />

      <div className="min-h-0 flex-1">
        <SidebarProvider
          defaultOpen={true}
          className="h-full min-h-0"
          style={
            { "--sidebar-width": "260px", minHeight: 0 } as React.CSSProperties
          }
        >
          <ResumeEditorSidebar
            draft={draft}
            activeSection={activeSection}
            onRequestSectionChange={requestSectionChange}
            onReorderSection={reorderSection}
            onSetSectionVisibility={setSectionVisibility}
          />

          <SidebarInset className="flex min-h-0 flex-col overflow-hidden">
            {/* Main content: resizable editor + preview (Row 2 lives in each pane header) */}
            <div className="min-h-0 flex-1 overflow-hidden">
              {/* Desktop: resizable split */}
              <div className="hidden h-full lg:block">
                <ResizablePanelGroup orientation="horizontal">
                  <ResizablePanel defaultSize={50} minSize={35}>
                    <div className="h-full overflow-hidden">
                      <ActiveSectionEditor
                        draft={draft}
                        activeSection={activeSection}
                        onSaveProfile={saveProfile}
                        onSaveSection={saveSection}
                        leading={sidebarTrigger}
                      />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={50} minSize={30}>
                    <div className="h-full overflow-hidden bg-muted">
                      <PreviewPane
                        draft={draft}
                        onSavePdfPresentation={savePdfPresentation}
                        onOpenSection={handleOpenPreviewSection}
                        actions={previewActions}
                      />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>

              {/* Mobile/Tablet: stacked with toggle */}
              <ResumeEditorMobileContent
                draft={draft}
                activeSection={activeSection}
                onSaveProfile={saveProfile}
                onSaveSection={saveSection}
                onSavePdfPresentation={savePdfPresentation}
                onOpenSection={handleOpenPreviewSection}
                leading={sidebarTrigger}
                previewActions={previewActions}
              />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
