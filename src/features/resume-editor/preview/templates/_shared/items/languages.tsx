import type { SectionItem } from "@/features/resume-editor/preview/sections/types";

export function LanguagesItem({ item }: { item: SectionItem<"languages"> }) {
  return (
    <div className="item item-row">
      <h3 className="item-title">{item.language}</h3>
      <div className="meta">{item.proficiency}</div>
    </div>
  );
}
