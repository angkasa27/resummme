"use client";

import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveSectionEditor } from "@/features/resume-editor/active-section-editor";
import { DirtyExitDialog } from "@/features/resume-editor/dirty-exit-dialog";
import { EditorNavbar } from "@/features/resume-editor/editor-navbar";
import { PreviewPane } from "@/features/resume-editor/preview-pane";
import { SectionNavigator } from "@/features/resume-editor/section-navigator";
import { useResumeEditorController } from "@/features/resume-editor/hooks/use-resume-editor-controller";
import type { ResumeDraft } from "@/lib/resume/schema";

type ResumeEditorShellProps = {
  initialDraft?: ResumeDraft;
};

export function ResumeEditorShell({ initialDraft }: ResumeEditorShellProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isWideDesktop, setIsWideDesktop] = useState(false);
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
    reorderSection,
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

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const wideDesktopQuery = window.matchMedia("(min-width: 1680px)");

    function syncDesktopState() {
      setIsDesktop(desktopQuery.matches);
      setIsWideDesktop(wideDesktopQuery.matches);
    }

    syncDesktopState();
    desktopQuery.addEventListener("change", syncDesktopState);
    wideDesktopQuery.addEventListener("change", syncDesktopState);

    return () => {
      desktopQuery.removeEventListener("change", syncDesktopState);
      wideDesktopQuery.removeEventListener("change", syncDesktopState);
    };
  }, []);

  const outlinePane = (
    <SectionNavigator
      draft={draft}
      activeSection={activeSection}
      onRequestSectionChange={requestSectionChange}
      onMoveSection={moveSection}
      onReorderSection={reorderSection}
      onSetSectionVisibility={setSectionVisibility}
    />
  );

  const activeFormPane = (
    <ActiveSectionEditor
      draft={draft}
      activeSection={activeSection}
      onBack={returnToSectionList}
      onSetSectionDirty={setSectionDirty}
      onSaveProfile={saveProfile}
      onSaveSection={saveSection}
    />
  );

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

      <DirtyExitDialog
        open={confirmExitOpen}
        pendingIntent={pendingIntent}
        onDiscardChanges={discardPendingChanges}
        onStayEditing={cancelPendingIntent}
      />

      {isDesktop ? (
        <main
          data-testid="resume-editor-desktop-main"
          data-layout={isWideDesktop ? "three-pane" : "two-pane"}
          className={
            isWideDesktop
              ? "grid h-full min-h-0 w-full grid-cols-[340px_520px_minmax(0,1fr)] gap-0 overflow-hidden px-0 py-0 print:block print:h-auto print:overflow-visible"
              : "grid h-full min-h-0 w-full grid-cols-[minmax(360px,480px)_minmax(0,1fr)] gap-0 overflow-hidden px-0 py-0 print:block print:h-auto print:overflow-visible"
          }
        >
          {isWideDesktop ? (
            <>
              <div
                data-testid="outline-pane"
                className="h-full min-h-0 overflow-hidden border-r bg-card print:hidden"
              >
                {outlinePane}
              </div>
              <div
                data-testid="active-form-pane"
                className="h-full min-h-0 overflow-hidden border-r bg-card print:hidden"
              >
                {activeFormPane}
              </div>
            </>
          ) : (
            <div
              data-testid="editor-workspace-pane"
              className="h-full min-h-0 overflow-hidden border-r bg-card print:hidden"
            >
              {editorViewMode === "list" ? outlinePane : activeFormPane}
            </div>
          )}

          <div
            data-testid="preview-pane"
            className="h-full min-h-0 overflow-hidden bg-background"
          >
            <PreviewPane draft={draft} />
          </div>
        </main>
      ) : (
        <main className="mx-auto flex h-full min-h-0 w-full max-w-[720px] flex-col gap-3 overflow-hidden px-3 py-3 print:h-auto print:overflow-visible print:px-0 print:py-0">
          <Tabs defaultValue="sections" className="flex min-h-0 flex-1 flex-col gap-2">
            <TabsList className="h-10 w-full rounded-md bg-background p-1">
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent
              value="sections"
              keepMounted
              className="min-h-0 flex-1 overflow-hidden rounded-lg border bg-card"
            >
              {outlinePane}
            </TabsContent>
            <TabsContent
              value="edit"
              keepMounted
              className="min-h-0 flex-1 overflow-hidden rounded-lg border bg-card"
            >
              {activeFormPane}
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
