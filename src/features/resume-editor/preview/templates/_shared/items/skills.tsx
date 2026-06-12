import type { SectionItem } from "@/features/resume-editor/preview/sections/types";

export function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <div className="item">
      <h3 className="item-title">{item.categoryName}</h3>
      <div className="meta">{item.skills.filter(Boolean).join(", ")}</div>
    </div>
  );
}
