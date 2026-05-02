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
  type ResumeSectionKey,
} from "@/features/resume-editor/store/editor-store";

type UseResumeEditorControllerOptions = {
  initialDraft?: ResumeDraft;
};

export type ResumeEditorController = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  dirtySections: ResumeEditorPanelKey[];
  pendingSection: ResumeEditorPanelKey | null;
  warningOpen: boolean;
  openImportPicker: () => void;
  handleImport: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleExport: () => void;
  handlePrint: () => void;
  requestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  setSectionDirty: (
    sectionKey: ResumeEditorPanelKey,
    isDirty: boolean
  ) => void;
  discardPendingSectionChanges: () => void;
  cancelPendingSectionChange: () => void;
  saveProfile: (profile: Profile) => void;
  saveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K]
  ) => void;
};

export function useResumeEditorController({
  initialDraft,
}: UseResumeEditorControllerOptions = {}): ResumeEditorController {
  const [store] = useState(() => {
    const nextStore = createResumeEditorStore(
      initialDraft ?? createDefaultResumeDraft()
    );
    nextStore.setState({ activeSection: "profile" });
    return nextStore;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draft = useStore(store, (state) => state.draft);
  const activeSection = useStore(store, (state) => state.activeSection);
  const dirtySections = useStore(store, (state) => state.dirtySections);
  const pendingSection = useStore(store, (state) => state.pendingSection);
  const warningOpen = useStore(store, (state) => state.warningOpen);

  useEffect(() => {
    if (initialDraft) {
      return;
    }

    const storedDraft = loadResumeDraft();

    store.setState((state) => {
      if (exportResumeDraft(state.draft) === exportResumeDraft(storedDraft)) {
        return state;
      }

      return {
        ...state,
        draft: storedDraft,
        dirtySections: [],
        pendingSection: null,
        warningOpen: false,
      };
    });
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

  function ensureImportAllowed() {
    if (dirtySections.length === 0) {
      return true;
    }

    return window.confirm(
      "You have unsaved changes. Importing a resume will replace the current editor state."
    );
  }

  function openImportPicker() {
    fileInputRef.current?.click();
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!ensureImportAllowed()) {
      event.target.value = "";
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
    dirtySections,
    pendingSection,
    warningOpen,
    openImportPicker,
    handleImport,
    handleExport,
    handlePrint,
    requestSectionChange: (sectionKey) =>
      store.getState().requestSectionChange(sectionKey),
    setSectionDirty: (sectionKey, isDirty) =>
      store.getState().setSectionDirty(sectionKey, isDirty),
    discardPendingSectionChanges: () =>
      store.getState().discardPendingSectionChanges(),
    cancelPendingSectionChange: () => store.getState().cancelPendingSectionChange(),
    saveProfile: (profile) => store.getState().saveProfile(profile),
    saveSection: (sectionKey, sectionValue) =>
      store.getState().saveSection(sectionKey, sectionValue),
  };
}
