import { useEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export function useSyncedFormValues<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  nextValues: TFieldValues,
) {
  const { formState } = form;

  useEffect(() => {
    const currentValues = form.getValues();
    const isDifferent =
      JSON.stringify(currentValues) !== JSON.stringify(nextValues);

    if (!isDifferent) {
      if (formState.isDirty) {
        form.reset(nextValues, { keepValues: true });
      }
      return;
    }

    if (!formState.isDirty) {
      form.reset(nextValues);
    }
  }, [form, formState.isDirty, nextValues]);
}
