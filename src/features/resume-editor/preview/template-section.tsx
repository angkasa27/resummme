import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";

import type {
  AnyPreviewRenderableSection,
  PreviewRenderableSection,
} from "./types";
import type { SectionItem } from "./sections/types";
import type {
  PreviewTemplateDefinition,
  TemplateSectionItemMap,
} from "./template-types";

type TemplateSectionProps = {
  template: PreviewTemplateDefinition;
  section: AnyPreviewRenderableSection;
};

export function TemplateSection({ template, section }: TemplateSectionProps) {
  return renderSectionBody(template.itemViews, section);
}

function renderSectionBody<K extends CollectionSectionKey>(
  itemViews: TemplateSectionItemMap,
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
