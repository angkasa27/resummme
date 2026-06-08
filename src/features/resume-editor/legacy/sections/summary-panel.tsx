"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { summaryContentSchema } from "@/features/resume-editor/domain/schema";
import { createFormSchemaResolver } from "@/features/resume-editor/forms/schemas/create-form-schema-resolver";
import { useAutoSave } from "@/features/resume-editor/forms/use-auto-save";
import { useSyncedFormValues } from "@/features/resume-editor/forms/use-synced-form-values";
import { RichTextEditorWithImprove } from "@/features/resume-editor/shared/rich-text/improve-with-ai-dialog";
import { EditorCard } from "@/features/resume-editor/legacy/sections/editor-card";
import { FieldLabelText } from "@/features/resume-editor/shared/fields/field-label-text";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type SummaryFormValues = {
  content: ResumeDraft["sections"]["summary"]["content"];
};

type SummaryPanelProps = {
  draft: ResumeDraft;
  onSave: (summary: ResumeDraft["sections"]["summary"]) => void;
  leading?: ReactNode;
};

export function SummaryPanel({ draft, onSave, leading }: SummaryPanelProps) {
  const sectionValue = draft.sections.summary;
  const formValues = useMemo(
    () => ({
      content: sectionValue.content,
    }),
    [sectionValue.content]
  );
  const summaryForm = useForm<SummaryFormValues>({
    resolver: createFormSchemaResolver<SummaryFormValues>(summaryContentSchema),
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
    <EditorCard
      title="Summary"
      leading={leading}
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
                <RichTextEditorWithImprove
                  value={field.value}
                  ariaLabel="Summary content"
                  invalid={getFieldState("content", formState).invalid}
                  onChange={(value) =>
                    summaryForm.setValue("content", value, {
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
      </FieldGroup>
    </EditorCard>
  );
}
