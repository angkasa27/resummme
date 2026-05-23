import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type {
  LayoutColumn,
  LayoutComponentProps,
  PreviewLayoutDefinition,
  PreviewRenderContext,
} from "@/features/resume-editor/preview/types";

import styles from "../resume-document.module.css";

const sideSections = new Set<CollectionSectionKey>([
  "skills",
  "languages",
  "certifications",
  "references",
]);

function getColumn(sectionKey: CollectionSectionKey): LayoutColumn {
  return sideSections.has(sectionKey) ? "side" : "main";
}

export function TwoColumnHeader({
  context,
}: {
  context: PreviewRenderContext;
}) {
  const { draft } = context;
  return (
    <header
      className={`${styles.headerTwoColumn} layout-header`}
      data-layout="two-column"
    >
      {draft.profile.photo ? (
        <div className="header-photo" data-slot="photo-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={draft.profile.photo} alt={draft.profile.fullName} />
        </div>
      ) : null}
      <h1 className="name" data-testid="resume-preview-full-name">
        {draft.profile.fullName}
      </h1>
      <PreviewContactLine context={context} />
    </header>
  );
}

function TwoColumnLayout({ slots }: LayoutComponentProps) {
  const side: typeof slots.sections = [];
  const main: typeof slots.sections = [];
  for (const entry of slots.sections) {
    (getColumn(entry.key) === "side" ? side : main).push(entry);
  }

  return (
    <div className={styles.layoutTwoColumn}>
      {slots.header}
      <div className="layout-body">
        <div className="layout-side">
          {side.map(({ key, node }) => (
            <div key={key}>{node}</div>
          ))}
        </div>
        <div className="layout-main">
          {slots.summary}
          {main.map(({ key, node }) => (
            <div key={key}>{node}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const twoColumnLayout: PreviewLayoutDefinition = {
  id: "two-column",
  Component: TwoColumnLayout,
  getColumn,
};
