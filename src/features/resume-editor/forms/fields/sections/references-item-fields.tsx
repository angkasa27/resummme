"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  type ItemForm,
  TextareaField,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";

export function ReferencesItemFields({
  form,
  index,
}: {
  form: ItemForm;
  index: number;
}) {
  const prefix = `items.${index}` as const;

  return (
    <FieldGroup layout="grid">
      <TextField form={form} name={`${prefix}.name`} label="Name" />
      <TextareaField
        form={form}
        name={`${prefix}.background`}
        label="Background"
        placeholder="Engineering Manager at Example Corp"
        className="col-span-full"
      />
      <TextareaField
        form={form}
        name={`${prefix}.contactDetails`}
        label="Contact details"
        placeholder="name@example.com | +62 812-3456-7890"
        className="col-span-full"
      />
    </FieldGroup>
  );
}
