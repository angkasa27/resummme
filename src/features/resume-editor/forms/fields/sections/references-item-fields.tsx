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
        placeholder="Their role and company"
        className="col-span-full"
      />
      <TextareaField
        form={form}
        name={`${prefix}.contactDetails`}
        label="Contact details"
        placeholder="Email, phone, or how to reach them"
        className="col-span-full"
      />
    </FieldGroup>
  );
}
