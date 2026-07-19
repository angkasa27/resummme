"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  type ItemForm,
  MonthYearRangeField,
  RichTextField,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";

export function ProjectsItemFields({
  form,
  index,
}: {
  form: ItemForm;
  index: number;
}) {
  const prefix = `items.${index}` as const;

  return (
    <FieldGroup layout="grid">
      <TextField
        form={form}
        name={`${prefix}.projectName`}
        label="Project name"
        placeholder="Internal Design System"
      />
      <TextField
        form={form}
        type="url"
        name={`${prefix}.projectLink`}
        label="Project link"
        placeholder="https://example.com/project"
        className="col-span-full"
      />
      <MonthYearRangeField
        form={form}
        startName={`${prefix}.startDate`}
        endName={`${prefix}.endDate`}
        className="col-span-full"
      />
      <RichTextField
        form={form}
        name={`${prefix}.description`}
        label="Description"
        placeholder="Describe the problem, your role, and the outcome."
        className="col-span-full"
      />
    </FieldGroup>
  );
}
