import type { SectionItem } from "@/features/resume-editor/preview/sections/types";

export function ReferencesItem({ item }: { item: SectionItem<"references"> }) {
  return (
    <div className="item">
      <h3 className="item-title">{item.name}</h3>
      {item.background ? <div className="meta">{item.background}</div> : null}
      {item.contactDetails ? (
        <div className="meta">{item.contactDetails}</div>
      ) : null}
    </div>
  );
}
