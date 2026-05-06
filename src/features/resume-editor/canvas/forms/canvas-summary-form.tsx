"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldError,
} from "@/components/ui/field";

import { summaryFormSchema } from "@/features/resume-editor/domain/schema";
import { createFormSchemaResolver } from "@/features/resume-editor/forms/schemas/create-form-schema-resolver";
import { useAutoSave } from "@/features/resume-editor/forms/use-auto-save";
import { useSyncedFormValues } from "@/features/resume-editor/forms/use-synced-form-values";
import { RichTextEditor } from "@/features/resume-editor/editor/rich-text/rich-text-editor";
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
};

export function CanvasSummaryForm({
  draft,
  onSave,
  onCancel,
  onClose,
}: CanvasSummaryFormProps) {
  const sectionValue = draft.sections.summary;
  const formValues = useMemo(
    () => ({ content: sectionValue.content }),
    [sectionValue.content],
  );
  const form = useForm<SummaryFormValues>({
    resolver: createFormSchemaResolver<SummaryFormValues>(summaryFormSchema),
    defaultValues: formValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { control, formState, getFieldState } = form;

  useSyncedFormValues(form, formValues);
  useAutoSave(form, (values) => {
    onSave({ ...sectionValue, content: values.content });
  });

  return (
    <CanvasFormShell title="Summary" onCancel={onCancel} onClose={onClose}>
      <Field data-invalid={getFieldState("content", formState).invalid || undefined}>
        <FieldContent>
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <RichTextEditor
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
  );
}
