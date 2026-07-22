import { useEffect, useLayoutEffect, useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

import { useEditorRevision } from "@/features/resume-editor/state/editor-revision";

function isSame(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Owns a section form's persistence in both directions:
 *
 * - **Save** — a trailing debounce on each edit, flushed on unmount (drilling
 *   back) and on page hide/close. Unconditional: the stored schema is lenient,
 *   so no edit is ever dropped for being mid-typed. "Has something to save" is
 *   decided by comparing the live values to the last-saved snapshot, which is
 *   synchronous — so even an immediate type-then-back persists.
 * - **Re-seed** — when the draft is replaced externally (import/undo/redo, which
 *   bump the store revision), reset the form to the new values and abandon any
 *   pending edit, so a stale in-progress value can't be flushed back over the
 *   replacement (which would also corrupt undo history).
 *
 * `values` is the section's current persisted value (the form's seed).
 */
export function useAutoSave<T extends FieldValues>(
  form: UseFormReturn<T>,
  values: T,
  onSave: (values: T) => void,
  delay = 500,
) {
  const onSaveRef = useRef(onSave);
  useLayoutEffect(() => {
    onSaveRef.current = onSave;
  });

  const revision = useEditorRevision();
  const prevRevision = useRef(revision);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  // The values as of the last persist (or seed/re-seed). A flush saves only when
  // the live form differs from this, so an open-then-back with no edit is a
  // no-op (and doesn't add an undo entry).
  const lastSavedRef = useRef<T>(values);

  useEffect(() => {
    if (revision === prevRevision.current) return;
    prevRevision.current = revision;
    clearTimeout(timerRef.current);
    lastSavedRef.current = values;
    form.reset(values);
  }, [revision, values, form]);

  useEffect(() => {
    const save = () => {
      const next = form.getValues();
      lastSavedRef.current = next;
      onSaveRef.current(next);
    };
    const flush = () => {
      if (!isSame(form.getValues(), lastSavedRef.current)) save();
    };

    const unsubscribe = form.subscribe({
      formState: { values: true },
      callback: () => {
        if (isSame(form.getValues(), lastSavedRef.current)) return;
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(save, delay);
      },
    });

    // React cleanups don't run on a real page unload, so flush on hide too.
    const onPageHide = () => flush();
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      unsubscribe();
      clearTimeout(timerRef.current);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      flush();
    };
  }, [form, delay]);
}
