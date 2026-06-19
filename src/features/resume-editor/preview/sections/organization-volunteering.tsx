import { richTextHasContent } from "@/features/resume-editor/preview/rich-text-utils";

import type { SectionDescriptor } from "./types";

export const organizationVolunteeringDescriptor: SectionDescriptor<"organizationVolunteering"> =
  {
    key: "organizationVolunteering",
    defaultHeading: "Organizations & Volunteering",
    hasContent: (item) =>
      Boolean(
        item.organizationName ||
          item.position ||
          item.location ||
          item.startDate ||
          item.endDate ||
          richTextHasContent(item.description),
      ),
  };
