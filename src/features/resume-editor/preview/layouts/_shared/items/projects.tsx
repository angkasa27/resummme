import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import type { SectionItem } from "@/features/resume-editor/preview/sections/types";

export function ProjectsItem({ item }: { item: SectionItem<"projects"> }) {
  return (
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
  );
}
