import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

export interface DraftStorage {
  load(): ResumeDraft;
  save(draft: ResumeDraft): ResumeDraft;
}
