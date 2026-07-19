"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  type ItemForm,
  TagInputField,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";

export function SkillsItemFields({
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
        name={`${prefix}.categoryName`}
        label="Category name"
        placeholder="Frontend Engineering"
      />
      <TagInputField
        form={form}
        name={`${prefix}.skills`}
        label="Skills"
        placeholder="React, Next.js, TypeScript"
        className="col-span-full"
      />
    </FieldGroup>
  );
}
