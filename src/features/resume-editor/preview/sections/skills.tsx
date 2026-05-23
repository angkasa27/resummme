import type { SectionDescriptor } from "./types";

export const skillsDescriptor: SectionDescriptor<"skills"> = {
  key: "skills",
  defaultHeading: "Skills",
  hasContent: (item) => Boolean(item.categoryName || item.skills.some(Boolean)),
  ItemView: ({ item }) => (
    <div className="item item-row">
      <h3 className="item-title">{item.categoryName}</h3>
      <div className="meta">{item.skills.filter(Boolean).join(", ")}</div>
    </div>
  ),
};
