"use client";

import { EyeIcon, FileTextIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorPane } from "@/features/resume-editor/editor-pane";
import { useResumeEditorController } from "@/features/resume-editor/hooks/use-resume-editor-controller";
import { PreviewPane } from "@/features/resume-editor/preview-pane";
import type { ResumeDraft } from "@/lib/resume/schema";

type ResumeEditorShellProps = {
  initialDraft?: ResumeDraft;
};

export function ResumeEditorShell({ initialDraft }: ResumeEditorShellProps) {
  const {
    fileInputRef,
    draft,
    activeSection,
    dirtySections,
    pendingSection,
    warningOpen,
    openImportPicker,
    handleImport,
    handleExport,
    handlePrint,
    requestSectionChange,
    setSectionDirty,
    discardPendingSectionChanges,
    cancelPendingSectionChange,
    saveProfile,
    saveSection,
  } = useResumeEditorController({ initialDraft });

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-6 print:bg-background print:p-0">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImport}
      />

      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:hidden">
        <Tabs defaultValue="edit">
          <TabsList className="w-full">
            <TabsTrigger value="edit">
              <FileTextIcon data-icon="inline-start" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview">
              <EyeIcon data-icon="inline-start" />
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" keepMounted>
            <EditorPane
              draft={draft}
              activeSection={activeSection}
              dirtySections={dirtySections}
              pendingSection={pendingSection}
              warningOpen={warningOpen}
              onOpenImportPicker={openImportPicker}
              onExport={handleExport}
              onPrint={handlePrint}
              onRequestSectionChange={requestSectionChange}
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
      </div>

      <div className="mx-auto hidden max-w-[1600px] grid-cols-[minmax(420px,560px)_1fr] gap-6 lg:grid print:block">
        <div className="print:hidden">
          <EditorPane
            draft={draft}
            activeSection={activeSection}
            dirtySections={dirtySections}
            pendingSection={pendingSection}
            warningOpen={warningOpen}
            onOpenImportPicker={openImportPicker}
            onExport={handleExport}
            onPrint={handlePrint}
            onRequestSectionChange={requestSectionChange}
            onSetSectionDirty={setSectionDirty}
            onDiscardPendingSectionChanges={discardPendingSectionChanges}
            onCancelPendingSectionChange={cancelPendingSectionChange}
            onSaveProfile={saveProfile}
            onSaveSection={saveSection}
          />
        </div>
        <div>
          <PreviewPane draft={draft} />
        </div>
      </div>
    </div>
  );
}
