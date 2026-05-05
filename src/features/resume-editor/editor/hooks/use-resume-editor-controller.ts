"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, RefObject } from "react";
import { toast } from "sonner";
import { useStore } from "zustand";

import type { PdfPresentation, Profile, ResumeDraft } from "@/features/resume-editor/domain/schema";
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
  fileInputRef: RefObject<HTMLInputElement | null>;
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  openImportPicker: () => void;
  handleImport: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
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
};

export function useResumeEditorController({
  initialDraft,
}: UseResumeEditorControllerOptions = {}): ResumeEditorController {
  const [store] = useState(() =>
    createResumeEditorStore(initialDraft ?? loadResumeDraft())
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draft = useStore(store, (state) => state.draft);
  const activeSection = useStore(store, (state) => state.activeSection);

  function openImportPicker() {
    fileInputRef.current?.click();
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
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
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF exported.", { id: loadingId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to generate the PDF.",
        { id: loadingId }
      );
    }
  }

  return {
    fileInputRef,
    draft,
    activeSection,
    openImportPicker,
    handleImport,
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
  };
}