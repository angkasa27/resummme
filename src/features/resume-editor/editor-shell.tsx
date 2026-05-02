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
    dirtySections,
    pendingSection,
    pendingViewMode,
    warningOpen,
    openImportPicker,
    handleImport,
    handleExport,
    handlePrint,
    requestSectionChange,
    returnToSectionList,
    moveSection,
    setSectionVisibility,
    setSectionDirty,
    discardPendingSectionChanges,
    cancelPendingSectionChange,
    saveProfile,
    saveSection,
  } = useResumeEditorController({ initialDraft });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
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
    <div className="min-h-screen bg-muted/20 text-foreground print:bg-background">
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
        <main className="mx-auto grid max-w-[1720px] grid-cols-[minmax(420px,520px)_minmax(0,1fr)] gap-6 px-4 py-6 lg:px-6 print:block print:px-0 print:py-0">
          <div className="min-h-0 print:hidden">
            <EditorPane
              draft={draft}
              activeSection={activeSection}
              editorViewMode={editorViewMode}
              dirtySections={dirtySections}
              pendingSection={pendingSection}
              pendingViewMode={pendingViewMode}
              warningOpen={warningOpen}
              onRequestSectionChange={requestSectionChange}
              onReturnToSectionList={returnToSectionList}
              onMoveSection={moveSection}
              onSetSectionVisibility={setSectionVisibility}
              onSetSectionDirty={setSectionDirty}
              onDiscardPendingSectionChanges={discardPendingSectionChanges}
              onCancelPendingSectionChange={cancelPendingSectionChange}
              onSaveProfile={saveProfile}
              onSaveSection={saveSection}
            />
          </div>
          <div className="min-h-0">
            <PreviewPane draft={draft} />
          </div>
        </main>
      ) : (
        <main className="mx-auto flex max-w-[1720px] flex-col gap-4 px-4 py-4 print:px-0 print:py-0">
          <Tabs defaultValue="editor">
            <TabsList className="w-full">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" keepMounted>
              <EditorPane
                draft={draft}
                activeSection={activeSection}
                editorViewMode={editorViewMode}
                dirtySections={dirtySections}
                pendingSection={pendingSection}
                pendingViewMode={pendingViewMode}
                warningOpen={warningOpen}
                onRequestSectionChange={requestSectionChange}
                onReturnToSectionList={returnToSectionList}
                onMoveSection={moveSection}
                onSetSectionVisibility={setSectionVisibility}
                onSetSectionDirty={setSectionDirty}
                onDiscardPendingSectionChanges={discardPendingSectionChanges}
                onCancelPendingSectionChange={cancelPendingSectionChange}
                onSaveProfile={saveProfile}
                onSaveSection={saveSection}
              />
            </TabsContent>
            <TabsContent value="preview" keepMounted>
              <PreviewPane draft={draft} />
            </TabsContent>
          </Tabs>
        </main>
      )}
    </div>
  );
}
