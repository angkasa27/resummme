"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  type ItemForm,
  MonthYearRangeField,
  RichTextField,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";

export function EducationItemFields({
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
        name={`${prefix}.name`}
        label="Institution name"
        placeholder="Universitas Indonesia"
      />
      <TextField
        form={form}
        name={`${prefix}.location`}
        label="Location"
        placeholder="Depok, Indonesia"
      />
      <MonthYearRangeField
        form={form}
        startName={`${prefix}.startDate`}
        endName={`${prefix}.endDate`}
        className="col-span-full"
      />
      <TextField
        form={form}
        name={`${prefix}.degree`}
        label="Degree / major"
        placeholder="B.Sc. in Computer Science"
      />
      <TextField
        form={form}
        name={`${prefix}.gpa`}
        label="GPA"
        placeholder="3.78 / 4.00"
      />
      <RichTextField
        form={form}
        name={`${prefix}.description`}
        label="Description"
        placeholder="Add honors, thesis topic, or relevant coursework."
        className="col-span-full"
      />
    </FieldGroup>
  );
}
