import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type { TemplateHeaderProps } from "@/features/resume-editor/preview/template-types";

import styles from "./styles.module.css";

export function MinimalHeader({ context }: TemplateHeaderProps) {
  const { draft } = context;
  return (
    <header className={`${styles.header} layout-header`} data-template="minimal">
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
