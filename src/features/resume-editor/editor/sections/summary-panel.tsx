"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { summaryFormSchema } from "@/features/resume-editor/domain/schema";
import { createFormSchemaResolver } from "@/features/resume-editor/forms/schemas/create-form-schema-resolver";
import { useAutoSave } from "@/features/resume-editor/forms/use-auto-save";
import { useSyncedFormValues } from "@/features/resume-editor/forms/use-synced-form-values";
import { RichTextEditor } from "@/features/resume-editor/editor/rich-text/rich-text-editor";
import { EditorCard } from "@/features/resume-editor/editor/sections/editor-card";
import { FieldLabelText } from "@/features/resume-editor/editor/sections/field-label-text";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type SummaryFormValues = {
  content: ResumeDraft["sections"]["summary"]["content"];
};

type SummaryPanelProps = {
  draft: ResumeDraft;
  onSave: (summary: ResumeDraft["sections"]["summary"]) => void;
};

export function SummaryPanel({ draft, onSave }: SummaryPanelProps) {
  const sectionValue = draft.sections.summary;
  const formValues = useMemo(
    () => ({
      content: sectionValue.content,
    }),
    [sectionValue.content]
  );
  const summaryForm = useForm<SummaryFormValues>({
    resolver: createFormSchemaResolver<SummaryFormValues>(summaryFormSchema),
    defaultValues: formValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { control, formState, getFieldState } = summaryForm;

  useSyncedFormValues(summaryForm, formValues);
  useAutoSave(summaryForm, (values) => {
    onSave({
      ...sectionValue,
      content: values.content,
    });
  });

  return (
    <EditorCard title="Summary" meta={<Badge variant="secondary">Intro</Badge>}>
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
