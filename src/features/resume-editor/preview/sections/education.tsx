import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import { joinParts } from "@/features/resume-editor/preview/helpers/string";
import { richTextHasContent } from "@/features/resume-editor/preview/engine";

import type { SectionDescriptor } from "./types";

export const educationDescriptor: SectionDescriptor<"education"> = {
  key: "education",
  defaultHeading: "Education",
  hasContent: (item) =>
    Boolean(
      item.name ||
        item.location ||
        item.startDate ||
        item.endDate ||
        item.degree ||
        item.gpa ||
        richTextHasContent(item.description),
    ),
  ItemView: ({ item }) => (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">{item.degree || item.name}</h3>
          {item.degree && item.name ? (
            <div className="meta">{joinParts([item.name, item.location])}</div>
          ) : item.location ? (
            <div className="meta">{item.location}</div>
          ) : null}
        </div>
        <div className="item-header-side">
          <div className="item-date">
            {renderDateRange(item.startDate, item.endDate)}
          </div>
          {item.gpa ? <div className="meta">GPA: {item.gpa}</div> : null}
        </div>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  ),
};
