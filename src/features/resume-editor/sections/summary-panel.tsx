"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useSectionFormState } from "@/features/resume-editor/hooks/use-section-form-state";
import { createSchemaResolver } from "@/features/resume-editor/lib/form-resolver";
import { summaryFormSchema } from "@/features/resume-editor/lib/section-schemas";
import { RichTextEditor } from "@/features/resume-editor/rich-text/rich-text-editor";
import { EditorCard } from "@/features/resume-editor/sections/editor-card";
import { FieldLabelText } from "@/features/resume-editor/sections/field-label-text";
import type { ResumeDraft } from "@/lib/resume/schema";

type SummaryFormValues = {
  content: ResumeDraft["sections"]["summary"]["content"];
};

type SummaryPanelProps = {
  draft: ResumeDraft;
  isDirty: boolean;
  onBack: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  onSave: (summary: ResumeDraft["sections"]["summary"]) => void;
};

export function SummaryPanel({
  draft,
  isDirty,
  onBack,
  onDirtyChange,
  onSave,
}: SummaryPanelProps) {
  const sectionValue = draft.sections.summary;
  const formValues = useMemo(
    () => ({
      content: sectionValue.content,
    }),
    [sectionValue.content]
  );
  const summaryForm = useForm<SummaryFormValues>({
    resolver: createSchemaResolver<SummaryFormValues>(summaryFormSchema),
    defaultValues: formValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { control, handleSubmit, reset, formState, getFieldState } = summaryForm;

  useSectionFormState({
    formIsDirty: formState.isDirty,
    onDirtyChange,
    reset,
    values: formValues,
  });

  return (
    <EditorCard
      onBack={onBack}
      isDirty={isDirty}
      title="Summary"
      meta={<Badge variant="secondary">Intro</Badge>}
      onCancel={() => reset(formValues)}
      onSave={handleSubmit((values) => {
        const nextSectionValue = {
          ...sectionValue,
          content: values.content,
        };

        onSave(nextSectionValue);
        reset(values);
        toast.success("Summary saved.");
      })}
    >
      <FieldGroup>
        <Field data-invalid={getFieldState("content", formState).invalid || undefined}>
          <FieldLabel>
            <FieldLabelText label="Summary content" />
          </FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={(value) =>
                    summaryForm.setValue("content", value, {
                      shouldDirty: true,
                      shouldValidate: formState.isSubmitted,
                    })
                  }
                  invalid={getFieldState("content", formState).invalid}
                />
              )}
            />
            <FieldError errors={[getFieldState("content", formState).error]} />
          </FieldContent>
        </Field>
      </FieldGroup>
    </EditorCard>
  );
}
