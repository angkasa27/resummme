"use client";

import React, { useState } from "react";

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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DownloadIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  Loader,
  PenLineIcon,
  PrinterIcon,
  UploadIcon,
} from "lucide-react";
import { useResumeEditorController } from "@/features/resume-editor/hooks/use-resume-editor-controller";
import { AppSidebar } from "@/features/resume-editor/app-sidebar";
import { useClientReady } from "@/hooks/use-client-ready";
import type { ResumeDraft } from "@/lib/resume/schema";
import { PreviewPane } from "./preview-pane";
import { ActiveSectionEditor } from "./active-section-editor";

type ResumeEditorShellProps = {
  initialDraft?: ResumeDraft;
};

export function ResumeEditorShell({ initialDraft }: ResumeEditorShellProps) {
  const isClientReady = useClientReady();
  const {
    fileInputRef,
    draft,
    activeSection,
    openImportPicker,
    handleImport,
    handleExport,
    handlePrint,
    requestSectionChange,
    reorderSection,
    setSectionVisibility,
    savePdfPresentation,
    saveProfile,
    saveSection,
  } = useResumeEditorController({ initialDraft });

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
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImport}
      />

      <SidebarProvider
        defaultOpen={true}
        className="h-full min-h-0"
        style={
          { "--sidebar-width": "260px", minHeight: 0 } as React.CSSProperties
        }
      >
        <AppSidebar
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
            <h1 className="truncate text-sm font-semibold tracking-tight">
              Resume Editor
            </h1>

            <div className="ml-auto flex items-center gap-1.5">
              {/* Desktop actions */}
              <div className="hidden items-center gap-1.5 sm:flex">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openImportPicker}
                >
                  <UploadIcon data-icon="inline-start" />
                  Import
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                >
                  <DownloadIcon data-icon="inline-start" />
                  Export
                </Button>
                <Button type="button" size="sm" onClick={handlePrint}>
                  <PrinterIcon data-icon="inline-start" />
                  Export PDF
                </Button>
              </div>

              {/* Mobile actions */}
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="More actions"
                      />
                    }
                  >
                    <EllipsisVerticalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={8}>
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={openImportPicker}>
                        <UploadIcon />
                        Import
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExport}>
                        <DownloadIcon />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handlePrint}>
                        <PrinterIcon />
                        Export PDF
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
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
                      onBack={() => {}}
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
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>

            {/* Mobile/Tablet: stacked with toggle */}
            <MobileMainContent
              draft={draft}
              activeSection={activeSection}
              saveProfile={saveProfile}
              saveSection={saveSection}
              savePdfPresentation={savePdfPresentation}
            />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

function MobileMainContent({
  draft,
  activeSection,
  saveProfile,
  saveSection,
  savePdfPresentation,
}: {
  draft: ResumeDraft;
  activeSection: string;
  saveProfile: (profile: ResumeDraft["profile"]) => void;
  saveSection: <K extends keyof ResumeDraft["sections"]>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K],
  ) => void;
  savePdfPresentation: (
    pdfPresentation: ResumeDraft["pdfPresentation"],
  ) => void;
}) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="relative h-full lg:hidden">
      {showPreview ? (
        <div className="h-full overflow-hidden bg-muted">
          <PreviewPane
            draft={draft}
            onSavePdfPresentation={savePdfPresentation}
          />
        </div>
      ) : (
        <div className="h-full overflow-hidden">
          <ActiveSectionEditor
            draft={draft}
            activeSection={activeSection as never}
            onBack={() => {}}
            onSaveProfile={saveProfile}
            onSaveSection={saveSection}
          />
        </div>
      )}

      {/* Floating preview toggle */}
      <Button
        type="button"
        size="sm"
        variant={showPreview ? "default" : "outline"}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        onClick={() => setShowPreview(!showPreview)}
      >
        {showPreview ? (
          <>
            <PenLineIcon data-icon="inline-start" />
            Editor
          </>
        ) : (
          <>
            <EyeIcon data-icon="inline-start" />
            Preview
          </>
        )}
      </Button>
    </div>
  );
}
