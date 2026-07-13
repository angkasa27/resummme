import type {
  PreviewTemplateDefinition,
  TemplateComponentProps,
} from "@/features/resume-editor/preview/template-types";

import { BannerHeader } from "./header";
import { bannerItemViews } from "./items";
import styles from "./styles.module.css";

function BannerTemplate({ slots }: TemplateComponentProps) {
  return (
    <div className={styles.template}>
      {slots.header}
      <div className="layout-body">
        {slots.summary}
        {slots.sections.map(({ key, node }) => (
          <div key={key}>{node}</div>
        ))}
      </div>
    </div>
  );
}

export const bannerTemplate: PreviewTemplateDefinition = {
  id: "banner",
  label: "Banner",
  description:
    "Bold solid-color header band with the name and contacts inside, and a circular photo overlapping its edge.",
  hideSummaryHeading: true,
  Component: BannerTemplate,
  Header: BannerHeader,
  itemViews: bannerItemViews,
};
