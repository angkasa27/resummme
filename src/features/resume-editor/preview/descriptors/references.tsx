import type { SectionDescriptor } from "./types";

export const referencesDescriptor: SectionDescriptor<"references"> = {
  key: "references",
  defaultHeading: "References",
  hasContent: (item) =>
    Boolean(item.name || item.background || item.contactDetails),
};
