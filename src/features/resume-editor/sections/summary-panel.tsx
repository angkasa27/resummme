"use client";

import { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

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
  onBack: () => void;
  onSave: (summary: ResumeDraft["sections"]["summary"]) => void;
};

export function SummaryPanel({
  draft,
  onBack,
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
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { control, formState, getFieldState } = summaryForm;

  const formValuesWatched = useWatch({ control });

  useEffect(() => {
    const currentValues = summaryForm.getValues();
    const isDifferent =
      JSON.stringify(currentValues) !== JSON.stringify(formValues);

    if (!isDifferent) {
      if (formState.isDirty) {
        summaryForm.reset(formValues, { keepValues: true });
      }
      return;
    }

    if (!formState.isDirty) {
      summaryForm.reset(formValues);
    }
  }, [formValues, summaryForm, formState.isDirty]);

  useEffect(() => {
    if (!formState.isDirty) return;

    const timeoutId = setTimeout(() => {
      const values = summaryForm.getValues();
      const nextSectionValue = {
        ...sectionValue,
        content: values.content,
      };
      onSave(nextSectionValue);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formValuesWatched, formState.isDirty, summaryForm, onSave, sectionValue]);

  return (
    <EditorCard
      onBack={onBack}
      title="Summary"
      meta={<Badge variant="secondary">Intro</Badge>}
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
