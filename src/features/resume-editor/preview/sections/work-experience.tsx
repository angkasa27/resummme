import { richTextHasContent } from "@/features/resume-editor/preview/engine";

import type { SectionDescriptor } from "./types";

export const workExperienceDescriptor: SectionDescriptor<"workExperience"> = {
  key: "workExperience",
  defaultHeading: "Work Experience",
  hasContent: (item) =>
    Boolean(
      item.companyName ||
        item.position ||
        item.location ||
        item.startDate ||
        item.endDate ||
        richTextHasContent(item.description),
    ),
};
