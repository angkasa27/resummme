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
    <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-muted/20 text-foreground print:block print:h-auto print:overflow-visible print:bg-background">
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
        <main className="mx-auto grid h-full min-h-0 w-full max-w-[1720px] grid-cols-[minmax(420px,520px)_minmax(0,1fr)] overflow-hidden px-4 py-5 lg:px-0 lg:py-0 print:block print:h-auto print:overflow-visible print:px-0 print:py-0">
          <div className="h-full min-h-0 print:hidden">
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
          <div className="h-full min-h-0">
            <PreviewPane draft={draft} />
          </div>
        </main>
      ) : (
        <main className="mx-auto flex h-full min-h-0 w-full max-w-[1720px] flex-col gap-4 overflow-hidden px-4 py-4 print:h-auto print:overflow-visible print:px-0 print:py-0">
          <Tabs defaultValue="editor" className="flex min-h-0 flex-1 flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" keepMounted className="min-h-0 flex-1">
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
            <TabsContent value="preview" keepMounted className="min-h-0 flex-1">
              <PreviewPane draft={draft} />
            </TabsContent>
          </Tabs>
        </main>
      )}
    </div>
  );
}
