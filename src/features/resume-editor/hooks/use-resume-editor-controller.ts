"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from "react";
import { toast } from "sonner";
import { useStore } from "zustand";

import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import type { Profile, ResumeDraft } from "@/lib/resume/schema";
import {
  exportResumeDraft,
  importResumeDraft,
  loadResumeDraft,
} from "@/lib/resume/storage";
import {
  createResumeEditorStore,
  type ResumeEditorPanelKey,
  type ResumeEditorViewMode,
  type ResumeSectionKey,
} from "@/features/resume-editor/store/editor-store";

type UseResumeEditorControllerOptions = {
  initialDraft?: ResumeDraft;
};

export type ResumeEditorController = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  editorViewMode: ResumeEditorViewMode;
  openImportPicker: () => void;
  handleImport: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleExport: () => void;
  handlePrint: () => void;
  requestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  returnToSectionList: () => void;
  moveSection: (sectionKey: ResumeSectionKey, direction: -1 | 1) => void;
  reorderSection: (sectionKey: ResumeSectionKey, targetIndex: number) => void;
  setSectionVisibility: (sectionKey: ResumeSectionKey, visible: boolean) => void;
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
    createResumeEditorStore(initialDraft ?? createDefaultResumeDraft())
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draft = useStore(store, (state) => state.draft);
  const activeSection = useStore(store, (state) => state.activeSection);
  const editorViewMode = useStore(store, (state) => state.editorViewMode);

  useEffect(() => {
    if (initialDraft) {
      return;
    }

    const storedDraft = loadResumeDraft();

    if (exportResumeDraft(store.getState().draft) !== exportResumeDraft(storedDraft)) {
      store.getState().replaceDraft(storedDraft);
    }
  }, [initialDraft, store]);

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
      const importedDraft = importResumeDraft(fileContents);
      
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
    const serializedDraft = exportResumeDraft(draft);
    const draftBlob = new Blob([serializedDraft], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(draftBlob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = "resume-draft.json";
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
    toast.success("Draft exported.");
  }

  function handlePrint() {
    window.print();
  }

  return {
    fileInputRef,
    draft,
    activeSection,
    editorViewMode,
    openImportPicker,
    handleImport,
    handleExport,
    handlePrint,
    requestSectionChange: (sectionKey) =>
      store.getState().requestSectionChange(sectionKey),
    returnToSectionList: () => store.getState().returnToSectionList(),
    moveSection: (sectionKey, direction) =>
      store.getState().moveSection(sectionKey, direction),
    reorderSection: (sectionKey, targetIndex) =>
      store.getState().reorderSection(sectionKey, targetIndex),
    setSectionVisibility: (sectionKey, visible) =>
      store.getState().setSectionVisibility(sectionKey, visible),
    saveProfile: (profile) => store.getState().saveProfile(profile),
    saveSection: (sectionKey, sectionValue) =>
      store.getState().saveSection(sectionKey, sectionValue),
  };
}
