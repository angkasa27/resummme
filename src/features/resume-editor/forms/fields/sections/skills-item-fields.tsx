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
        placeholder="Category name"
        className="col-span-full"
      />
      <TagInputField
        form={form}
        name={`${prefix}.skills`}
        label="Skills"
        placeholder="Skills in this category"
        className="col-span-full"
      />
    </FieldGroup>
  );
}
