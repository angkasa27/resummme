"use client";

import { Loader, PlusIcon, SlidersHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useClientReady } from "@/hooks/use-client-ready";
import { useIsMobile } from "@/hooks/use-mobile";

import { useResumeEditorController } from "@/features/resume-editor/editor/hooks/use-resume-editor-controller";
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
  getPreviewLayoutDefinition,
  renderLayoutHeader,
} from "@/features/resume-editor/preview/layout-registry";
import { renderSection } from "@/features/resume-editor/preview/sections";
import { SummaryView } from "@/features/resume-editor/preview/sections/summary";
import { normalizePdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { LayoutSlots } from "@/features/resume-editor/preview/types";
import {
  getOrderedVisibleSectionKeys,
  isCollectionSectionKey,
  resumeSectionKeys,
  sectionLabels,
  type CollectionSectionKey,
  type ResumeSectionPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type {
  Profile,
  ResumeDraft,
} from "@/features/resume-editor/domain/schema";

const GITHUB_URL = "https://github.com/angkasa27/resume-editor";

type ResumeEditorCanvasProps = {
  initialDraft?: ResumeDraft;
};

type EditingTarget = "profile" | "summary" | CollectionSectionKey | null;

export function ResumeEditorCanvas({ initialDraft }: ResumeEditorCanvasProps) {
  const isClientReady = useClientReady();
  const {
    jsonFileInputRef,
    pdfFileInputRef,
    draft,
    isExportingPdf,
    isImportingPdf,
    openJsonImportPicker,
    openPdfImportPicker,
    handleJsonImport,
    handlePdfImport,
    handleExport,
    handlePrint,
    saveProfile,
    saveSection,
    savePdfPresentation,
    reorderSection,
    setSectionVisibility,
  } = useResumeEditorController({ initialDraft });

  const [editing, setEditing] = useState<EditingTarget>(null);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [zoom, setZoom] = useState<number>(ZOOM_DEFAULT);
  const isMobile = useIsMobile();
  const profileSnapshotRef = useRef<Profile | null>(null);
  const sectionSnapshotRef = useRef<{
    key: ResumeSectionPanelKey;
    value: ResumeDraft["sections"][ResumeSectionPanelKey];
  } | null>(null);

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
  const layout = getPreviewLayoutDefinition(context.presentation.layoutId);
  const visibleSectionKeys = getOrderedVisibleSectionKeys(draft.sections);

  const hiddenSectionKeys = resumeSectionKeys.filter(
    (key) => !draft.sections[key].visible,
  );

  function startEditingProfile() {
    profileSnapshotRef.current = draft.profile;
    setEditing("profile");
  }
  function cancelEditingProfile() {
    if (profileSnapshotRef.current) {
      saveProfile(profileSnapshotRef.current);
    }
    setEditing(null);
  }

  function startEditingSection<K extends ResumeSectionPanelKey>(key: K) {
    sectionSnapshotRef.current = { key, value: draft.sections[key] };
    setEditing(key);
  }
  function cancelEditingSection() {
    const snap = sectionSnapshotRef.current;
    if (snap) {
      saveSection(snap.key, snap.value);
    }
    setEditing(null);
  }

  function confirmAndHide(key: CollectionSectionKey) {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        `Hide the ${sectionLabels[key]} section? You can add it back from below the resume.`,
      )
    ) {
      return;
    }
    setSectionVisibility(key, false);
    if (editing === key) {
      setEditing(null);
    }
  }

  const controlPanelProps = {
    presentation,
    onPresentationChange: savePdfPresentation,
    onImportJson: openJsonImportPicker,
    onImportPdf: openPdfImportPicker,
    onExport: handleExport,
    onExportPdf: handlePrint,
    isExportingPdf,
    isImportingPdf,
    zoom,
    onZoomChange: setZoom,
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-dvh flex-col bg-muted/40">
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

        {/* Top navbar */}
        <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b bg-background px-3 sm:gap-3 sm:px-4 print:hidden">
          <h1 className="truncate text-sm font-semibold tracking-tight">
            Resume Editor
          </h1>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
            Canvas
          </span>
          <Link
            href="/legacy"
            className="hidden text-xs text-muted-foreground underline-offset-4 hover:underline sm:inline"
          >
            Legacy editor
          </Link>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open project on GitHub"
            className={`${buttonVariants({ variant: "outline", size: "sm" })} ml-auto bg-foreground text-background hover:bg-foreground/80! hover:text-background!`}
          >
            <GithubMarkIcon data-icon="inline-start" />
            <span className="inline">GitHub</span>
          </a>
        </header>

        {/* Body: preview + control panel */}
        <div className="flex flex-1">
          <main className="flex flex-1 justify-center overflow-x-auto px-3 py-6 sm:px-6 sm:py-10">
            <div style={{ zoom }} className="origin-top print:[zoom:1]">
              {(() => {
                const collectionKeys = visibleSectionKeys.filter(
                  isCollectionSectionKey,
                );
                const slots: LayoutSlots = {
                  header: (
                    <CanvasSectionShell
                      ariaLabel="Profile"
                      isEditing={editing === "profile"}
                      onEdit={startEditingProfile}
                    >
                      {renderLayoutHeader(context)}
                    </CanvasSectionShell>
                  ),
                  summary:
                    editing === "summary" || context.summaryContent ? (
                      <CanvasSectionShell
                        ariaLabel="Summary"
                        isEditing={editing === "summary"}
                        onEdit={() => startEditingSection("summary")}
                      >
                        <SummaryView content={context.summaryContent ?? ""} />
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
                          onMoveUp={() =>
                            reorderSection(sectionKey, orderIndex - 1)
                          }
                          onMoveDown={() =>
                            reorderSection(sectionKey, orderIndex + 1)
                          }
                          onDelete={() => confirmAndHide(sectionKey)}
                          canMoveUp={orderIndex > 0}
                          canMoveDown={orderIndex < collectionKeys.length - 1}
                        >
                          {renderable ? (
                            renderSection(renderable)
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
                    className="max-md:w-full! max-md:px-5! max-md:py-6!"
                    editorMode="canvas"
                  >
                    <layout.Component context={context} slots={slots} />

                    {hiddenSectionKeys.length > 0 ? (
                      <div className="pt-6 flex flex-wrap justify-center gap-2 print:hidden border-t border-dashed">
                        {hiddenSectionKeys.map((key) => (
                          <Button
                            key={key}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full"
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
          <aside className="sticky top-12 hidden h-[calc(100dvh-3rem)] w-72 shrink-0 overflow-y-auto border-l bg-background px-4 py-5 lg:flex lg:flex-col print:hidden">
            <CanvasControlPanel {...controlPanelProps} />
          </aside>
        </div>

        {/* Editor surface — bottom drawer on mobile, centered dialog on desktop. */}
        {(() => {
          const handleOpenChange = (open: boolean) => {
            if (open) return;
            if (editing === "profile") cancelEditingProfile();
            else if (editing !== null) cancelEditingSection();
          };

          const formContent =
            editing === "profile" ? (
              <CanvasProfileForm
                draft={draft}
                onSave={saveProfile}
                onCancel={cancelEditingProfile}
                onClose={() => setEditing(null)}
              />
            ) : editing === "summary" ? (
              <CanvasSummaryForm
                draft={draft}
                onSave={(value) => saveSection("summary", value)}
                onCancel={cancelEditingSection}
                onClose={() => setEditing(null)}
              />
            ) : editing !== null && isCollectionSectionKey(editing) ? (
              <CanvasCollectionForm
                draft={draft}
                sectionKey={editing}
                onSave={(value) => saveSection(editing, value as never)}
                onCancel={cancelEditingSection}
                onClose={() => setEditing(null)}
              />
            ) : null;

          if (isMobile) {
            return (
              <Sheet
                open={editing !== null}
                onOpenChange={handleOpenChange}
              >
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
                className="fixed bottom-5 right-5 z-30 size-12 rounded-full shadow-lg lg:hidden print:hidden"
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
            <div className="overflow-y-auto px-4">
              <CanvasControlPanel {...controlPanelProps} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}

function GithubMarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
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
