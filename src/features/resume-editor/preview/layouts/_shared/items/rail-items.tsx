import { commaJoin } from "@/features/resume-editor/preview/helpers/string";
import type { SectionItem } from "@/features/resume-editor/preview/sections/types";

/**
 * Skills/Languages item renderers for the side-rail layouts (sidebar, split).
 * These deliberately differ from the canonical `_shared/items` versions: the
 * skills line has NO `.meta` wrapper and languages drop `.item-row` + guard an
 * empty proficiency, because the rail stacks item headers vertically. Shared
 * between sidebar and split only — do not swap in the canonical versions
 * (different DOM/CSS).
 */
export function RailSkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <div className="item">
      <h3 className="item-title">{item.categoryName}</h3>
      <div>{commaJoin(item.skills)}</div>
    </div>
  );
}

export function RailLanguagesItem({
  item,
}: {
  item: SectionItem<"languages">;
}) {
  return (
    <div className="item">
      <h3 className="item-title">{item.language}</h3>
      {item.proficiency ? <div className="meta">{item.proficiency}</div> : null}
    </div>
  );
}
