import { beforeEach, describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { LocalDraftStorage } from "@/features/resume-editor/domain/draft/local-draft-storage";
import {
  RESUME_STORAGE_KEY,
  exportResumeDraft,
  importResumeDraft,
} from "@/features/resume-editor/domain/draft/resume-draft-storage";

describe("LocalDraftStorage", () => {
  let storage: LocalDraftStorage;

  beforeEach(() => {
    window.localStorage.clear();
    storage = new LocalDraftStorage();
  });

  it("saves and loads a validated draft", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.fullName = "Fulan bin Fulan";

    storage.save(draft);

    expect(window.localStorage.getItem(RESUME_STORAGE_KEY)).toContain(
      "Fulan bin Fulan",
    );

    const loaded = storage.load();

    expect(loaded.profile.fullName).toBe("Fulan bin Fulan");
  });

  it("returns the default draft when storage is empty", () => {
    const loaded = storage.load();

    expect(loaded.profile.fullName).toBe(
      createDefaultResumeDraft().profile.fullName,
    );
  });

  it("falls back to the default draft when storage is malformed", () => {
    window.localStorage.setItem(RESUME_STORAGE_KEY, "{");

    const loaded = storage.load();

    expect(loaded.schemaVersion).toBe(3);
    expect(loaded.profile.fullName).toBeTruthy();
  });

  it("exports and re-imports a draft as the same contract", () => {
    const draft = createDefaultResumeDraft();
    draft.pdfPresentation.layoutId = "sidebar";
    draft.pdfPresentation.fontScale = "lg";
    draft.pdfPresentation.lineHeight = "relaxed";
    draft.pdfPresentation.spacing = "airy";
    draft.pdfPresentation.paperSize = "letter";

    const exported = exportResumeDraft(draft);
    const imported = importResumeDraft(exported);

    expect(imported).toEqual(draft);
  });

  it("rejects malformed imported drafts", () => {
    expect(() =>
      importResumeDraft(
        JSON.stringify({
          schemaVersion: 3,
          profile: {},
        }),
      ),
    ).toThrow(/profile/i);
  });

  it("rejects malformed imported field formats", () => {
    const draft = createDefaultResumeDraft();

    expect(() =>
      importResumeDraft(
        JSON.stringify({
          ...draft,
          profile: {
            ...draft.profile,
            email: "not-an-email",
          },
        }),
      ),
    ).toThrow(/email/i);
  });

  it("sanitizes imported rich text content", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.summary.content =
      '<p><a href="javascript:alert(1)" target="_blank">Summary</a></p>';
    draft.sections.projects.items[0].description =
      "<p><img src=x onerror=alert(1)>Project</p>";

    const imported = importResumeDraft(JSON.stringify(draft));

    expect(imported.sections.summary.content).toBe(
      '<p><a target="_blank" rel="noopener noreferrer">Summary</a></p>',
    );
    expect(imported.sections.projects.items[0].description).toBe(
      "<p>Project</p>",
    );
  });
});
