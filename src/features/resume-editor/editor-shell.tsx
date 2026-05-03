"use client";

import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorNavbar } from "@/features/resume-editor/editor-navbar";
import { EditorPane } from "@/features/resume-editor/editor-pane";
import { PreviewPane } from "@/features/resume-editor/preview-pane";
import { useResumeEditorController } from "@/features/resume-editor/hooks/use-resume-editor-controller";
import type { ResumeDraft } from "@/lib/resume/schema";

type ResumeEditorShellProps = {
  initialDraft?: ResumeDraft;
};

export function ResumeEditorShell({ initialDraft }: ResumeEditorShellProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const {
    fileInputRef,
    draft,
    activeSection,
    editorViewMode,
    pendingIntent,
    confirmExitOpen,
    openImportPicker,
    handleImport,
    handleExport,
    handlePrint,
    requestSectionChange,
    returnToSectionList,
    moveSection,
    setSectionVisibility,
    setSectionDirty,
    discardPendingChanges,
    cancelPendingIntent,
    saveProfile,
    saveSection,
  } = useResumeEditorController({ initialDraft });

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    function syncDesktopState(event?: MediaQueryListEvent) {
      setIsDesktop(event?.matches ?? mediaQuery.matches);
    }

    syncDesktopState();
    mediaQuery.addEventListener("change", syncDesktopState);

    return () => {
      mediaQuery.removeEventListener("change", syncDesktopState);
    };
  }, []);

  return (
    <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-muted/40 text-foreground print:block print:h-auto print:overflow-visible print:bg-background">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImport}
      />

      <EditorNavbar
        onOpenImportPicker={openImportPicker}
        onExport={handleExport}
        onPrint={handlePrint}
      />

      {isDesktop ? (
        <main className="mx-auto grid h-full min-h-0 w-full max-w-[1500px] grid-cols-[minmax(320px,420px)_minmax(0,1fr)] gap-4 overflow-hidden px-4 py-4 print:block print:h-auto print:overflow-visible print:px-0 print:py-0">
          <div className="h-full min-h-0 overflow-hidden rounded-lg border bg-card print:hidden">
            <EditorPane
              draft={draft}
              activeSection={activeSection}
              editorViewMode={editorViewMode}
              pendingIntent={pendingIntent}
              confirmExitOpen={confirmExitOpen}
              onRequestSectionChange={requestSectionChange}
              onReturnToSectionList={returnToSectionList}
              onMoveSection={moveSection}
              onSetSectionVisibility={setSectionVisibility}
              onSetSectionDirty={setSectionDirty}
              onDiscardPendingChanges={discardPendingChanges}
              onCancelPendingIntent={cancelPendingIntent}
              onSaveProfile={saveProfile}
              onSaveSection={saveSection}
            />
          </div>
          <div className="h-full min-h-0 overflow-hidden rounded-lg border bg-background">
            <PreviewPane draft={draft} />
          </div>
        </main>
      ) : (
        <main className="mx-auto flex h-full min-h-0 w-full max-w-[720px] flex-col gap-3 overflow-hidden px-3 py-3 print:h-auto print:overflow-visible print:px-0 print:py-0">
          <Tabs defaultValue="editor" className="flex min-h-0 flex-1 flex-col gap-2">
            <TabsList className="h-10 w-full rounded-md bg-background p-1">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent
              value="editor"
              keepMounted
              className="min-h-0 flex-1 overflow-hidden rounded-lg border bg-card"
            >
              <EditorPane
                draft={draft}
                activeSection={activeSection}
                editorViewMode={editorViewMode}
                pendingIntent={pendingIntent}
                confirmExitOpen={confirmExitOpen}
                onRequestSectionChange={requestSectionChange}
                onReturnToSectionList={returnToSectionList}
                onMoveSection={moveSection}
                onSetSectionVisibility={setSectionVisibility}
                onSetSectionDirty={setSectionDirty}
                onDiscardPendingChanges={discardPendingChanges}
                onCancelPendingIntent={cancelPendingIntent}
                onSaveProfile={saveProfile}
                onSaveSection={saveSection}
              />
            </TabsContent>
            <TabsContent
              value="preview"
              keepMounted
              className="min-h-0 flex-1 overflow-hidden rounded-lg border bg-background"
            >
              <PreviewPane draft={draft} />
            </TabsContent>
          </Tabs>
        </main>
      )}
    </div>
  );
}
