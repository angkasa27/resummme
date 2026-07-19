"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  type ItemForm,
  MonthYearField,
  RichTextField,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";

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
        placeholder="Best Innovation Award"
      />
      <TextField
        form={form}
        name={`${prefix}.issuer`}
        label="Issuer"
        placeholder="Tech Conference Asia"
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
        placeholder="State the achievement and selection context."
        className="col-span-full"
      />
    </FieldGroup>
  );
}
