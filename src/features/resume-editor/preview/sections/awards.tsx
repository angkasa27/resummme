import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { richTextHasContent } from "@/features/resume-editor/preview/engine";

import type { SectionDescriptor } from "./types";

export const awardsDescriptor: SectionDescriptor<"awards"> = {
  key: "awards",
  defaultHeading: "Awards",
  hasContent: (item) =>
    Boolean(
      item.title ||
        item.issuer ||
        item.issuedDate ||
        richTextHasContent(item.description),
    ),
  ItemView: ({ item }) => (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">{item.title}</h3>
          {item.issuer ? <div className="meta">{item.issuer}</div> : null}
        </div>
        <div className="item-date">{item.issuedDate}</div>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  ),
};
