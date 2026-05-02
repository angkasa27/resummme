"use client";

import { Controller, useForm, useWatch } from "react-hook-form";
import { SaveIcon, SquareXIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { useSectionFormState } from "@/features/resume-editor/hooks/use-section-form-state";
import { nextOrderValue } from "@/features/resume-editor/lib/draft-utils";
import { createSchemaResolver } from "@/features/resume-editor/lib/form-resolver";
import { RichTextEditor } from "@/features/resume-editor/rich-text/rich-text-editor";
import { EditorCard } from "@/features/resume-editor/sections/editor-card";
import { renderSectionIcon } from "@/features/resume-editor/sections/section-icons";
import { summarySectionSchema } from "@/lib/resume/schema";
import type { ResumeDraft, SummarySection } from "@/lib/resume/schema";

type SummaryPanelProps = {
  draft: ResumeDraft;
  isActive: boolean;
  isDirty: boolean;
  onRequestOpen: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  onSave: (summary: SummarySection) => void;
};

export function SummaryPanel({
  draft,
  isActive,
  isDirty,
  onRequestOpen,
  onDirtyChange,
  onSave,
}: SummaryPanelProps) {
  const summaryForm = useForm<SummarySection>({
    resolver: createSchemaResolver<SummarySection>(summarySectionSchema),
    defaultValues: draft.sections.summary,
  });
  const { control, handleSubmit, reset, formState, setValue } = summaryForm;
  const currentOrder = useWatch({
    control,
    name: "order",
  });
  const maxOrder = Object.keys(draft.sections).length - 1;

  useSectionFormState({
    isActive,
    formIsDirty: formState.isDirty,
    onDirtyChange,
    reset,
    values: draft.sections.summary,
  });

  return (
    <EditorCard
      isActive={isActive}
      isDirty={isDirty}
      icon={renderSectionIcon("summary")}
      title="Summary"
      description="A concise, recruiter-first introduction below the header."
      onRequestOpen={onRequestOpen}
      footerActions={
        <>
          <Button type="button" variant="outline" onClick={() => reset(draft.sections.summary)}>
            <SquareXIcon data-icon="inline-start" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit((values) => {
              onSave(values);
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
        <Field orientation="horizontal">
          <FieldLabel htmlFor="summary-visible">Show summary</FieldLabel>
          <Controller
            control={control}
            name="visible"
            render={({ field }) => (
              <Switch
                id="summary-visible"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </Field>
        <Field>
          <FieldLabel>Section order</FieldLabel>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setValue("order", nextOrderValue(currentOrder ?? 0, -1, maxOrder), {
                  shouldDirty: true,
                })
              }
            >
              Move up
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setValue("order", nextOrderValue(currentOrder ?? 0, 1, maxOrder), {
                  shouldDirty: true,
                })
              }
            >
              Move down
            </Button>
            <Badge variant="secondary">Order {(currentOrder ?? 0) + 1}</Badge>
          </div>
        </Field>
        <Field>
          <FieldLabel>Summary content</FieldLabel>
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>
      </FieldGroup>
    </EditorCard>
  );
}
