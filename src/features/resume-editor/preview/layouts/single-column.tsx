import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type {
  LayoutComponentProps,
  PreviewLayoutDefinition,
  PreviewRenderContext,
} from "@/features/resume-editor/preview/types";

import styles from "../resume-document.module.css";

export function SingleColumnHeader({
  context,
}: {
  context: PreviewRenderContext;
}) {
  const { draft } = context;
  return (
    <header
      className={`${styles.headerSingleColumn} layout-header`}
      data-layout="single-column"
    >
      {draft.profile.photo ? (
        <div className="header-photo" data-slot="photo-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={draft.profile.photo} alt={draft.profile.fullName} />
        </div>
      ) : null}
      <div className="header-body">
        <h1 className="name" data-testid="resume-preview-full-name">
          {draft.profile.fullName}
        </h1>
        <PreviewContactLine context={context} />
      </div>
    </header>
  );
}

function SingleColumnLayout({ slots }: LayoutComponentProps) {
  return (
    <div className={styles.layoutSingleColumn}>
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

export const singleColumnLayout: PreviewLayoutDefinition = {
  id: "single-column",
  Component: SingleColumnLayout,
};
