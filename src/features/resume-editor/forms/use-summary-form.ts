"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { summaryContentSchema } from "@/features/resume-editor/domain/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type SummaryFormValues = {
  content: ResumeDraft["sections"]["summary"]["content"];
};

/**
 * Shared summary-form state. `sectionValue` is exposed so callers can re-attach
 * the edited content to the full section.
 */
export function useSummaryForm(draft: ResumeDraft) {
  const sectionValue = draft.sections.summary;
  const formValues = useMemo(
    () => ({ content: sectionValue.content }),
    [sectionValue.content],
  );
  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summaryContentSchema),
    defaultValues: formValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  return { form, formValues, sectionValue };
}

export type SummaryFormContext = ReturnType<typeof useSummaryForm>;
