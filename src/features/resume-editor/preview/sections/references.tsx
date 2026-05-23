import type { SectionDescriptor } from "./types";

export const referencesDescriptor: SectionDescriptor<"references"> = {
  key: "references",
  defaultHeading: "References",
  hasContent: (item) =>
    Boolean(item.name || item.background || item.contactDetails),
  ItemView: ({ item }) => (
    <div className="item">
      <h3 className="item-title">{item.name}</h3>
      {item.background ? <div className="meta">{item.background}</div> : null}
      {item.contactDetails ? (
        <div className="meta">{item.contactDetails}</div>
      ) : null}
    </div>
  ),
};
