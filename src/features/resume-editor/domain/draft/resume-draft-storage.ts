import {
  parseResumeDraft,
  type ResumeDraft,
} from "@/features/resume-editor/domain/schema";

export const RESUME_STORAGE_KEY = "resume-editor:draft:v2";

export function exportResumeDraft(draft: ResumeDraft): string {
  return JSON.stringify(draft, null, 2);
}

export function importResumeDraft(serializedDraft: string): ResumeDraft {
  const parsedJson = JSON.parse(serializedDraft) as unknown;
  return parseResumeDraft(parsedJson);
}


