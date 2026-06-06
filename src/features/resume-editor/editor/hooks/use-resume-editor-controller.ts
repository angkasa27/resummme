"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, RefObject } from "react";
import { toast } from "sonner";
import { useStore } from "zustand";

import type { PdfPresentation, Profile, ResumeDraft } from "@/features/resume-editor/domain/schema";
import { createResumePdfFilename } from "@/features/resume-editor/domain/draft/resume-pdf-filename";
import { loadResumeDraft } from "@/features/resume-editor/domain/draft/resume-draft-storage";
import {
  createResumeEditorStore,
  type ResumeEditorPanelKey,
  type ResumeSectionKey,
} from "@/features/resume-editor/state/resume-editor-store";

type UseResumeEditorControllerOptions = {
  initialDraft?: ResumeDraft;
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
  reorderSection: (sectionKey: ResumeSectionKey, targetIndex: number) => void;
  setSectionVisibility: (sectionKey: ResumeSectionKey, visible: boolean) => void;
  savePdfPresentation: (pdfPresentation: PdfPresentation) => void;
  saveProfile: (profile: Profile) => void;
  saveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K]
  ) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export function useResumeEditorController({
  initialDraft,
}: UseResumeEditorControllerOptions = {}): ResumeEditorController {
  const [store] = useState(() =>
    createResumeEditorStore(initialDraft ?? loadResumeDraft())
  );
  const jsonFileInputRef = useRef<HTMLInputElement>(null);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);
  const isExportingPdfRef = useRef(false);
  const isImportingPdfRef = useRef(false);
  const draft = useStore(store, (state) => state.draft);
  const activeSection = useStore(store, (state) => state.activeSection);
  const canUndo = useStore(store, (state) => state.undoStack.length > 0);
  const canRedo = useStore(store, (state) => state.redoStack.length > 0);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isImportingPdf, setIsImportingPdf] = useState(false);

  function openJsonImportPicker() {
    jsonFileInputRef.current?.click();
  }

  function openPdfImportPicker() {
    pdfFileInputRef.current?.click();
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
        error instanceof Error ? error.message : "Unable to import that draft."
      );
    } finally {
      event.target.value = "";
    }
  }

  async function submitPdfFile(file: File) {
    if (isImportingPdfRef.current) return;

    isImportingPdfRef.current = true;
    setIsImportingPdf(true);

    try {
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

      store.getState().replaceDraft(payload.draft);
      const warningCount = payload.warnings?.length ?? 0;
      const successMessage =
        warningCount > 0
          ? `PDF imported with ${warningCount} warning${warningCount === 1 ? "" : "s"}.`
          : "PDF imported.";
      toast.success(successMessage);
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
        { id: loadingId }
      );
    } finally {
      isExportingPdfRef.current = false;
      setIsExportingPdf(false);
    }
  }

  return {
    jsonFileInputRef,
    pdfFileInputRef,
    draft,
    activeSection,
    isExportingPdf,
    isImportingPdf,
    openJsonImportPicker,
    openPdfImportPicker,
    handleJsonImport,
    handlePdfImport,
    submitPdfFile,
    handleExport,
    handlePrint,
    requestSectionChange: (sectionKey) =>
      store.getState().requestSectionChange(sectionKey),
    reorderSection: (sectionKey, targetIndex) =>
      store.getState().reorderSection(sectionKey, targetIndex),
    setSectionVisibility: (sectionKey, visible) =>
      store.getState().setSectionVisibility(sectionKey, visible),
    savePdfPresentation: (pdfPresentation) =>
      store.getState().savePdfPresentation(pdfPresentation),
    saveProfile: (profile) => store.getState().saveProfile(profile),
    saveSection: (sectionKey, sectionValue) =>
      store.getState().saveSection(sectionKey, sectionValue),
    undo: () => {
      const state = store.getState();
      if (state.undoStack.length === 0) return;
      state.undo();
      toast.success("Undone");
    },
    redo: () => {
      const state = store.getState();
      if (state.redoStack.length === 0) return;
      state.redo();
      toast.success("Redone");
    },
    canUndo,
    canRedo,
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
