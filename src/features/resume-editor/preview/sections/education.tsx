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
};
