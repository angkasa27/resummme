"use client";

import {
  Loader,
  PlusIcon,
  SlidersHorizontalIcon,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

import { useResumeEditorController } from "@/features/resume-editor/state/use-resume-editor-controller";
import { ExtractCvDialog } from "@/features/resume-editor/canvas/controls/extract-cv-dialog";
import { PdfImportProgress } from "@/features/resume-editor/canvas/controls/pdf-import-progress";
import { CanvasSectionShell } from "@/features/resume-editor/canvas/canvas-section-shell";
import {
  CanvasControlPanel,
  ZOOM_DEFAULT,
} from "@/features/resume-editor/canvas/canvas-control-panel";
import { CanvasCollectionForm } from "@/features/resume-editor/canvas/forms/canvas-collection-form";
import { CanvasProfileForm } from "@/features/resume-editor/canvas/forms/canvas-profile-form";
import { CanvasSummaryForm } from "@/features/resume-editor/canvas/forms/canvas-summary-form";
import { createPreviewRenderContext } from "@/features/resume-editor/preview/engine";
import { PreviewDocumentRoot } from "@/features/resume-editor/preview/kit/document-root";
import {
  getTemplate,
  renderTemplateHeader,
} from "@/features/resume-editor/preview/template-registry";
import { TemplateSection } from "@/features/resume-editor/preview/template-section";
import { SummaryView } from "@/features/resume-editor/preview/sections/summary";
import { normalizePdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { TemplateSlots } from "@/features/resume-editor/preview/template-types";
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
import { useEditorHeader } from "@/features/resume-editor/shared/use-editor-header";

type ResumeEditorCanvasProps = {
  initialDraft?: ResumeDraft;
  /** Persistence module ("batteries"). Defaults to local storage. */
  storage?: DraftStorage;
  /** Right-aligned header slot. Defaults to the GitHub link. */
  headerActions?: ReactNode;
  /** Tab link targets, forwarded to EditorTopBar (default to the bare routes). */
  canvasHref?: string;
  classicHref?: string;
};

type EditingTarget = "profile" | "summary" | CollectionSectionKey | null;

export function ResumeEditorCanvas({
  initialDraft,
  storage,
  headerActions,
  canvasHref,
  classicHref,
}: ResumeEditorCanvasProps) {
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
    canvasHref,
    classicHref,
  });

  const [editing, setEditing] = useState<EditingTarget>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [isExtractCvOpen, setIsExtractCvOpen] = useState(false);
  const [pendingHideKey, setPendingHideKey] =
    useState<CollectionSectionKey | null>(null);
  const [zoom, setZoom] = useState<number>(ZOOM_DEFAULT);
  const isMobile = useIsMobile();
  const [dismissedMobileAlert, setDismissedMobileAlert] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("resume-editor:mobile-alert-dismissed") === "true",
  );

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
  const template = getTemplate(context.presentation.templateId);
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
    if (
      panel === "summary" ||
      isCollectionSectionKey(panel as ResumeSectionPanelKey)
    ) {
      startEditingSection(panel as ResumeSectionPanelKey);
      if (!draft.sections[panel as ResumeSectionPanelKey].visible) {
        setSectionVisibility(panel as ResumeSectionPanelKey, true);
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
          isMobile={isMobile}
        />
        <PdfImportProgress open={isImportingPdf} />

        {isMobile ? (
          <div className="flex justify-center gap-1.5 border-b bg-amber-50 px-3 py-1 text-xs text-amber-800">
            <TriangleAlert className="size-4 shrink-0" />
            <span>
              Canvas isn&apos;t optimized for mobile.{" "}
              <Link
                href="/editor/classic"
                className="font-medium underline underline-offset-2 hover:text-amber-900"
              >
                Try Classic mode
              </Link>{" "}
              for a better experience.
            </span>
          </div>
        ) : null}

        {/* Body: preview + control panel */}
        <div className="flex flex-1 h-full">
          <main className="flex flex-1 justify-center overflow-x-auto overflow-y-auto h-full px-3 py-6 sm:px-6 sm:py-10">
            <div style={{ zoom }} className="origin-top print:zoom-[1]">
              {(() => {
                const collectionKeys = visibleSectionKeys.filter(
                  isCollectionSectionKey,
                );
                const slots: TemplateSlots = {
                  header: (
                    <CanvasSectionShell
                      ariaLabel="Profile"
                      isEditing={editing === "profile"}
                      onEdit={startEditingProfile}
                    >
                      {renderTemplateHeader(context)}
                    </CanvasSectionShell>
                  ),
                  summary:
                    editing === "summary" || context.summaryContent ? (
                      <CanvasSectionShell
                        ariaLabel="Summary"
                        isEditing={editing === "summary"}
                        onEdit={() => startEditingSection("summary")}
                      >
                        <SummaryView
                          content={context.summaryContent ?? ""}
                          showHeading={
                            context.presentation.templateId !== "classic" &&
                            context.presentation.templateId !== "timeline"
                          }
                        />
                      </CanvasSectionShell>
                    ) : null,
                  sections: collectionKeys.map((sectionKey) => {
                    const orderIndex = collectionKeys.indexOf(sectionKey);
                    const renderable = context.sections.find(
                      (s) => s.key === sectionKey,
                    );
                    const isEditing = editing === sectionKey;
                    return {
                      key: sectionKey,
                      node: (
                        <CanvasSectionShell
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
                            <TemplateSection
                              template={template}
                              section={renderable}
                            />
                          ) : (
                            <EmptySectionPlaceholder
                              label={sectionLabels[sectionKey]}
                              onEdit={() => startEditingSection(sectionKey)}
                            />
                          )}
                        </CanvasSectionShell>
                      ),
                    };
                  }),
                };

                return (
                  <PreviewDocumentRoot
                    context={context}
                    className="max-md:w-full!"
                  >
                    <template.Component context={context} slots={slots} />

                    {hiddenSectionKeys.length > 0 ? (
                      <div className="pt-6 flex flex-wrap justify-center gap-2 print:hidden border-t border-dashed">
                        {hiddenSectionKeys.map((key) => (
                          <Button
                            key={key}
                            type="button"
                            variant="outline"
                            // size="sm"
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
              })()}
            </div>
          </main>

          {/* Desktop side rail */}
          <aside className="sticky top-0 hidden h-full w-80 shrink-0 overflow-hidden border-l bg-background lg:flex lg:flex-col print:hidden">
            <CanvasControlPanel {...controlPanelProps} />
          </aside>
        </div>

        {/* Editor surface — bottom drawer on mobile, centered dialog on desktop. */}
        {(() => {
          const handleOpenChange = (open: boolean) => {
            if (open) return;
            requestCloseEditor();
          };

          const formContent =
            editing === "profile" ? (
              <CanvasProfileForm
                draft={draft}
                onSave={saveProfile}
                onCancel={requestCloseEditor}
                onClose={closeEditor}
                onDirtyChange={setIsFormDirty}
              />
            ) : editing === "summary" ? (
              <CanvasSummaryForm
                draft={draft}
                onSave={(value) => saveSection("summary", value)}
                onCancel={requestCloseEditor}
                onClose={closeEditor}
                onDirtyChange={setIsFormDirty}
              />
            ) : editing !== null && isCollectionSectionKey(editing) ? (
              <CanvasCollectionForm
                draft={draft}
                sectionKey={editing}
                onSave={(value) => saveSection(editing, value as never)}
                onCancel={requestCloseEditor}
                onClose={closeEditor}
                onDirtyChange={setIsFormDirty}
              />
            ) : null;

          if (isMobile) {
            return (
              <Sheet open={editing !== null} onOpenChange={handleOpenChange}>
                <SheetContent
                  side="bottom"
                  showCloseButton={false}
                  className="flex h-[92dvh] max-h-[92dvh] flex-col rounded-t-xl p-4 pt-3"
                >
                  <div className="mx-auto mb-2 h-1 w-10 shrink-0 rounded-full bg-border" />
                  <div className="flex min-h-0 flex-1 flex-col">
                    {formContent}
                  </div>
                </SheetContent>
              </Sheet>
            );
          }

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

        {/* Mobile FAB → Sheet drawer */}
        <Sheet open={isMobilePanelOpen} onOpenChange={setIsMobilePanelOpen}>
          <SheetTrigger
            render={
              <Button
                type="button"
                size="icon"
                aria-label="Open control panel"
                className="fixed bottom-5 right-5 z-30 size-12 rounded-full shadow-2xl lg:hidden print:hidden"
              />
            }
          >
            <SlidersHorizontalIcon className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[88%] max-w-sm p-0">
            <SheetHeader className="border-b">
              <SheetTitle>Controls</SheetTitle>
              <SheetDescription>
                Style your resume and import or export your draft.
              </SheetDescription>
            </SheetHeader>
            <CanvasControlPanel {...controlPanelProps} />
          </SheetContent>
        </Sheet>

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

        {isMobile && !dismissedMobileAlert ? (
          <AlertDialog
            defaultOpen
            onOpenChange={(open) => {
              if (!open) {
                localStorage.setItem(
                  "resume-editor:mobile-alert-dismissed",
                  "true",
                );
                setDismissedMobileAlert(true);
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia className="text-amber-500 bg-amber-50">
                  <TriangleAlert />
                </AlertDialogMedia>
                <AlertDialogTitle>
                  Canvas isn&apos;t optimized for mobile
                </AlertDialogTitle>
                <AlertDialogDescription>
                  The Classic editor offers a better experience on mobile
                  devices — try switching for easier editing and navigation.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Continue Anyway</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    window.location.href = "/editor/classic";
                  }}
                >
                  Switch to Classic
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
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
