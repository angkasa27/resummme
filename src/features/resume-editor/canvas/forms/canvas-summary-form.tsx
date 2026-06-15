"use client";

import { useEffect, useId } from "react";

import { CanvasFormShell } from "@/features/resume-editor/canvas/forms/canvas-form-shell";
import { SectionIcon } from "@/features/resume-editor/shared/section-icons";
import { SummaryFields } from "@/features/resume-editor/shared/forms/summary-fields";
import {
  useSummaryForm,
  type SummaryFormValues,
} from "@/features/resume-editor/shared/forms/use-summary-form";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type CanvasSummaryFormProps = {
  draft: ResumeDraft;
  onSave: (summary: ResumeDraft["sections"]["summary"]) => void;
  onCancel: () => void;
  onClose: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

export function CanvasSummaryForm({
  draft,
  onSave,
  onCancel,
  onClose,
  onDirtyChange,
}: CanvasSummaryFormProps) {
  const ctx = useSummaryForm(draft);
  const { form, sectionValue } = ctx;
  const { formState } = form;
  const formId = useId();

  useEffect(() => {
    onDirtyChange?.(formState.isDirty);
  }, [formState.isDirty, onDirtyChange]);

  function handleSave(values: SummaryFormValues) {
    onSave({ ...sectionValue, content: values.content });
    onClose();
  }

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(handleSave)}
      className="flex h-full min-h-0 flex-col"
    >
      <CanvasFormShell
        title="Summary"
        icon={<SectionIcon sectionKey="summary" />}
        onCancel={onCancel}
        formId={formId}
        isDirty={formState.isDirty}
        isSaving={formState.isSubmitting}
      >
        <SummaryFields ctx={ctx} />
      </CanvasFormShell>
    </form>
  );
}
