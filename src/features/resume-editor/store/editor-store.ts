import { createStore } from "zustand/vanilla";

import {
  moveSection,
  reorderSections,
} from "@/features/resume-editor/lib/draft-utils";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import type { Profile, ResumeDraft } from "@/lib/resume/schema";
import { saveResumeDraft } from "@/lib/resume/storage";

export type ResumeSectionKey = keyof ResumeDraft["sections"];
export type ResumeEditorPanelKey = "profile" | ResumeSectionKey;
export type ResumeEditorViewMode = "list" | "form";
export type ResumeEditorPendingIntent =
  | {
      type: "section";
      sectionKey: ResumeEditorPanelKey;
    }
  | {
      type: "list";
    }
  | {
      type: "import";
      draft: ResumeDraft;
    };

export type ResumeEditorStoreState = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  editorViewMode: ResumeEditorViewMode;
  dirtySections: ResumeEditorPanelKey[];
  pendingIntent: ResumeEditorPendingIntent | null;
  confirmExitOpen: boolean;
  setSectionDirty: (sectionKey: ResumeEditorPanelKey, isDirty: boolean) => void;
  saveProfile: (profile: Profile) => void;
  saveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K]
  ) => void;
  moveSection: (sectionKey: ResumeSectionKey, direction: -1 | 1) => void;
  setSectionVisibility: (sectionKey: ResumeSectionKey, visible: boolean) => void;
  requestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  returnToSectionList: () => void;
  requestImportDraft: (draft: ResumeDraft) => void;
  discardPendingChanges: () => void;
  cancelPendingIntent: () => void;
  replaceDraft: (draft: ResumeDraft) => void;
};

function ensureUniqueSectionKeys(sectionKeys: ResumeEditorPanelKey[]) {
  return [...new Set(sectionKeys)];
}

function clearSectionKey(
  sectionKeys: ResumeEditorPanelKey[],
  sectionKey: ResumeEditorPanelKey
) {
  return sectionKeys.filter((key) => key !== sectionKey);
}

function createNextDraft(
  currentDraft: ResumeDraft,
  updates: Partial<ResumeDraft>
): ResumeDraft {
  return {
    ...currentDraft,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

function hasDirtyActiveSection(state: ResumeEditorStoreState) {
  return state.dirtySections.includes(state.activeSection);
}

export function createResumeEditorStore(initialDraft = createDefaultResumeDraft()) {
  return createStore<ResumeEditorStoreState>()((set, get) => ({
    draft: initialDraft,
    activeSection: "profile",
    editorViewMode: "list",
    dirtySections: [],
    pendingIntent: null,
    confirmExitOpen: false,
    setSectionDirty: (sectionKey, isDirty) => {
      const alreadyDirty = get().dirtySections.includes(sectionKey);

      if (alreadyDirty === isDirty) {
        return;
      }

      set((state) => ({
        dirtySections: isDirty
          ? ensureUniqueSectionKeys([...state.dirtySections, sectionKey])
          : clearSectionKey(state.dirtySections, sectionKey),
      }));
    },
    saveProfile: (profile) => {
      const nextDraft = createNextDraft(get().draft, { profile });

      saveResumeDraft(nextDraft);

      set((state) => ({
        draft: nextDraft,
        dirtySections: clearSectionKey(state.dirtySections, "profile"),
      }));
    },
    saveSection: (sectionKey, sectionValue) => {
      const nextDraft = createNextDraft(get().draft, {
        sections: reorderSections(get().draft.sections, sectionKey, sectionValue),
      });

      saveResumeDraft(nextDraft);

      set((state) => ({
        draft: nextDraft,
        dirtySections: clearSectionKey(state.dirtySections, sectionKey),
      }));
    },
    moveSection: (sectionKey, direction) => {
      const nextDraft = createNextDraft(get().draft, {
        sections: moveSection(get().draft.sections, sectionKey, direction),
      });

      saveResumeDraft(nextDraft);

      set({
        draft: nextDraft,
      });
    },
    setSectionVisibility: (sectionKey, visible) => {
      const nextDraft = createNextDraft(get().draft, {
        sections: {
          ...get().draft.sections,
          [sectionKey]: {
            ...get().draft.sections[sectionKey],
            visible,
          },
        },
      });

      saveResumeDraft(nextDraft);

      set({
        draft: nextDraft,
      });
    },
    requestSectionChange: (sectionKey) => {
      const state = get();

      if (state.activeSection === sectionKey && state.editorViewMode === "form") {
        return;
      }

      if (hasDirtyActiveSection(state)) {
        set({
          pendingIntent: {
            type: "section",
            sectionKey,
          },
          confirmExitOpen: true,
        });
        return;
      }

      set({
        activeSection: sectionKey,
        editorViewMode: "form",
        pendingIntent: null,
        confirmExitOpen: false,
      });
    },
    returnToSectionList: () => {
      const state = get();

      if (state.editorViewMode === "list") {
        return;
      }

      if (hasDirtyActiveSection(state)) {
        set({
          pendingIntent: { type: "list" },
          confirmExitOpen: true,
        });
        return;
      }

      set({
        editorViewMode: "list",
        pendingIntent: null,
        confirmExitOpen: false,
      });
    },
    requestImportDraft: (draft) => {
      const state = get();

      if (hasDirtyActiveSection(state)) {
        set({
          pendingIntent: {
            type: "import",
            draft,
          },
          confirmExitOpen: true,
        });
        return;
      }

      saveResumeDraft(draft);
      set({
        draft,
        activeSection: "profile",
        editorViewMode: "list",
        dirtySections: [],
        pendingIntent: null,
        confirmExitOpen: false,
      });
    },
    discardPendingChanges: () => {
      const state = get();

      if (!state.pendingIntent) {
        return;
      }

      if (state.pendingIntent.type === "list") {
        set({
          editorViewMode: "list",
          dirtySections: clearSectionKey(state.dirtySections, state.activeSection),
          pendingIntent: null,
          confirmExitOpen: false,
        });
        return;
      }

      if (state.pendingIntent.type === "section") {
        set({
          activeSection: state.pendingIntent.sectionKey,
          editorViewMode: "form",
          dirtySections: clearSectionKey(state.dirtySections, state.activeSection),
          pendingIntent: null,
          confirmExitOpen: false,
        });
        return;
      }

      saveResumeDraft(state.pendingIntent.draft);
      set({
        draft: state.pendingIntent.draft,
        activeSection: "profile",
        editorViewMode: "list",
        dirtySections: [],
        pendingIntent: null,
        confirmExitOpen: false,
      });
    },
    cancelPendingIntent: () => {
      set({
        pendingIntent: null,
        confirmExitOpen: false,
      });
    },
    replaceDraft: (draft) => {
      saveResumeDraft(draft);
      set({
        draft,
        activeSection: "profile",
        editorViewMode: "list",
        dirtySections: [],
        pendingIntent: null,
        confirmExitOpen: false,
      });
    },
  }));
}
