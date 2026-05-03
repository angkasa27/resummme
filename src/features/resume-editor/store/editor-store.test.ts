import { describe, expect, it } from "vitest";

import { createResumeEditorStore } from "@/features/resume-editor/store/editor-store";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";

describe("resume editor store", () => {
  it("returns to the section list without clearing the active section", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().requestSectionChange("projects");
    expect(store.getState().activeSection).toBe("projects");
    expect(store.getState().editorViewMode).toBe("form");

    store.getState().returnToSectionList();

    expect(store.getState().activeSection).toBe("projects");
    expect(store.getState().editorViewMode).toBe("list");
  });
});
