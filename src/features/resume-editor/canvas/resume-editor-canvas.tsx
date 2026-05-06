"use client";

import { Loader, PlusIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useClientReady } from "@/hooks/use-client-ready";

import { useResumeEditorController } from "@/features/resume-editor/editor/hooks/use-resume-editor-controller";
import { ResumeEditorShellActions } from "@/features/resume-editor/editor/shell/resume-editor-shell-actions";
import { CanvasSectionShell } from "@/features/resume-editor/canvas/canvas-section-shell";
import { CanvasCollectionForm } from "@/features/resume-editor/canvas/forms/canvas-collection-form";
import { CanvasProfileForm } from "@/features/resume-editor/canvas/forms/canvas-profile-form";
import { CanvasSummaryForm } from "@/features/resume-editor/canvas/forms/canvas-summary-form";
import { PreviewToolbarContent } from "@/features/resume-editor/preview/components/preview-toolbar-content";
import { createPreviewRenderContext } from "@/features/resume-editor/preview/engine";
import { PreviewDocumentRoot } from "@/features/resume-editor/preview/kit/document-root";
import { getPreviewLayoutDefinition } from "@/features/resume-editor/preview/layout-registry";
import { getPreviewProfileLayoutDefinition } from "@/features/resume-editor/preview/profile-layout-registry";
import { normalizePdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
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

type ResumeEditorCanvasProps = {
  initialDraft?: ResumeDraft;
};

type EditingTarget = "profile" | "summary" | CollectionSectionKey | null;

export function ResumeEditorCanvas({ initialDraft }: ResumeEditorCanvasProps) {
  const isClientReady = useClientReady();
  const {
    fileInputRef,
    draft,
    openImportPicker,
    handleImport,
    handleExport,
    handlePrint,
    saveProfile,
    saveSection,
    savePdfPresentation,
    reorderSection,
    setSectionVisibility,
  } = useResumeEditorController({ initialDraft });

  const [editing, setEditing] = useState<EditingTarget>(null);
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
  const itemRenderers = layout.createSectionItemRenderers(context);
  const visibleSectionKeys = getOrderedVisibleSectionKeys(draft.sections);
  const profileLayout = getPreviewProfileLayoutDefinition(
    context.presentation.profileLayoutId,
  );
  const ProfileHeader = profileLayout.Header;

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

  return (
    <TooltipProvider>
      <div className="flex min-h-dvh flex-col bg-muted/40">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleImport}
        />

        <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-3 border-b bg-background px-4 print:hidden">
          <h1 className="truncate text-sm font-semibold tracking-tight">
            Resume Editor
          </h1>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
            Canvas
          </span>
          <Link
            href="/legacy"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Legacy editor
          </Link>

          <div className="ml-auto flex items-center gap-1.5">
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label="Style settings"
                  >
                    <SettingsIcon data-icon="inline-start" />
                    Style
                  </Button>
                }
              />
              <PopoverContent align="end" className="w-80">
                <PreviewToolbarContent
                  presentation={presentation}
                  onChange={savePdfPresentation}
                />
              </PopoverContent>
            </Popover>
            <ResumeEditorShellActions
              onImport={openImportPicker}
              onExport={handleExport}
              onExportPdf={handlePrint}
            />
          </div>
        </header>

        <main className="flex flex-1 justify-center overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10">
          <div className="w-full max-w-[920px]">
            <PreviewDocumentRoot context={context}>
              {/* Profile / header */}
              <CanvasSectionShell
                ariaLabel="Profile"
                isEditing={editing === "profile"}
                onEdit={startEditingProfile}
              >
                {editing === "profile" ? (
                  <CanvasProfileForm
                    draft={draft}
                    onSave={saveProfile}
                    onCancel={cancelEditingProfile}
                    onClose={() => setEditing(null)}
                  />
                ) : (
                  <ProfileHeader context={context} />
                )}
              </CanvasSectionShell>

              {/* Summary */}
              {editing === "summary" || context.summaryContent ? (
                <CanvasSectionShell
                  ariaLabel="Summary"
                  isEditing={editing === "summary"}
                  onEdit={() => startEditingSection("summary")}
                >
                  {editing === "summary" ? (
                    <CanvasSummaryForm
                      draft={draft}
                      onSave={(value) => saveSection("summary", value)}
                      onCancel={cancelEditingSection}
                      onClose={() => setEditing(null)}
                    />
                  ) : (
                    layout.Summary({
                      context,
                      content: context.summaryContent ?? "",
                    })
                  )}
                </CanvasSectionShell>
              ) : null}

              {/* Collection sections */}
              {visibleSectionKeys
                .filter(isCollectionSectionKey)
                .map((sectionKey) => {
                  const orderIndex = visibleSectionKeys.indexOf(sectionKey);
                  const renderable = context.sections.find(
                    (s) => s.key === sectionKey,
                  );
                  const isEditing = editing === sectionKey;

                  return (
                    <CanvasSectionShell
                      key={sectionKey}
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
                      canMoveDown={orderIndex < visibleSectionKeys.length - 1}
                    >
                      {isEditing ? (
                        <CanvasCollectionForm
                          draft={draft}
                          sectionKey={sectionKey}
                          onSave={(value) =>
                            saveSection(sectionKey, value as never)
                          }
                          onCancel={cancelEditingSection}
                          onClose={() => setEditing(null)}
                        />
                      ) : renderable ? (
                        layout.CollectionSection({
                          context,
                          section: renderable,
                          itemRenderers,
                        })
                      ) : (
                        <EmptySectionPlaceholder
                          label={sectionLabels[sectionKey]}
                          onEdit={() => startEditingSection(sectionKey)}
                        />
                      )}
                    </CanvasSectionShell>
                  );
                })}

              {/* Add-section pills */}
              {hiddenSectionKeys.length > 0 ? (
                <div className="mt-6 flex flex-wrap justify-center gap-2 print:hidden">
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
          </div>
        </main>
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
