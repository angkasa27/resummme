import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useResumeEditorController } from "@/features/resume-editor/state/use-resume-editor-controller";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import type {
  DraftStorage,
  SaveStatus,
} from "@/features/resume-editor/domain/draft/draft-storage";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

function createStatusStorage() {
  let status: SaveStatus = "idle";
  const listeners = new Set<(status: SaveStatus) => void>();
  const draft = createDefaultResumeDraft();

  const storage: DraftStorage = {
    load: () => structuredClone(draft),
    save: vi.fn((next: ResumeDraft) => next),
    getSaveStatus: () => status,
    subscribeSaveStatus: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  return {
    storage,
    setStatus(next: SaveStatus) {
      status = next;
      listeners.forEach((listener) => listener(next));
    },
  };
}

describe("useResumeEditorController", () => {
  // Why: the SaaS fork injects a DB-backed storage and relies on the editor
  // surfacing its async progress. If saveStatus stopped tracking the injected
  // storage, the fork's save indicator would silently go dead.
  it("surfaces the injected storage's save status", () => {
    const { storage, setStatus } = createStatusStorage();
    const { result } = renderHook(() => useResumeEditorController({ storage }));

    expect(result.current.saveStatus).toBe("idle");

    act(() => setStatus("saving"));
    expect(result.current.saveStatus).toBe("saving");

    act(() => setStatus("saved"));
    expect(result.current.saveStatus).toBe("saved");
  });

  // Why: injecting persistence is the whole seam — saves must flow to the
  // provided module, not a hardcoded default.
  it("persists edits through the injected storage", () => {
    const { storage } = createStatusStorage();
    const { result } = renderHook(() => useResumeEditorController({ storage }));

    act(() => {
      result.current.saveProfile({
        ...result.current.draft.profile,
        fullName: "Injected Storage",
      });
    });

    expect(storage.save).toHaveBeenCalledTimes(1);
    expect(result.current.draft.profile.fullName).toBe("Injected Storage");
  });

  // Why: the default (local) path is synchronous and must not render a stray
  // "saving"/"saved" indicator.
  it("reports idle status when storage does not track saves", () => {
    const { result } = renderHook(() =>
      useResumeEditorController({ initialDraft: createDefaultResumeDraft() })
    );

    expect(result.current.saveStatus).toBe("idle");
  });
});
