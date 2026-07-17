"use client";

import { useCallback, useState } from "react";

export const SIDEBAR_WIDTH = { min: 360, max: 640, default: 432 } as const;

const STORAGE_KEY = "resume-editor:sidebar-width";

export function clampSidebarWidth(value: number) {
  return Math.min(SIDEBAR_WIDTH.max, Math.max(SIDEBAR_WIDTH.min, value));
}

function readStoredWidth() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SIDEBAR_WIDTH.default;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed)
      ? clampSidebarWidth(parsed)
      : SIDEBAR_WIDTH.default;
  } catch {
    return SIDEBAR_WIDTH.default;
  }
}

/**
 * Persisted sidebar width. Safe to read localStorage in the initializer because
 * the desktop editor gates its whole tree behind `useClientReady()`, so this
 * never runs on the server.
 */
export function useSidebarWidth() {
  const [width, setWidth] = useState<number>(readStoredWidth);

  const persist = useCallback((next: number) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Private mode / quota — the width still applies for this session.
    }
  }, []);

  const commitWidth = useCallback(
    (next: number) => {
      const clamped = clampSidebarWidth(next);
      setWidth(clamped);
      persist(clamped);
    },
    [persist],
  );

  const resetWidth = useCallback(() => {
    setWidth(SIDEBAR_WIDTH.default);
    persist(SIDEBAR_WIDTH.default);
  }, [persist]);

  return { width, commitWidth, resetWidth };
}
