import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import { richTextHasContent } from "@/features/resume-editor/preview/engine";

import type { SectionDescriptor } from "./types";

export const projectsDescriptor: SectionDescriptor<"projects"> = {
  key: "projects",
  defaultHeading: "Projects",
  hasContent: (item) =>
    Boolean(
      item.projectName ||
        item.projectLink ||
        item.startDate ||
        item.endDate ||
        richTextHasContent(item.description),
    ),
  ItemView: ({ item }) => (
    <div className="item">
      <div className="item-header">
        <h3 className="item-title">
          <PreviewLinkedTitle title={item.projectName} link={item.projectLink} />
        </h3>
        <div className="item-date">
          {renderDateRange(item.startDate, item.endDate)}
        </div>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  ),
};
