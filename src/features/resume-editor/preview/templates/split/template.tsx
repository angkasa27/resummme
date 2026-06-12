import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type {
  LayoutColumn,
  PreviewTemplateDefinition,
  TemplateComponentProps,
} from "@/features/resume-editor/preview/template-types";

import { SplitHeader } from "./header";
import { splitItemViews } from "./items";
import styles from "./styles.module.css";

const SIDE_SECTIONS = new Set<CollectionSectionKey>([
  "skills",
  "languages",
  "certifications",
  "references",
]);

function getColumn(sectionKey: CollectionSectionKey): LayoutColumn {
  return SIDE_SECTIONS.has(sectionKey) ? "side" : "main";
}

function SplitTemplate({ context, slots }: TemplateComponentProps) {
  const side: typeof slots.sections = [];
  const main: typeof slots.sections = [];
  for (const entry of slots.sections) {
    (getColumn(entry.key) === "side" ? side : main).push(entry);
  }
  const { photo, fullName } = context.draft.profile;

  return (
    <div className={styles.template}>
      <div className="layout-side">
        {photo ? (
          <div className="side-photo" data-slot="photo-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={fullName} />
          </div>
        ) : null}
        <PreviewContactLine context={context} />
        {side.map(({ key, node }) => (
          <div key={key}>{node}</div>
        ))}
      </div>
      <div className="layout-main">
        {slots.header}
        {slots.summary}
        {main.map(({ key, node }) => (
          <div key={key}>{node}</div>
        ))}
      </div>
    </div>
  );
}

export const splitTemplate: PreviewTemplateDefinition = {
  id: "split",
  label: "Split",
  description:
    "Full-height colored rail with photo, contacts, and skills beside a clean main column.",
  Component: SplitTemplate,
  Header: SplitHeader,
  itemViews: splitItemViews,
  getColumn,
};
