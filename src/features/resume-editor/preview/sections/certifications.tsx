import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";

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
  ItemView: ({ item }) => (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">
            <PreviewLinkedTitle
              title={item.certificationName}
              link={item.certificationLink}
            />
          </h3>
          {item.issuingOrganization ? (
            <div className="meta">{item.issuingOrganization}</div>
          ) : null}
          {item.credentialId ? (
            <div className="meta">Credential ID: {item.credentialId}</div>
          ) : null}
        </div>
        <div className="item-date">{item.issuedDate}</div>
      </div>
    </div>
  ),
};
