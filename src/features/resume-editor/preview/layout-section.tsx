import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";

import type {
  AnyPreviewRenderableSection,
  PreviewRenderableSection,
} from "./types";
import type { SectionItem } from "./descriptors/types";
import type {
  PreviewLayoutDefinition,
  LayoutSectionItemMap,
} from "./layout-types";

type LayoutSectionProps = {
  layout: PreviewLayoutDefinition;
  section: AnyPreviewRenderableSection;
};

export function LayoutSection({ layout, section }: LayoutSectionProps) {
  return renderSectionBody(layout.itemViews, section);
}

function renderSectionBody<K extends CollectionSectionKey>(
  itemViews: LayoutSectionItemMap,
  section: PreviewRenderableSection<K>,
) {
  const ItemView = itemViews[section.key] as (props: {
    item: SectionItem<K>;
  }) => React.ReactNode;
  return (
    <section className="section" data-section={section.key}>
      <h2
        className="section-heading"
        data-testid="resume-preview-section-heading"
      >
        {section.heading}
      </h2>
      <div className="item-list">
        {section.items.map((item) => (
          <ItemView key={(item as { id: string }).id} item={item} />
        ))}
      </div>
    </section>
  );
}
