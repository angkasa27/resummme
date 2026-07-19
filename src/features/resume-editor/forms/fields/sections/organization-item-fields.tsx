"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  type ItemForm,
  MonthYearRangeField,
  RichTextField,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";

export function OrganizationItemFields({
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
        name={`${prefix}.organizationName`}
        label="Organization name"
        placeholder="Frontend Jakarta Community"
      />
      <TextField
        form={form}
        name={`${prefix}.position`}
        label="Position"
        placeholder="Volunteer Mentor"
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
        placeholder="Describe the responsibility, audience, and contribution."
        className="col-span-full"
      />
    </FieldGroup>
  );
}
