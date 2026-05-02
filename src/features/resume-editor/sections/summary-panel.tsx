"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { SaveIcon, SquareXIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
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
import { renderSectionIcon } from "@/features/resume-editor/sections/section-icons";
import type { ResumeDraft } from "@/lib/resume/schema";

type SummaryFormValues = {
  content: ResumeDraft["sections"]["summary"]["content"];
};

type SummaryPanelProps = {
  draft: ResumeDraft;
  isDirty: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  onSave: (summary: ResumeDraft["sections"]["summary"]) => void;
};

export function SummaryPanel({
  draft,
  isDirty,
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
      isDirty={isDirty}
      icon={renderSectionIcon("summary")}
      title="Summary"
      description="Write the short recruiter-first introduction shown near the top of the CV."
      footerActions={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => reset(formValues)}
          >
            <SquareXIcon data-icon="inline-start" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit((values) => {
              const nextSectionValue = {
                ...sectionValue,
                content: values.content,
              };

              onSave(nextSectionValue);
              reset(values);
              toast.success("Summary saved.");
            })}
          >
            <SaveIcon data-icon="inline-start" />
            Save Section
          </Button>
        </>
      }
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
            <FieldDescription>
              Focus on experience level, specialization, and the kind of impact you bring.
            </FieldDescription>
            <FieldError errors={[getFieldState("content", formState).error]} />
          </FieldContent>
        </Field>
      </FieldGroup>
    </EditorCard>
  );
}
