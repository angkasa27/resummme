"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  type ItemForm,
  MonthYearRangeField,
  RichTextField,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";
import { BriefcaseBusiness, MapPin } from "lucide-react";

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
        placeholder="Company or employer name"
        className="col-span-full"
      />
      <TextField
        form={form}
        name={`${prefix}.position`}
        label="Position"
        prefix={<BriefcaseBusiness />}
        placeholder="Job title"
      />
      <TextField
        form={form}
        name={`${prefix}.location`}
        label="Location"
        prefix={<MapPin />}
        placeholder="City, country"
      />
      <MonthYearRangeField
        form={form}
        startName={`${prefix}.startDate`}
        endName={`${prefix}.endDate`}
        currentLabel="Mark this role as current"
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
