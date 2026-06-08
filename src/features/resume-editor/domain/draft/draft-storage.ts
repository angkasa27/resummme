import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface DraftStorage {
  load(): ResumeDraft;
  save(draft: ResumeDraft): ResumeDraft;
  /**
   * Optional async-persistence status channel. Synchronous storages (e.g.
   * {@link LocalDraftStorage}) omit these — the editor then treats saving as
   * instantaneous. A DB-backed storage (in the SaaS fork) does its optimistic
   * update in `save()`, schedules its own debounced network write, and reports
   * progress here so the editor header can show a save indicator.
   */
  getSaveStatus?(): SaveStatus;
  subscribeSaveStatus?(listener: (status: SaveStatus) => void): () => void;
}
