import { useEffect, useRef } from "react";
import type { FieldValues, UseFormReset } from "react-hook-form";

type UseSectionFormStateOptions<TFieldValues extends FieldValues> = {
  formIsDirty: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  reset: UseFormReset<TFieldValues>;
  values: TFieldValues;
};

export function useSectionFormState<TFieldValues extends FieldValues>({
  formIsDirty,
  onDirtyChange,
  reset,
  values,
}: UseSectionFormStateOptions<TFieldValues>) {
  const lastDirtyRef = useRef(formIsDirty);

  useEffect(() => {
    reset(values);
    lastDirtyRef.current = false;
  }, [reset, values]);

  useEffect(() => {
    if (lastDirtyRef.current === formIsDirty) {
      return;
    }

    lastDirtyRef.current = formIsDirty;
    onDirtyChange(formIsDirty);
  }, [formIsDirty, onDirtyChange]);
}
