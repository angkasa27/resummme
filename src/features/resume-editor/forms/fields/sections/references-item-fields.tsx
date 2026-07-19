"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  type ItemForm,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";
import { BookUser, BriefcaseBusiness } from "lucide-react";

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
      <TextField
        form={form}
        name={`${prefix}.background`}
        label="Background"
        placeholder="Their role and company"
        prefix={<BriefcaseBusiness />}
        className="col-span-full"
      />
      <TextField
        form={form}
        name={`${prefix}.contactDetails`}
        label="Contact details"
        placeholder="Email, phone, or how to reach them"
        prefix={<BookUser />}
        className="col-span-full"
      />
    </FieldGroup>
  );
}
