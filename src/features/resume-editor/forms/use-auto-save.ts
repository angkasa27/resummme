import { useEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export function useAutoSave<T extends FieldValues>(
  form: UseFormReturn<T>,
  onSave: (values: T) => void,
  delay = 500
) {
  const { getValues, formState } = form;

  useEffect(() => {
    if (!formState.isDirty) return;

    const timeoutId = setTimeout(() => {
      onSave(getValues());
    }, delay);
    return () => clearTimeout(timeoutId);
  }, [delay, formState.isDirty, getValues, onSave]);
}