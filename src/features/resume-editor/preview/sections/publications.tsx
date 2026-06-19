import { richTextHasContent } from "@/features/resume-editor/preview/rich-text-utils";

import type { SectionDescriptor } from "./types";

export const publicationsDescriptor: SectionDescriptor<"publications"> = {
  key: "publications",
  defaultHeading: "Publications",
  hasContent: (item) =>
    Boolean(
      item.title ||
        item.publisher ||
        item.publicationUrl ||
        item.publicationDate ||
        richTextHasContent(item.description),
    ),
};
