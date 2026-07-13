import { useEffect, useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export function useSyncedFormValues<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  nextValues: TFieldValues,
) {
  const { formState } = form;
  const prevNextRef = useRef(nextValues);

  useEffect(() => {
    // An external draft replacement (e.g. CV import via replaceDraft) changes
    // nextValues itself. That must win even when the form is dirty, otherwise a
    // pending autosave overwrites the imported data with stale typed values.
    const externalChanged =
      JSON.stringify(prevNextRef.current) !== JSON.stringify(nextValues);
    prevNextRef.current = nextValues;

    if (externalChanged) {
      form.reset(nextValues);
      return;
    }

    // No external change: nextValues differing from current is just local
    // drift (in-progress typing) — leave those edits untouched.
    const currentValues = form.getValues();
    const isDifferent =
      JSON.stringify(currentValues) !== JSON.stringify(nextValues);

    if (!isDifferent && formState.isDirty) {
      form.reset(nextValues, { keepValues: true });
    }
  }, [form, formState.isDirty, nextValues]);
}
