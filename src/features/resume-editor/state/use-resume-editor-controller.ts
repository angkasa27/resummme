"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import type { ChangeEvent, RefObject } from "react";
import { toast } from "sonner";
import { useStore } from "zustand";

import type {
  PdfPresentation,
  Profile,
  ResumeDraft,
} from "@/features/resume-editor/domain/schema";
import { createResumePdfFilename } from "@/features/resume-editor/domain/draft/resume-pdf-filename";
import type {
  DraftStorage,
  SaveStatus,
} from "@/features/resume-editor/domain/draft/draft-storage";
import { LocalDraftStorage } from "@/features/resume-editor/domain/draft/local-draft-storage";
import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import {
  createResumeEditorStore,
  type ResumeEditorPanelKey,
  type ResumeSectionKey,
} from "@/features/resume-editor/state/resume-editor-store";

type ResumeEditorStore = ReturnType<typeof createResumeEditorStore>;

type UseResumeEditorControllerOptions = {
  initialDraft?: ResumeDraft;
  /**
   * Persistence module ("batteries"). Defaults to {@link LocalDraftStorage}.
   * The SaaS fork injects a DB-backed implementation here. Must be a stable
   * reference — it is captured once on mount.
   */
  storage?: DraftStorage;
};

export type ResumeEditorController = {
  jsonFileInputRef: RefObject<HTMLInputElement | null>;
  pdfFileInputRef: RefObject<HTMLInputElement | null>;
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  isExportingPdf: boolean;
  isImportingPdf: boolean;
  openJsonImportPicker: () => void;
  openPdfImportPicker: () => void;
  handleJsonImport: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handlePdfImport: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  submitPdfFile: (file: File) => Promise<void>;
  handleExport: () => void;
  handlePrint: () => Promise<void>;
  requestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  reorderSection: (
    sectionKey: ResumeSectionKey,
    anchorKey: ResumeSectionKey,
  ) => void;
  setSectionVisibility: (
    sectionKey: ResumeSectionKey,
    visible: boolean,
  ) => void;
  autoSortSection: (sectionKey: CollectionSectionKey) => void;
  savePdfPresentation: (pdfPresentation: PdfPresentation) => void;
  saveProfile: (profile: Profile) => void;
  saveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K],
  ) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveStatus: SaveStatus;
  /** Generation counter for external draft replacements (import/undo/redo). */
  revision: number;
};

function useJsonImport(store: ResumeEditorStore) {
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  function openJsonImportPicker() {
    jsonFileInputRef.current?.click();
  }

  async function handleJsonImport(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    try {
      const fileContents = await selectedFile.text();
      const importedDraft = JSON.parse(fileContents);

      store.getState().replaceDraft(importedDraft);
      toast.success("Draft imported.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to import that draft.",
      );
    } finally {
      event.target.value = "";
    }
  }

  return { jsonFileInputRef, openJsonImportPicker, handleJsonImport };
}

/** Posts the PDF to the import endpoint and returns the parsed draft, throwing
 *  with the server's message (or a fallback) on any failure. */
async function importPdfDraft(
  file: File,
): Promise<{ draft: ResumeDraft; warningCount: number }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/import-pdf", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json()) as {
    draft?: ResumeDraft;
    warnings?: string[];
    message?: string;
  };

  if (!response.ok || !payload.draft) {
    throw new Error(payload.message || "Unable to import that PDF.");
  }

  return { draft: payload.draft, warningCount: payload.warnings?.length ?? 0 };
}

function usePdfImport(store: ResumeEditorStore) {
  const pdfFileInputRef = useRef<HTMLInputElement>(null);
  const isImportingPdfRef = useRef(false);
  const [isImportingPdf, setIsImportingPdf] = useState(false);

  function openPdfImportPicker() {
    pdfFileInputRef.current?.click();
  }

  async function submitPdfFile(file: File) {
    if (isImportingPdfRef.current) return;

    isImportingPdfRef.current = true;
    setIsImportingPdf(true);

    try {
      const { draft, warningCount } = await importPdfDraft(file);
      store.getState().replaceDraft(draft);
      toast.success(
        warningCount > 0
          ? `PDF imported with ${warningCount} warning${warningCount === 1 ? "" : "s"}.`
          : "PDF imported.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to import that PDF.",
      );
    } finally {
      isImportingPdfRef.current = false;
      setIsImportingPdf(false);
    }
  }

  async function handlePdfImport(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    try {
      await submitPdfFile(selectedFile);
    } finally {
      event.target.value = "";
    }
  }

  return {
    pdfFileInputRef,
    isImportingPdf,
    openPdfImportPicker,
    submitPdfFile,
    handlePdfImport,
  };
}

function useDraftExport(draft: ResumeDraft) {
  const isExportingPdfRef = useRef(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  function handleExport() {
    const serialized = JSON.stringify(draft, null, 2);
    const blob = new Blob([serialized], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-draft.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Draft exported.");
  }

  async function handlePrint() {
    if (isExportingPdfRef.current) {
      return;
    }

    isExportingPdfRef.current = true;
    setIsExportingPdf(true);
    const loadingId = toast.loading("Generating PDF...");

    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ draft }),
      });

      if (!response.ok) {
        let msg = "Unable to generate the PDF.";
        try {
          const p = (await response.json()) as { message?: string };
          if (p.message) msg = p.message;
        } catch {}
        throw new Error(msg);
      }

      const pdfBlob = await response.blob();
      const contentDisposition = response.headers.get("content-disposition");
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getDownloadFilename(contentDisposition, draft);
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF exported.", { id: loadingId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to generate the PDF.",
        { id: loadingId },
      );
    } finally {
      isExportingPdfRef.current = false;
      setIsExportingPdf(false);
    }
  }

  return { isExportingPdf, handleExport, handlePrint };
}

function useUndoRedo(store: ResumeEditorStore) {
  const canUndo = useStore(store, (state) => state.undoStack.length > 0);
  const canRedo = useStore(store, (state) => state.redoStack.length > 0);

  const undo = useCallback(() => {
    const state = store.getState();
    if (state.undoStack.length === 0) return;
    state.undo();
    toast.success("Undone");
  }, [store]);
  const redo = useCallback(() => {
    const state = store.getState();
    if (state.redoStack.length === 0) return;
    state.redo();
    toast.success("Redone");
  }, [store]);

  return { canUndo, canRedo, undo, redo };
}

export function useResumeEditorController({
  initialDraft,
  storage: providedStorage,
}: UseResumeEditorControllerOptions = {}): ResumeEditorController {
  const [storage] = useState<DraftStorage>(
    () => providedStorage ?? new LocalDraftStorage(),
  );
  const [store] = useState(() =>
    createResumeEditorStore({ storage, initialDraft }),
  );

  const subscribeSaveStatus = useCallback(
    (onChange: () => void) =>
      storage.subscribeSaveStatus?.(() => onChange()) ?? (() => {}),
    [storage],
  );
  const getSaveStatus = useCallback(
    (): SaveStatus => storage.getSaveStatus?.() ?? "idle",
    [storage],
  );
  const saveStatus = useSyncExternalStore(
    subscribeSaveStatus,
    getSaveStatus,
    () => "idle" as SaveStatus,
  );

  const draft = useStore(store, (state) => state.draft);
  const activeSection = useStore(store, (state) => state.activeSection);
  const revision = useStore(store, (state) => state.revision);

  const jsonImport = useJsonImport(store);
  const pdfImport = usePdfImport(store);
  const draftExport = useDraftExport(draft);
  const undoRedo = useUndoRedo(store);

  // Stable passthrough identities (store is a stable ref) so consumers'
  // memoization — and the autosave debounce deps — don't churn every render.
  const requestSectionChange = useCallback(
    (sectionKey: ResumeEditorPanelKey) =>
      store.getState().requestSectionChange(sectionKey),
    [store],
  );
  const reorderSection = useCallback(
    (sectionKey: ResumeSectionKey, anchorKey: ResumeSectionKey) =>
      store.getState().reorderSection(sectionKey, anchorKey),
    [store],
  );
  const setSectionVisibility = useCallback(
    (sectionKey: ResumeSectionKey, visible: boolean) =>
      store.getState().setSectionVisibility(sectionKey, visible),
    [store],
  );
  const autoSortSection = useCallback(
    (sectionKey: CollectionSectionKey) =>
      store.getState().autoSortSection(sectionKey),
    [store],
  );
  const savePdfPresentation = useCallback(
    (pdfPresentation: PdfPresentation) =>
      store.getState().savePdfPresentation(pdfPresentation),
    [store],
  );
  const saveProfile = useCallback(
    (profile: Profile) => store.getState().saveProfile(profile),
    [store],
  );
  const saveSection = useCallback(
    <K extends ResumeSectionKey>(
      sectionKey: K,
      sectionValue: ResumeDraft["sections"][K],
    ) => store.getState().saveSection(sectionKey, sectionValue),
    [store],
  );

  return {
    jsonFileInputRef: jsonImport.jsonFileInputRef,
    pdfFileInputRef: pdfImport.pdfFileInputRef,
    draft,
    activeSection,
    isExportingPdf: draftExport.isExportingPdf,
    isImportingPdf: pdfImport.isImportingPdf,
    openJsonImportPicker: jsonImport.openJsonImportPicker,
    openPdfImportPicker: pdfImport.openPdfImportPicker,
    handleJsonImport: jsonImport.handleJsonImport,
    handlePdfImport: pdfImport.handlePdfImport,
    submitPdfFile: pdfImport.submitPdfFile,
    handleExport: draftExport.handleExport,
    handlePrint: draftExport.handlePrint,
    requestSectionChange,
    reorderSection,
    setSectionVisibility,
    autoSortSection,
    savePdfPresentation,
    saveProfile,
    saveSection,
    undo: undoRedo.undo,
    redo: undoRedo.redo,
    canUndo: undoRedo.canUndo,
    canRedo: undoRedo.canRedo,
    saveStatus,
    revision,
  };
}

function getDownloadFilename(
  contentDisposition: string | null,
  draft: ResumeDraft,
) {
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="([^"]+)"/i);

    if (match?.[1]) {
      return match[1];
    }
  }

  return createResumePdfFilename(draft);
}
