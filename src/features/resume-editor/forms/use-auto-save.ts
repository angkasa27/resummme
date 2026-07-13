import { useEffect, useLayoutEffect, useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export function useAutoSave<T extends FieldValues>(
  form: UseFormReturn<T>,
  onSave: (values: T) => void,
  delay = 500,
) {
  const { getValues, formState } = form;
  const { isDirty, isValid } = formState;

  // Keep the latest onSave behind a ref so an unstable callback identity doesn't
  // churn the debounce timer on every unrelated re-render.
  const onSaveRef = useRef(onSave);
  useLayoutEffect(() => {
    onSaveRef.current = onSave;
  });

  useEffect(() => {
    if (!isDirty || !isValid) return;

    const timeoutId = setTimeout(() => {
      onSaveRef.current(getValues());
    }, delay);
    return () => {
      clearTimeout(timeoutId);
      // Flush the pending edit so unmount (e.g. section collapse) doesn't drop it.
      onSaveRef.current(getValues());
    };
  }, [delay, isDirty, isValid, getValues]);
}
