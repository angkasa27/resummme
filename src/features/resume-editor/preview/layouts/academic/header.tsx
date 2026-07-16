import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";

export function AcademicHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;
  return (
    <header
      className={`${styles.header} layout-header`}
      data-layout="academic"
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
