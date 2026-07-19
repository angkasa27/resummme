"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  type ItemForm,
  MonthYearRangeField,
  RichTextField,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";
import { Award, GraduationCap, MapPin, School } from "lucide-react";

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
        placeholder="School or university name"
        className="col-span-full"
      />
      <TextField
        form={form}
        name={`${prefix}.degree`}
        label="Degree / major"
        placeholder="Degree and field of study"
        className="col-span-full"
        prefix={<GraduationCap />}
      />
      <TextField
        form={form}
        name={`${prefix}.location`}
        label="Location"
        prefix={<MapPin />}
        placeholder="City, country"
      />
      <TextField
        form={form}
        name={`${prefix}.gpa`}
        label="GPA"
        prefix={<Award />}
        placeholder="GPA or grade"
      />
      <MonthYearRangeField
        form={form}
        startName={`${prefix}.startDate`}
        endName={`${prefix}.endDate`}
        currentLabel="Mark as currently studying"
        className="col-span-full"
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
