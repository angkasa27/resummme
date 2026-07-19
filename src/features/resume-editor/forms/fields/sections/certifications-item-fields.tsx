"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  type ItemForm,
  MonthYearField,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";
import { BadgeCheck, Building2, Link } from "lucide-react";

export function CertificationsItemFields({
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
        name={`${prefix}.certificationName`}
        label="Certification name"
        placeholder="Certification name"
        className="col-span-full"
      />
      <TextField
        form={form}
        name={`${prefix}.issuingOrganization`}
        label="Issuing organization"
        prefix={<Building2 />}
        placeholder="Issuing organization"
      />
      <MonthYearField
        form={form}
        name={`${prefix}.issuedDate`}
        label="Issued date"
      />
      <TextField
        form={form}
        type="url"
        name={`${prefix}.certificationLink`}
        label="Certification link"
        placeholder="https://example.com/certification"
        prefix={<Link />}
        className="col-span-full"
      />
      <TextField
        form={form}
        name={`${prefix}.credentialId`}
        label="Credential ID"
        prefix={<BadgeCheck />}
        placeholder="Credential or license number"
        className="col-span-full"
      />
    </FieldGroup>
  );
}
