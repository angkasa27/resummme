import { beforeEach, describe, expect, it, vi } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { LocalDraftStorage } from "@/features/resume-editor/domain/draft/local-draft-storage";
import type { SaveStatus } from "@/features/resume-editor/domain/draft/draft-storage";
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

  it("falls back to the default draft and reports an error status when storage is malformed", () => {
    window.localStorage.setItem(RESUME_STORAGE_KEY, "{");

    const loaded = storage.load();

    expect(loaded.schemaVersion).toBe(3);
    expect(loaded.profile.fullName).toBeTruthy();
    expect(storage.getSaveStatus()).toBe("error");
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

  it("stores lenient field formats — a malformed email/URL is persisted, not rejected", () => {
    const draft = createDefaultResumeDraft();

    const imported = importResumeDraft(
      JSON.stringify({
        ...draft,
        profile: { ...draft.profile, email: "not-an-email" },
      }),
    );

    // Format validation is advisory (form-only); persistence keeps the raw value.
    expect(imported.profile.email).toBe("not-an-email");
  });

  it("reports a saved status on a successful write", () => {
    expect(storage.getSaveStatus()).toBe("idle");
    storage.save(createDefaultResumeDraft());
    expect(storage.getSaveStatus()).toBe("saved");
  });

  it("surfaces a write failure as an error status instead of throwing", () => {
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
    const seen: SaveStatus[] = [];
    storage.subscribeSaveStatus((status) => seen.push(status));

    expect(() => storage.save(createDefaultResumeDraft())).not.toThrow();
    expect(storage.getSaveStatus()).toBe("error");
    expect(seen).toContain("error");

    setItem.mockRestore();
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
