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
};
