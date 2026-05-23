import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import { richTextHasContent } from "@/features/resume-editor/preview/engine";

import type { SectionDescriptor } from "./types";

export const organizationVolunteeringDescriptor: SectionDescriptor<"organizationVolunteering"> =
  {
    key: "organizationVolunteering",
    defaultHeading: "Organizations & Volunteering",
    hasContent: (item) =>
      Boolean(
        item.organizationName ||
          item.position ||
          item.location ||
          item.startDate ||
          item.endDate ||
          richTextHasContent(item.description),
      ),
    ItemView: ({ item }) => (
      <div className="item">
        <div className="item-header">
          <div className="item-header-main">
            <h3 className="item-title">{item.position}</h3>
            <div className="meta">{item.organizationName}</div>
          </div>
          <div className="item-header-side">
            <div className="item-date">
              {renderDateRange(item.startDate, item.endDate)}
            </div>
            {item.location ? <div className="meta">{item.location}</div> : null}
          </div>
        </div>
        <PreviewRichTextBlock content={item.description} />
      </div>
    ),
  };
