"use client";

import { Loader, PlusIcon, TriangleAlert } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useClientReady } from "@/hooks/use-client-ready";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

import { useResumeEditorController } from "@/features/resume-editor/state/use-resume-editor-controller";
import { ExtractCvDialog } from "@/features/resume-editor/controls/extract-cv-dialog";
import { PdfImportProgress } from "@/features/resume-editor/controls/pdf-import-progress";
import { DesktopSectionShell } from "@/features/resume-editor/editor/desktop/section-shell";
import {
  EditorControlPanel,
  ZOOM_DEFAULT,
} from "@/features/resume-editor/controls/editor-control-panel";
import { DesktopCollectionForm } from "@/features/resume-editor/editor/desktop/forms/collection-form";
import { DesktopProfileForm } from "@/features/resume-editor/editor/desktop/forms/profile-form";
import { DesktopSummaryForm } from "@/features/resume-editor/editor/desktop/forms/summary-form";
import { createPreviewRenderContext } from "@/features/resume-editor/preview/engine";
import { PreviewDocumentRoot } from "@/features/resume-editor/preview/kit/document-root";
import {
  getLayout,
  renderLayoutHeader,
  shouldHideSummaryHeading,
} from "@/features/resume-editor/preview/layout-registry";
import { LayoutSection } from "@/features/resume-editor/preview/layout-section";
import { SummaryView } from "@/features/resume-editor/preview/sections/summary";
import { normalizePdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { LayoutSlots } from "@/features/resume-editor/preview/layout-types";
import {
  getOrderedVisibleSectionKeys,
  isCollectionSectionKey,
  resumeSectionKeys,
  sectionLabels,
  type CollectionSectionKey,
  type EditorPanelKey,
  type ResumeSectionPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import type { DraftStorage } from "@/features/resume-editor/domain/draft/draft-storage";
import { useEditorHeader } from "@/features/resume-editor/chrome/use-editor-header";

type ResumeEditorDesktopProps = {
  initialDraft?: ResumeDraft;
  /** Persistence module ("batteries"). Defaults to local storage. */
  storage?: DraftStorage;
  /** Right-aligned header slot. Defaults to the GitHub link. */
  headerActions?: ReactNode;
};

type EditingTarget = "profile" | "summary" | CollectionSectionKey | null;

export function ResumeEditorDesktop({
  initialDraft,
  storage,
  headerActions,
}: ResumeEditorDesktopProps) {
  const isClientReady = useClientReady();
  const {
    jsonFileInputRef,
    draft,
    isExportingPdf,
    isImportingPdf,
    openJsonImportPicker,
    handleJsonImport,
    submitPdfFile,
    handleExport,
    handlePrint,
    saveProfile,
    saveSection,
    savePdfPresentation,
    reorderSection,
    setSectionVisibility,
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
  });

  const [editing, setEditing] = useState<EditingTarget>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const [isExtractCvOpen, setIsExtractCvOpen] = useState(false);
  const [pendingHideKey, setPendingHideKey] =
    useState<CollectionSectionKey | null>(null);
  const [zoom, setZoom] = useState<number>(ZOOM_DEFAULT);

  useKeyboardShortcuts({
    "mod+z": undo,
    "mod+shift+z": redo,
    "mod+s": {
      handler: () => toast.success("Auto-saved"),
      ignoreInputFocus: false,
    },
    escape: { handler: requestCloseEditor, ignoreInputFocus: true },
  });

  if (!isClientReady) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader className="size-8 animate-spin" />
          <p className="text-sm font-semibold tracking-tight">Loading editor</p>
        </div>
      </div>
    );
  }

  const presentation = normalizePdfPresentation(draft.pdfPresentation);
  const context = createPreviewRenderContext(draft, "preview");
  const layout = getLayout(context.presentation.layoutId);
  const visibleSectionKeys = getOrderedVisibleSectionKeys(draft.sections);

  const hiddenSectionKeys = resumeSectionKeys.filter(
    (key) => !draft.sections[key].visible,
  );

  function startEditingProfile() {
    setIsFormDirty(false);
    setEditing("profile");
  }

  function startEditingSection<K extends ResumeSectionPanelKey>(key: K) {
    setIsFormDirty(false);
    setEditing(key);
  }

  function closeEditor() {
    setEditing(null);
    setIsFormDirty(false);
    setIsDiscardConfirmOpen(false);
  }

  function requestCloseEditor() {
    if (isFormDirty) {
      setIsDiscardConfirmOpen(true);
      return;
    }
    closeEditor();
  }

  function requestHideSection(key: CollectionSectionKey) {
    setPendingHideKey(key);
  }

  function confirmHideSection() {
    if (!pendingHideKey) return;
    setSectionVisibility(pendingHideKey, false);
    if (editing === pendingHideKey) {
      setEditing(null);
    }
    setPendingHideKey(null);
  }

  function openEditorSection(panel: EditorPanelKey) {
    if (panel === "profile") {
      startEditingProfile();
      return;
    }
    const sectionPanel = panel as ResumeSectionPanelKey;
    if (panel === "summary" || isCollectionSectionKey(sectionPanel)) {
      startEditingSection(sectionPanel);
      if (!draft.sections[sectionPanel].visible) {
        setSectionVisibility(sectionPanel, true);
      }
    }
  }

  const controlPanelProps = {
    presentation,
    draft,
    onPresentationChange: savePdfPresentation,
    onImportJson: openJsonImportPicker,
    onExtractCv: () => setIsExtractCvOpen(true),
    onExport: handleExport,
    onExportPdf: handlePrint,
    onOpenSection: openEditorSection,
    isExportingPdf,
    isImportingPdf,
    zoom,
    onZoomChange: setZoom,
  };

  // The interactive preview document, shared by both the desktop (manual zoom)
  // and mobile (fit-to-width scale) branches so the slot-building logic lives
  // in one place.
  const previewDocument = (() => {
    const collectionKeys = visibleSectionKeys.filter(isCollectionSectionKey);

    // Empty sections render a slot with no `renderable`, so `section` is
    // omitted; assert the entry type once here (TS can't co-vary key with
    // the union element across the map). Mirrors resume-document.tsx.
    function renderSectionSlot(
      sectionKey: CollectionSectionKey,
    ): LayoutSlots["sections"][number] {
      const orderIndex = collectionKeys.indexOf(sectionKey);
      const renderable = context.sections.find((s) => s.key === sectionKey);
      const isEditing = editing === sectionKey;

      return {
        key: sectionKey,
        node: (
          <DesktopSectionShell
            ariaLabel={sectionLabels[sectionKey]}
            isEditing={isEditing}
            onEdit={() => startEditingSection(sectionKey)}
            onMoveUp={() => {
              const anchorKey = collectionKeys[orderIndex - 1];
              if (anchorKey) {
                reorderSection(sectionKey, anchorKey);
              }
            }}
            onMoveDown={() => {
              const anchorKey = collectionKeys[orderIndex + 1];
              if (anchorKey) {
                reorderSection(sectionKey, anchorKey);
              }
            }}
            onDelete={() => requestHideSection(sectionKey)}
            canMoveUp={orderIndex > 0}
            canMoveDown={orderIndex < collectionKeys.length - 1}
          >
            {renderable ? (
              <LayoutSection layout={layout} section={renderable} />
            ) : (
              <EmptySectionPlaceholder
                label={sectionLabels[sectionKey]}
                onEdit={() => startEditingSection(sectionKey)}
              />
            )}
          </DesktopSectionShell>
        ),
      } as LayoutSlots["sections"][number];
    }

    const slots: LayoutSlots = {
      header: (
        <DesktopSectionShell
          ariaLabel="Profile"
          isEditing={editing === "profile"}
          onEdit={startEditingProfile}
        >
          {renderLayoutHeader(context)}
        </DesktopSectionShell>
      ),
      summary:
        editing === "summary" || context.summaryContent ? (
          <DesktopSectionShell
            ariaLabel="Summary"
            isEditing={editing === "summary"}
            onEdit={() => startEditingSection("summary")}
          >
            <SummaryView
              content={context.summaryContent ?? ""}
              showHeading={
                !shouldHideSummaryHeading(context.presentation.layoutId)
              }
            />
          </DesktopSectionShell>
        ) : null,
      sections: collectionKeys.map(renderSectionSlot),
    };

    return (
      <PreviewDocumentRoot context={context}>
        <layout.Component context={context} slots={slots} />

        {hiddenSectionKeys.length > 0 ? (
          <div className="pt-6 flex flex-wrap justify-center gap-2 print:hidden border-t border-dashed">
            {hiddenSectionKeys.map((key) => (
              <Button
                key={key}
                type="button"
                variant="outline"
                className="rounded-full font-sans!"
                onClick={() => {
                  setSectionVisibility(key, true);
                  startEditingSection(key);
                }}
              >
                <PlusIcon data-icon="inline-start" />
                Add {sectionLabels[key]}
              </Button>
            ))}
          </div>
        ) : null}
      </PreviewDocumentRoot>
    );
  })();

  return (
    <TooltipProvider>
      <div className="flex h-[calc(100dvh-3rem)] flex-col bg-muted/40">
        <input
          ref={jsonFileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleJsonImport}
        />

        <ExtractCvDialog
          open={isExtractCvOpen}
          onOpenChange={setIsExtractCvOpen}
          onSubmit={(file) => {
            void submitPdfFile(file);
          }}
        />
        <PdfImportProgress open={isImportingPdf} />

        {/* Body: preview + control panel */}
        <div className="flex flex-1 h-full">
          <main className="flex flex-1 justify-center overflow-x-auto overflow-y-auto h-full px-3 py-6 sm:px-6 sm:py-10">
            <div style={{ zoom }} className="origin-top print:zoom-[1]">
              {previewDocument}
            </div>
          </main>

          {/* Desktop side rail */}
          <aside className="sticky top-0 hidden h-full w-80 shrink-0 overflow-hidden border-l bg-background md:flex md:flex-col print:hidden">
            <EditorControlPanel {...controlPanelProps} />
          </aside>
        </div>

        {/* Editor surface — centered dialog. */}
        {(() => {
          const handleOpenChange = (open: boolean) => {
            if (open) return;
            requestCloseEditor();
          };

          const formContent =
            editing === "profile" ? (
              <DesktopProfileForm
                draft={draft}
                onSave={saveProfile}
                onCancel={requestCloseEditor}
                onClose={closeEditor}
                onDirtyChange={setIsFormDirty}
              />
            ) : editing === "summary" ? (
              <DesktopSummaryForm
                draft={draft}
                onSave={(value) => saveSection("summary", value)}
                onCancel={requestCloseEditor}
                onClose={closeEditor}
                onDirtyChange={setIsFormDirty}
              />
            ) : editing !== null && isCollectionSectionKey(editing) ? (
              <DesktopCollectionForm
                draft={draft}
                sectionKey={editing}
                onSave={(value) => saveSection(editing, value as never)}
                onCancel={requestCloseEditor}
                onClose={closeEditor}
                onDirtyChange={setIsFormDirty}
              />
            ) : null;

          return (
            <Dialog open={editing !== null} onOpenChange={handleOpenChange}>
              <DialogContent
                showCloseButton={false}
                className="flex max-h-[92dvh] w-full flex-col gap-0 p-0 sm:max-w-2xl"
              >
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-5">
                  {formContent}
                </div>
              </DialogContent>
            </Dialog>
          );
        })()}

        {/* Discard-changes confirmation. */}
        <AlertDialog
          open={isDiscardConfirmOpen}
          onOpenChange={setIsDiscardConfirmOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia className="text-destructive bg-destructive/10">
                <TriangleAlert />
              </AlertDialogMedia>
              <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved edits. Closing now will lose them.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep editing</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={closeEditor}>
                Discard
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={pendingHideKey !== null}
          onOpenChange={(open) => {
            if (!open) setPendingHideKey(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia className="text-destructive bg-destructive/10">
                <TriangleAlert />
              </AlertDialogMedia>
              <AlertDialogTitle>
                Hide {pendingHideKey ? sectionLabels[pendingHideKey] : ""}{" "}
                section?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You can add it back from below the resume at any time.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmHideSection}
                variant="destructive"
              >
                Hide
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}

function EmptySectionPlaceholder({
  label,
  onEdit,
}: {
  label: string;
  onEdit: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="w-full rounded-md border border-dashed px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {label} — click to add the first entry
    </button>
  );
}
