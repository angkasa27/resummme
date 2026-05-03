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
  type ResumeEditorPendingIntent,
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
  dirtySections: ResumeEditorPanelKey[];
  pendingIntent: ResumeEditorPendingIntent | null;
  confirmExitOpen: boolean;
  openImportPicker: () => void;
  handleImport: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleExport: () => void;
  handlePrint: () => void;
  requestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  returnToSectionList: () => void;
  moveSection: (sectionKey: ResumeSectionKey, direction: -1 | 1) => void;
  setSectionVisibility: (sectionKey: ResumeSectionKey, visible: boolean) => void;
  setSectionDirty: (sectionKey: ResumeEditorPanelKey, isDirty: boolean) => void;
  discardPendingChanges: () => void;
  cancelPendingIntent: () => void;
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
  const dirtySections = useStore(store, (state) => state.dirtySections);
  const pendingIntent = useStore(store, (state) => state.pendingIntent);
  const confirmExitOpen = useStore(store, (state) => state.confirmExitOpen);

  useEffect(() => {
    if (initialDraft) {
      return;
    }

    const storedDraft = loadResumeDraft();

    if (exportResumeDraft(store.getState().draft) !== exportResumeDraft(storedDraft)) {
      store.getState().replaceDraft(storedDraft);
    }
  }, [initialDraft, store]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (store.getState().dirtySections.length === 0) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [store]);

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
      const shouldOpenConfirm = dirtySections.length > 0;

      if (shouldOpenConfirm) {
        store.getState().requestImportDraft(importedDraft);
      } else {
        store.getState().replaceDraft(importedDraft);
        toast.success("Draft imported.");
      }
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
    dirtySections,
    pendingIntent,
    confirmExitOpen,
    openImportPicker,
    handleImport,
    handleExport,
    handlePrint,
    requestSectionChange: (sectionKey) =>
      store.getState().requestSectionChange(sectionKey),
    returnToSectionList: () => store.getState().returnToSectionList(),
    moveSection: (sectionKey, direction) =>
      store.getState().moveSection(sectionKey, direction),
    setSectionVisibility: (sectionKey, visible) =>
      store.getState().setSectionVisibility(sectionKey, visible),
    setSectionDirty: (sectionKey, isDirty) =>
      store.getState().setSectionDirty(sectionKey, isDirty),
    discardPendingChanges: () => store.getState().discardPendingChanges(),
    cancelPendingIntent: () => store.getState().cancelPendingIntent(),
    saveProfile: (profile) => store.getState().saveProfile(profile),
    saveSection: (sectionKey, sectionValue) =>
      store.getState().saveSection(sectionKey, sectionValue),
  };
}
