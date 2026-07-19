"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  type ItemForm,
  MonthYearRangeField,
  RichTextField,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";
import { BriefcaseBusiness, MapPin } from "lucide-react";

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
        placeholder="Community or organization name"
        className="col-span-full"
      />
      <TextField
        form={form}
        name={`${prefix}.position`}
        label="Position"
        prefix={<BriefcaseBusiness />}
        placeholder="Role or title"
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
        currentLabel="Mark as a current membership"
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
