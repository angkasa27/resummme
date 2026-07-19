"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  type ItemForm,
  MonthYearRangeField,
  RichTextField,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";

export function WorkExperienceItemFields({
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
        name={`${prefix}.companyName`}
        label="Company name"
        placeholder="PT Example Indonesia"
      />
      <TextField
        form={form}
        name={`${prefix}.position`}
        label="Position"
        placeholder="Senior Frontend Engineer"
      />
      <TextField
        form={form}
        name={`${prefix}.location`}
        label="Location"
        placeholder="Jakarta, Indonesia"
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
        placeholder="Summarize scope, ownership, and measurable impact."
        className="col-span-full"
      />
    </FieldGroup>
  );
}
