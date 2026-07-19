"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  type ItemForm,
  MonthYearField,
  TextField,
} from "@/features/resume-editor/forms/fields/item-field-atoms";

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
        placeholder="AWS Certified Developer - Associate"
      />
      <TextField
        form={form}
        name={`${prefix}.issuingOrganization`}
        label="Issuing organization"
        placeholder="Amazon Web Services"
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
        className="col-span-full"
      />
      <TextField
        form={form}
        name={`${prefix}.credentialId`}
        label="Credential ID"
        placeholder="ABC-123-XYZ"
      />
    </FieldGroup>
  );
}
