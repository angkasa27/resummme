"use client";

import { Controller } from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { FieldLabelText } from "@/features/resume-editor/forms/fields/field-label-text";
import { RichTextEditorWithImprove } from "@/features/resume-editor/forms/rich-text/improve-with-ai-dialog";
import type { SummaryFormContext } from "@/features/resume-editor/forms/use-summary-form";

export function SummaryFields({ ctx }: { ctx: SummaryFormContext }) {
  const { form } = ctx;
  const { control, formState, getFieldState } = form;

  return (
    <FieldGroup>
      <Field
        data-invalid={getFieldState("content", formState).invalid || undefined}
      >
        <FieldLabel className="sr-only">
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
    </FieldGroup>
  );
}
