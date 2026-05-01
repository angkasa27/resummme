import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import { createResumeEditorStore } from "@/features/resume-editor/store/editor-store";

describe("resume editor store", () => {
  it("tracks dirty sections without mutating the saved draft", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());
    const previousSummary = store.getState().draft.sections.summary.content;

    store.getState().setSectionDirty("summary", true);

    expect(store.getState().dirtySections).toContain("summary");
    expect(store.getState().draft.sections.summary.content).toBe(previousSummary);
  });

  it("commits a saved section and clears its dirty flag", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().setSectionDirty("summary", true);
    store.getState().saveSection("summary", {
      visible: true,
      order: 0,
      content: "<p>Updated summary</p>",
    });

    expect(store.getState().dirtySections).not.toContain("summary");
    expect(store.getState().draft.sections.summary.content).toBe(
      "<p>Updated summary</p>"
    );
  });

  it("switches sections immediately when the current section is clean", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().requestSectionChange("projects");

    expect(store.getState().activeSection).toBe("projects");
    expect(store.getState().pendingSection).toBeNull();
  });

  it("holds section navigation when the current section is dirty", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().setSectionDirty("summary", true);
    store.getState().requestSectionChange("projects");

    expect(store.getState().activeSection).toBe("summary");
    expect(store.getState().pendingSection).toBe("projects");
    expect(store.getState().warningOpen).toBe(true);
  });

  it("can discard dirty changes and continue to the requested section", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().setSectionDirty("summary", true);
    store.getState().requestSectionChange("projects");
    store.getState().discardPendingSectionChanges();

    expect(store.getState().activeSection).toBe("projects");
    expect(store.getState().dirtySections).not.toContain("summary");
    expect(store.getState().warningOpen).toBe(false);
  });

  it("replaces the draft and resets editor warning state", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());
    const nextDraft = createDefaultResumeDraft();
    nextDraft.profile.fullName = "Another Name";

    store.getState().setSectionDirty("summary", true);
    store.getState().requestSectionChange("projects");
    store.getState().replaceDraft(nextDraft);

    expect(store.getState().draft.profile.fullName).toBe("Another Name");
    expect(store.getState().activeSection).toBe("summary");
    expect(store.getState().dirtySections).toEqual([]);
    expect(store.getState().pendingSection).toBeNull();
    expect(store.getState().warningOpen).toBe(false);
  });

  it("saves profile changes through the same dirty-panel flow", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().setSectionDirty("profile", true);
    store.getState().saveProfile({
      ...store.getState().draft.profile,
      fullName: "Edited Profile Name",
    });

    expect(store.getState().dirtySections).not.toContain("profile");
    expect(store.getState().draft.profile.fullName).toBe("Edited Profile Name");
  });
});
