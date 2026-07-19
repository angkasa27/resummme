"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  type ItemForm,
  MonthYearField,
  RichTextField,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";
import { Building2 } from "lucide-react";

export function AwardsItemFields({
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
        name={`${prefix}.title`}
        label="Title"
        placeholder="Award title"
        className="col-span-full"
      />
      <TextField
        form={form}
        name={`${prefix}.issuer`}
        label="Issuer"
        prefix={<Building2 />}
        placeholder="Issuer organization or event"
      />
      <MonthYearField
        form={form}
        name={`${prefix}.issuedDate`}
        label="Issued date"
      />
      <RichTextField
        form={form}
        name={`${prefix}.description`}
        label="Description"
        placeholder="State the achievement and selection context"
        className="col-span-full"
      />
    </FieldGroup>
  );
}
