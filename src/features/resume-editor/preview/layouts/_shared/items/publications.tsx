import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import type { SectionItem } from "@/features/resume-editor/preview/descriptors/types";

export function PublicationsItem({
  item,
}: {
  item: SectionItem<"publications">;
}) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">
            <PreviewLinkedTitle title={item.title} link={item.publicationUrl} />
          </h3>
          {item.publisher ? <div className="meta">{item.publisher}</div> : null}
        </div>
        <div className="item-date">{item.publicationDate}</div>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}
