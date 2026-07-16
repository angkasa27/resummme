import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type {
  LayoutColumn,
  PreviewLayoutDefinition,
  LayoutComponentProps,
} from "@/features/resume-editor/preview/layout-types";

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

function SplitLayout({ context, slots }: LayoutComponentProps) {
  const side: typeof slots.sections = [];
  const main: typeof slots.sections = [];
  for (const entry of slots.sections) {
    (getColumn(entry.key) === "side" ? side : main).push(entry);
  }
  const { photo, fullName } = context.draft.profile;

  return (
    <div className={styles.layout}>
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

export const splitLayout: PreviewLayoutDefinition = {
  id: "split",
  label: "Split",
  description:
    "Full-height colored rail with photo, contacts, and skills beside a clean main column.",
  Component: SplitLayout,
  Header: SplitHeader,
  itemViews: splitItemViews,
  getColumn,
};
