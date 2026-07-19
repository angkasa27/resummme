"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

import {
  KEYWORD_CATEGORIES,
  matchKeywords,
  type ExtractedKeyword,
  type JobMatchResult,
} from "@/features/resume-editor/domain/insights/match-keywords";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

const STORAGE_KEY = "resume-editor:insights:job-match";
const STORAGE_EVENT = "resume-editor:insights:job-match-changed";

type PersistedJob = {
  jobDescription: string;
  keywords: ExtractedKeyword[];
};

type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string };

function isValidKeyword(kw: ExtractedKeyword): boolean {
  return (
    !!kw &&
    typeof kw.term === "string" &&
    typeof kw.weight === "number" &&
    KEYWORD_CATEGORIES.includes(
      kw.category as (typeof KEYWORD_CATEGORIES)[number],
    )
  );
}

function isPersistedJobShape(parsed: unknown): parsed is PersistedJob {
  return (
    !!parsed &&
    typeof parsed === "object" &&
    typeof (parsed as PersistedJob).jobDescription === "string" &&
    Array.isArray((parsed as PersistedJob).keywords)
  );
}

function readFromStorage(): PersistedJob | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isPersistedJobShape(parsed)) return null;

    return {
      jobDescription: parsed.jobDescription,
      keywords: parsed.keywords.filter(isValidKeyword),
    };
  } catch {
    return null;
  }
}

// Memoise the parsed snapshot so useSyncExternalStore can compare with `===`.
let cachedRaw: string | null = null;
let cachedSnapshot: PersistedJob | null = null;

function getSnapshot(): PersistedJob | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  cachedSnapshot = readFromStorage();
  return cachedSnapshot;
}

function getServerSnapshot(): PersistedJob | null {
  return null;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const onChange = () => callback();
  window.addEventListener("storage", onChange);
  window.addEventListener(STORAGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(STORAGE_EVENT, onChange);
  };
}

function writeToStorage(value: PersistedJob | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    }
    window.dispatchEvent(new Event(STORAGE_EVENT));
  } catch {
    // Ignore storage failures (private mode, quota, etc.).
  }
}

async function requestKeywordMatch(
  jobDescription: string,
): Promise<ExtractedKeyword[]> {
  const response = await fetch("/api/insights/match-keywords", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jobDescription }),
  });
  const payload = (await response.json()) as {
    keywords?: ExtractedKeyword[];
    message?: string;
  };

  if (!response.ok || !payload.keywords) {
    throw new Error(
      payload.message || "Could not analyze the job description.",
    );
  }

  return payload.keywords;
}

export function useJobMatch(draft: ResumeDraft) {
  const persistedJob = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });

  // Re-derive matched/missing/coverage whenever the draft or the persisted JD changes.
  const jobMatch: JobMatchResult | null = useMemo(() => {
    if (!persistedJob) return null;
    return matchKeywords(
      draft,
      persistedJob.jobDescription,
      persistedJob.keywords,
    );
  }, [draft, persistedJob]);

  const analyze = useCallback(async (jobDescription: string) => {
    const trimmed = jobDescription.trim();
    if (!trimmed) return;

    setSubmitState({ status: "loading" });
    try {
      const keywords = await requestKeywordMatch(trimmed);
      writeToStorage({ jobDescription: trimmed, keywords });
      setSubmitState({ status: "idle" });
      toast.success("Job description analyzed.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not analyze the job description.";
      toast.error(message);
      setSubmitState({ status: "error", message });
    }
  }, []);

  const reset = useCallback(() => {
    writeToStorage(null);
    setSubmitState({ status: "idle" });
  }, []);

  return {
    jobMatch,
    jobDescription: persistedJob?.jobDescription ?? "",
    submitState,
    analyze,
    reset,
  };
}
