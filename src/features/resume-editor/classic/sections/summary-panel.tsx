"use client";

import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { useAutoSave } from "@/features/resume-editor/forms/use-auto-save";
import { EditorCard } from "@/features/resume-editor/classic/sections/editor-card";
import { SummaryFields } from "@/features/resume-editor/shared/forms/summary-fields";
import { useSummaryForm } from "@/features/resume-editor/shared/forms/use-summary-form";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type SummaryPanelProps = {
  draft: ResumeDraft;
  onSave: (summary: ResumeDraft["sections"]["summary"]) => void;
  leading?: ReactNode;
};

export function SummaryPanel({ draft, onSave, leading }: SummaryPanelProps) {
  const ctx = useSummaryForm(draft);
  useAutoSave(ctx.form, (values) =>
    onSave({ ...ctx.sectionValue, content: values.content }),
  );

  return (
    <EditorCard
      title="Summary"
      leading={leading}
      meta={<Badge variant="secondary">Intro</Badge>}
    >
      <SummaryFields ctx={ctx} />
    </EditorCard>
  );
}
