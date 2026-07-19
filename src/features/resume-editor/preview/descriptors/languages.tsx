import type { SectionDescriptor } from "./types";

export const languagesDescriptor: SectionDescriptor<"languages"> = {
  key: "languages",
  defaultHeading: "Languages",
  hasContent: (item) => Boolean(item.language || item.proficiency),
};
