import type { SectionDescriptor } from "./types";

export const certificationsDescriptor: SectionDescriptor<"certifications"> = {
  key: "certifications",
  defaultHeading: "Certifications",
  hasContent: (item) =>
    Boolean(
      item.certificationName ||
        item.issuingOrganization ||
        item.issuedDate ||
        item.certificationLink ||
        item.credentialId,
    ),
};
