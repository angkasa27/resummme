"use client";

import dynamic from "next/dynamic";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorNavbar } from "@/features/resume-editor/editor-navbar";
import { useResumeEditorController } from "@/features/resume-editor/hooks/use-resume-editor-controller";
import type { ResumeDraft } from "@/lib/resume/schema";
import { cn } from "@/lib/utils";

const ActiveSectionEditor = dynamic(
  () => import("@/features/resume-editor/active-section-editor").then((mod) => mod.ActiveSectionEditor),
  { ssr: false }
);
const PreviewPane = dynamic(
  () => import("@/features/resume-editor/preview-pane").then((mod) => mod.PreviewPane),
  { ssr: false }
);
const SectionNavigator = dynamic(
  () => import("@/features/resume-editor/section-navigator").then((mod) => mod.SectionNavigator),
  { ssr: false }
);

type ResumeEditorShellProps = {
  initialDraft?: ResumeDraft;
};

export function ResumeEditorShell({ initialDraft }: ResumeEditorShellProps) {
  const {
    fileInputRef,
    draft,
    activeSection,
    editorViewMode,
    openImportPicker,
    handleImport,
    handleExport,
    handlePrint,
    requestSectionChange,
    returnToSectionList,
    moveSection,
    reorderSection,
    setSectionVisibility,
    savePdfPresentation,
    saveProfile,
    saveSection,
  } = useResumeEditorController({ initialDraft });



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
      onSaveProfile={saveProfile}
      onSaveSection={saveSection}
    />
  );

  return (
    <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-muted/40 text-foreground">
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

      <main
        data-testid="resume-editor-desktop-main"
        className="hidden lg:grid h-full min-h-0 w-full grid-cols-[minmax(360px,480px)_minmax(0,1fr)] min-[1680px]:grid-cols-[340px_520px_minmax(0,1fr)] gap-0 overflow-hidden px-0 py-0"
      >
        <div
          data-testid="outline-pane"
          className={cn(
            "h-full min-h-0 overflow-hidden border-r bg-card",
            editorViewMode === "list" ? "block" : "hidden min-[1680px]:block"
          )}
        >
          {outlinePane}
        </div>
        <div
          data-testid="active-form-pane"
          className={cn(
            "h-full min-h-0 overflow-hidden border-r bg-card",
            editorViewMode === "form" ? "block" : "hidden min-[1680px]:block"
          )}
        >
          {activeFormPane}
        </div>

        <div
          data-testid="preview-pane"
          className="h-full min-h-0 overflow-hidden bg-background"
        >
          <PreviewPane
            draft={draft}
            onSavePdfPresentation={savePdfPresentation}
          />
        </div>
      </main>

      <main className="mx-auto flex lg:hidden h-full min-h-0 w-full max-w-[720px] flex-col gap-3 overflow-hidden px-3 py-3">
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
            <PreviewPane
              draft={draft}
              onSavePdfPresentation={savePdfPresentation}
            />
          </TabsContent>
        </Tabs>
      </main>

    </div>
  );
}
