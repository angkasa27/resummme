import { beforeEach, describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import {
  RESUME_STORAGE_KEY,
  exportResumeDraft,
  importResumeDraft,
  loadResumeDraft,
  saveResumeDraft,
} from "@/lib/resume/storage";

describe("resume storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves and loads a validated draft", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.fullName = "Dimas Angkasa Nurindra";

    saveResumeDraft(draft);

    expect(window.localStorage.getItem(RESUME_STORAGE_KEY)).toContain(
      "Dimas Angkasa Nurindra"
    );

    const loaded = loadResumeDraft();

    expect(loaded.profile.fullName).toBe("Dimas Angkasa Nurindra");
  });

  it("returns the default draft when storage is empty", () => {
    const loaded = loadResumeDraft();

    expect(loaded.profile.fullName).toBe(createDefaultResumeDraft().profile.fullName);
  });

  it("falls back to the default draft when storage is malformed", () => {
    window.localStorage.setItem(RESUME_STORAGE_KEY, "{");

    const loaded = loadResumeDraft();

    expect(loaded.templateId).toBe("recruiter-first-clean");
  });

  it("exports and re-imports a draft as the same contract", () => {
    const draft = createDefaultResumeDraft();

    const exported = exportResumeDraft(draft);
    const imported = importResumeDraft(exported);

    expect(imported).toEqual(draft);
  });

  it("rejects malformed imported drafts", () => {
    expect(() =>
      importResumeDraft(
        JSON.stringify({
          schemaVersion: 2,
          templateId: "recruiter-first-clean",
          profile: {},
        })
      )
    ).toThrow(/profile/i);
  });
});
