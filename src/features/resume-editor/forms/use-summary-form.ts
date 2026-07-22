"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { summaryContentSchema } from "@/features/resume-editor/domain/schema";
import { createFormSchemaResolver } from "@/features/resume-editor/forms/schemas/create-form-schema-resolver";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

export type SummaryFormValues = {
  content: ResumeDraft["sections"]["summary"]["content"];
};

/**
 * Shared summary-form state. The presentational `SummaryFields` renders from it;
 * each editor supplies its own shell + save lifecycle. `sectionValue` is
 * exposed so callers can re-attach the edited content to the full section.
 */
export function useSummaryForm(draft: ResumeDraft) {
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

  return { form, formValues, sectionValue };
}

export type SummaryFormContext = ReturnType<typeof useSummaryForm>;
