"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  type ItemForm,
  MonthYearField,
  RichTextField,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";

export function PublicationsItemFields({
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
        placeholder="Designing Maintainable Frontend Platforms"
      />
      <TextField
        form={form}
        name={`${prefix}.publisher`}
        label="Publisher"
        placeholder="Medium, IEEE, or conference name"
      />
      <TextField
        form={form}
        type="url"
        name={`${prefix}.publicationUrl`}
        label="Publication URL"
        placeholder="https://example.com/publication"
        className="col-span-full"
      />
      <MonthYearField
        form={form}
        name={`${prefix}.publicationDate`}
        label="Publication date"
      />
      <RichTextField
        form={form}
        name={`${prefix}.description`}
        label="Description"
        placeholder="Explain the topic and why it matters."
        className="col-span-full"
      />
    </FieldGroup>
  );
}
