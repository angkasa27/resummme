import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import { createResumeEditorStore } from "@/features/resume-editor/store/editor-store";

describe("resume editor store", () => {
  it("starts in section list mode", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    expect(store.getState().editorViewMode).toBe("list");
    expect(store.getState().activeSection).toBe("profile");
  });

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

  it("opens form mode immediately when the current section is clean", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().requestSectionChange("projects");

    expect(store.getState().activeSection).toBe("projects");
    expect(store.getState().editorViewMode).toBe("form");
    expect(store.getState().pendingSection).toBeNull();
  });

  it("holds section navigation when the current section is dirty", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().requestSectionChange("summary");
    store.getState().setSectionDirty("summary", true);
    store.getState().requestSectionChange("projects");

    expect(store.getState().activeSection).toBe("summary");
    expect(store.getState().pendingSection).toBe("projects");
    expect(store.getState().pendingViewMode).toBe("form");
    expect(store.getState().warningOpen).toBe(true);
  });

  it("can discard dirty changes and continue to the requested section", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().requestSectionChange("summary");
    store.getState().setSectionDirty("summary", true);
    store.getState().requestSectionChange("projects");
    store.getState().discardPendingSectionChanges();

    expect(store.getState().activeSection).toBe("projects");
    expect(store.getState().editorViewMode).toBe("form");
    expect(store.getState().dirtySections).not.toContain("summary");
    expect(store.getState().warningOpen).toBe(false);
  });

  it("returns to the section list immediately when the form is clean", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().requestSectionChange("projects");
    store.getState().returnToSectionList();

    expect(store.getState().editorViewMode).toBe("list");
    expect(store.getState().warningOpen).toBe(false);
  });

  it("holds return to the section list when the current form is dirty", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().requestSectionChange("projects");
    store.getState().setSectionDirty("projects", true);
    store.getState().returnToSectionList();

    expect(store.getState().editorViewMode).toBe("form");
    expect(store.getState().pendingSection).toBeNull();
    expect(store.getState().pendingViewMode).toBe("list");
    expect(store.getState().warningOpen).toBe(true);
  });

  it("can discard dirty changes and return to the section list", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().requestSectionChange("projects");
    store.getState().setSectionDirty("projects", true);
    store.getState().returnToSectionList();
    store.getState().discardPendingSectionChanges();

    expect(store.getState().editorViewMode).toBe("list");
    expect(store.getState().dirtySections).not.toContain("projects");
    expect(store.getState().warningOpen).toBe(false);
  });

  it("replaces the draft and resets editor warning state", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());
    const nextDraft = createDefaultResumeDraft();
    nextDraft.profile.fullName = "Another Name";

    store.getState().requestSectionChange("summary");
    store.getState().setSectionDirty("summary", true);
    store.getState().requestSectionChange("projects");
    store.getState().replaceDraft(nextDraft);

    expect(store.getState().draft.profile.fullName).toBe("Another Name");
    expect(store.getState().activeSection).toBe("profile");
    expect(store.getState().editorViewMode).toBe("list");
    expect(store.getState().dirtySections).toEqual([]);
    expect(store.getState().pendingSection).toBeNull();
    expect(store.getState().pendingViewMode).toBeNull();
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

  it("moves section order immediately without requiring section save", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().moveSection("projects", -1);

    expect(store.getState().draft.sections.projects.order).toBe(2);
    expect(store.getState().draft.sections.skills.order).toBe(3);
  });

  it("toggles section visibility immediately without touching dirty content", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().setSectionDirty("projects", true);
    store.getState().setSectionVisibility("projects", false);

    expect(store.getState().draft.sections.projects.visible).toBe(false);
    expect(store.getState().dirtySections).toContain("projects");
  });
});
