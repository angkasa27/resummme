"use client";

import { useEffect, useId, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldError,
} from "@/components/ui/field";

import { summaryContentSchema } from "@/features/resume-editor/domain/schema";
import { createFormSchemaResolver } from "@/features/resume-editor/forms/schemas/create-form-schema-resolver";
import { useSyncedFormValues } from "@/features/resume-editor/forms/use-synced-form-values";
import { RichTextEditorWithImprove } from "@/features/resume-editor/editor/rich-text/improve-with-ai-dialog";
import { CanvasFormShell } from "@/features/resume-editor/canvas/forms/canvas-form-shell";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type SummaryFormValues = {
  content: ResumeDraft["sections"]["summary"]["content"];
};

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
  const sectionValue = draft.sections.summary;
  const formValues = useMemo(
    () => ({ content: sectionValue.content }),
    [sectionValue.content],
  );
  const form = useForm<SummaryFormValues>({
    resolver: createFormSchemaResolver<SummaryFormValues>(summaryContentSchema),
    defaultValues: formValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { control, formState, getFieldState, handleSubmit } = form;
  const formId = useId();

  useSyncedFormValues(form, formValues);

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
      onSubmit={handleSubmit(handleSave)}
      className="flex h-full min-h-0 flex-col"
    >
      <CanvasFormShell
        title="Summary"
        onCancel={onCancel}
        formId={formId}
        isDirty={formState.isDirty}
        isSaving={formState.isSubmitting}
      >
        <Field
          data-invalid={getFieldState("content", formState).invalid || undefined}
        >
          <FieldContent>
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <RichTextEditorWithImprove
                  value={field.value}
                  ariaLabel="Summary"
                  invalid={getFieldState("content", formState).invalid}
                  onChange={(value) =>
                    form.setValue("content", value, {
                      shouldDirty: true,
                      shouldValidate: formState.isSubmitted,
                    })
                  }
                />
              )}
            />
            <FieldError errors={[getFieldState("content", formState).error]} />
          </FieldContent>
        </Field>
      </CanvasFormShell>
    </form>
  );
}
