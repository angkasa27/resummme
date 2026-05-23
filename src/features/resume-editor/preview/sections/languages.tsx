import type { SectionDescriptor } from "./types";

export const languagesDescriptor: SectionDescriptor<"languages"> = {
  key: "languages",
  defaultHeading: "Languages",
  hasContent: (item) => Boolean(item.language || item.proficiency),
  ItemView: ({ item }) => (
    <div className="item item-row">
      <h3 className="item-title">{item.language}</h3>
      <div className="meta">{item.proficiency}</div>
    </div>
  ),
};
