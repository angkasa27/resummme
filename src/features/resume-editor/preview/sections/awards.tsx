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
};
