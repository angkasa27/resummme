import { DraftStorage } from "@/features/resume-editor/domain/draft/draft-storage";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import {
  parseResumeDraft,
  type ResumeDraft,
} from "@/features/resume-editor/domain/schema";

const RESUME_STORAGE_KEY = "resume-editor:draft:v2";

function exportResumeDraft(draft: ResumeDraft): string {
  return JSON.stringify(draft, null, 2);
}

function importResumeDraft(serializedDraft: string): ResumeDraft {
  const parsedJson = JSON.parse(serializedDraft) as unknown;
  return parseResumeDraft(parsedJson);
}

export class LocalDraftStorage implements DraftStorage {
  save(draft: ResumeDraft): ResumeDraft {
    const validatedDraft = parseResumeDraft(draft);

    if (typeof window === "undefined") {
      return validatedDraft;
    }

    try {
      window.localStorage.setItem(
        RESUME_STORAGE_KEY,
        exportResumeDraft(validatedDraft)
      );
    } catch (error) {
      console.warn(
        "Failed to save resume draft to localStorage:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }

    return validatedDraft;
  }

  load(): ResumeDraft {
    if (typeof window === "undefined") {
      return createDefaultResumeDraft();
    }

    const storedDraft = window.localStorage.getItem(RESUME_STORAGE_KEY);

    if (!storedDraft) {
      return createDefaultResumeDraft();
    }

    try {
      return importResumeDraft(storedDraft);
    } catch (error) {
      console.warn(
        "Failed to parse stored resume draft, using default:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return createDefaultResumeDraft();
    }
  }
}
