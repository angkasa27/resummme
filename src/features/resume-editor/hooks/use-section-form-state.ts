import { useEffect, useRef } from "react";
import type { FieldValues, UseFormReset } from "react-hook-form";

type UseSectionFormStateOptions<TFieldValues extends FieldValues> = {
  isActive: boolean;
  formIsDirty: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  reset: UseFormReset<TFieldValues>;
  values: TFieldValues;
};

export function useSectionFormState<TFieldValues extends FieldValues>({
  isActive,
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
    if (!isActive) {
      return;
    }

    if (lastDirtyRef.current === formIsDirty) {
      return;
    }

    lastDirtyRef.current = formIsDirty;
    onDirtyChange(formIsDirty);
  }, [formIsDirty, isActive, onDirtyChange]);
}
