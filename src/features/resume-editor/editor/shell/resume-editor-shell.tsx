"use client";

import Link from "next/link";
import React from "react";

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
import { Loader, Redo2Icon, Undo2Icon } from "lucide-react";

import { ActiveSectionEditor } from "@/features/resume-editor/editor/active-section-editor";
import { useResumeEditorController } from "@/features/resume-editor/editor/hooks/use-resume-editor-controller";
import { ResumeEditorSidebar } from "@/features/resume-editor/editor/resume-editor-sidebar";
import { ResumeEditorMobileContent } from "@/features/resume-editor/editor/shell/resume-editor-mobile-content";
import { ResumeEditorShellActions } from "@/features/resume-editor/editor/shell/resume-editor-shell-actions";
import { PreviewPane } from "@/features/resume-editor/preview/components/preview-pane";
import { useClientReady } from "@/hooks/use-client-ready";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { toast } from "sonner";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type ResumeEditorShellProps = {
  initialDraft?: ResumeDraft;
};

export function ResumeEditorShell({ initialDraft }: ResumeEditorShellProps) {
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
  } = useResumeEditorController({ initialDraft });
  const isMobile = useIsMobile();

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

  return (
    <div className="h-dvh overflow-hidden">
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
          {/* Top navbar — h-12 to match sidebar header */}
          <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-3 print:hidden">
            <SidebarTrigger className="-ml-1" />
            {/* <h1 className="font-semibold italic pr-1">Resummme</h1> */}
            <Tabs value="legacy" className="h-8">
              <TabsList className="rounded-md border">
                <TabsTrigger
                  value="canvas"
                  nativeButton={false}
                  render={<Link href="/" />}
                  className="px-2 py-0 leading-none! text-xs!"
                >
                  Canvas
                </TabsTrigger>
                <TabsTrigger
                  value="legacy"
                  className="px-2 py-0 leading-none! rounded text-xs! data-active:bg-primary/12 data-active:text-primary hover:text-primary cursor-default"
                >
                  Legacy
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex-1" />
            <ButtonGroup>
              <Button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                aria-label="Undo"
                variant="outline"
                size={isMobile ? "icon-sm" : "sm"}
              >
                <Undo2Icon className="size-4" />
                <span className="hidden md:flex">Undo</span>
              </Button>
              <Button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                aria-label="Redo"
                variant="outline"
                size={isMobile ? "icon-sm" : "sm"}
              >
                <Redo2Icon className="size-4" />
                <span className="hidden md:flex">Redo</span>
              </Button>
            </ButtonGroup>
            <ResumeEditorShellActions
              onImportJson={openJsonImportPicker}
              onImportPdf={openPdfImportPicker}
              onExport={handleExport}
              onExportPdf={handlePrint}
              isExportingPdf={isExportingPdf}
              isImportingPdf={isImportingPdf}
            />
          </header>

          {/* Main content: resizable editor + preview */}
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
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="h-full overflow-hidden bg-muted">
                    <PreviewPane
                      draft={draft}
                      onSavePdfPresentation={savePdfPresentation}
                      onOpenSection={(panel) => {
                        if (panel !== "profile" && panel !== "summary") {
                          requestSectionChange(panel);
                        }
                      }}
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
              onOpenSection={(panel) => {
                if (panel !== "profile" && panel !== "summary") {
                  requestSectionChange(panel);
                }
              }}
            />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
