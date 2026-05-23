import { useMemo } from "react";
import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { FieldValues, UseFormReturn } from "react-hook-form";

import { useAutoSave } from "@/features/resume-editor/forms/use-auto-save";

type TestValues = FieldValues & { value: string };

type HarnessProps = {
  isDirty: boolean;
  isValid: boolean;
  onSave: (values: TestValues) => void;
};

function Harness({ isDirty, isValid, onSave }: HarnessProps) {
  const form = useMemo(
    () =>
      ({
        getValues: () => ({ value: "draft" }),
        formState: { isDirty, isValid },
      }) as unknown as UseFormReturn<TestValues>,
    [isDirty, isValid],
  );

  useAutoSave<TestValues>(form, onSave, 100);

  return null;
}

describe("useAutoSave", () => {
  it("skips saving while the form is invalid", () => {
    vi.useFakeTimers();
    const onSave = vi.fn();

    const { rerender } = render(
      <Harness isDirty={true} isValid={false} onSave={onSave} />,
    );

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(onSave).not.toHaveBeenCalled();

    rerender(<Harness isDirty={true} isValid={true} onSave={onSave} />);

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(onSave).toHaveBeenCalledWith({ value: "draft" });

    vi.useRealTimers();
  });
});
