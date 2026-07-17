"use client";

import { Loader } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { toast } from "sonner";
import { useClientReady } from "@/hooks/use-client-ready";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

import { useResumeEditorController } from "@/features/resume-editor/state/use-resume-editor-controller";
import type { EditorControlProps } from "@/features/resume-editor/controls/control-props";
import { ExtractCvDialog } from "@/features/resume-editor/controls/extract-cv-dialog";
import { PdfImportProgress } from "@/features/resume-editor/controls/pdf-import-progress";
import { EditorCanvas } from "@/features/resume-editor/editor/desktop/editor-canvas";
import {
  EditorRail,
  type RailKey,
} from "@/features/resume-editor/editor/desktop/editor-rail";
import { EditorSidebar } from "@/features/resume-editor/editor/desktop/editor-sidebar";
import { ZOOM_DEFAULT } from "@/features/resume-editor/editor/desktop/zoom";
import { useDirection } from "@/features/resume-editor/editor/sections/use-direction";
import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import { normalizePdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import {
  isCollectionSectionKey,
  type EditorPanelKey,
  type ResumeSectionPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeEditorPanelKey } from "@/features/resume-editor/state/resume-editor-store";
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
    autoSortSection,
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
    onExportPdf: handlePrint,
    isExportingPdf,
  });

  const [rail, setRail] = useState<RailKey>("edit");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState<ResumeEditorPanelKey | null>(
    null,
  );
  const [isExtractCvOpen, setIsExtractCvOpen] = useState(false);
  const [zoom, setZoom] = useState<number>(ZOOM_DEFAULT);
  // +1 = drilling into a form, -1 = back to the list.
  const nav = useDirection();

  useKeyboardShortcuts({
    "mod+z": undo,
    "mod+shift+z": redo,
    "mod+s": {
      handler: () => toast.success("Auto-saved"),
      ignoreInputFocus: false,
    },
    escape: { handler: closeCurrentSurface, ignoreInputFocus: true },
  });

  const presentation = useMemo(
    () => normalizePdfPresentation(draft.pdfPresentation),
    [draft.pdfPresentation],
  );

  function selectRail(key: RailKey) {
    // Re-picking the open panel toggles the sidebar shut, so the rail doubles
    // as the collapse control.
    if (key === rail && !isSidebarCollapsed) {
      setIsSidebarCollapsed(true);
      return;
    }
    setRail(key);
    setIsSidebarCollapsed(false);
  }

  function backToList() {
    nav.backward();
    setOpenSection(null);
  }

  /** Escape backs out one level: form → list → collapsed sidebar. */
  function closeCurrentSurface() {
    if (openSection) {
      backToList();
      return;
    }
    setIsSidebarCollapsed(true);
  }

  /**
   * The single way a section gets opened — from a click on the paper, from the
   * sidebar list, or from an Insights suggestion. Hidden sections are brought
   * back first, otherwise the form would edit something the paper can't show.
   */
  function focusSection(panel: EditorPanelKey) {
    if (
      panel !== "profile" &&
      isCollectionSectionKey(panel as ResumeSectionPanelKey) &&
      !draft.sections[panel].visible
    ) {
      setSectionVisibility(panel, true);
    }
    nav.forward();
    setRail("edit");
    setIsSidebarCollapsed(false);
    setOpenSection(panel);
  }

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

  const controls: EditorControlProps = {
    presentation,
    draft,
    onPresentationChange: savePdfPresentation,
    onImportJson: openJsonImportPicker,
    onExtractCv: () => setIsExtractCvOpen(true),
    onExport: handleExport,
    onExportPdf: handlePrint,
    onOpenSection: focusSection,
    isExportingPdf,
    isImportingPdf,
  };

  return (
    <div className="flex h-[calc(100dvh-3rem)]">
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

      <EditorRail
        value={rail}
        collapsed={isSidebarCollapsed}
        onSelect={selectRail}
      />

      {!isSidebarCollapsed ? (
        <EditorSidebar
          rail={rail}
          draft={draft}
          controls={controls}
          openSection={openSection}
          direction={nav.direction}
          onSaveProfile={saveProfile}
          onSaveSection={saveSection}
          onReorderSection={reorderSection}
          onSetSectionVisibility={setSectionVisibility}
          onAutoSortSection={autoSortSection}
          onOpenSection={focusSection}
          onBack={backToList}
        />
      ) : null}

      <EditorCanvas zoom={zoom} onZoomChange={setZoom}>
        <ResumeDocument
          draft={draft}
          onSelectSection={focusSection}
          activeSection={openSection}
        />
      </EditorCanvas>
    </div>
  );
}
