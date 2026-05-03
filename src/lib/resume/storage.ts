import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import { parseResumeDraft, type ResumeDraft } from "@/lib/resume/schema";

export const RESUME_STORAGE_KEY = "resume-editor:draft:v2";

export function exportResumeDraft(draft: ResumeDraft): string {
  return JSON.stringify(draft, null, 2);
}

export function importResumeDraft(serializedDraft: string): ResumeDraft {
  const parsedJson = JSON.parse(serializedDraft) as unknown;
  return parseResumeDraft(parsedJson);
}

export function saveResumeDraft(draft: ResumeDraft) {
  const validatedDraft = parseResumeDraft(draft);

  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    RESUME_STORAGE_KEY,
    exportResumeDraft(validatedDraft)
  );
}

export function loadResumeDraft(): ResumeDraft {
  if (typeof window === "undefined") {
    return createDefaultResumeDraft();
  }

  const storedDraft = window.localStorage.getItem(RESUME_STORAGE_KEY);

  if (!storedDraft) {
    return createDefaultResumeDraft();
  }

  try {
    return importResumeDraft(storedDraft);
  } catch {
    return createDefaultResumeDraft();
  }
}
