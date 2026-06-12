import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type { TemplateHeaderProps } from "@/features/resume-editor/preview/template-types";

import styles from "./styles.module.css";

export function BannerHeader({ context }: TemplateHeaderProps) {
  const { draft } = context;
  const headerClass = draft.profile.photo
    ? `${styles.header} ${styles.hasPhoto}`
    : styles.header;
  return (
    <header className={`${headerClass} layout-header`} data-template="banner">
      <div className="banner-band">
        <div className="header-body">
          <h1 className="name" data-testid="resume-preview-full-name">
            {draft.profile.fullName}
          </h1>
          <PreviewContactLine context={context} />
        </div>
        {draft.profile.photo ? (
          <div className="header-photo" data-slot="photo-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={draft.profile.photo} alt={draft.profile.fullName} />
          </div>
        ) : null}
      </div>
    </header>
  );
}
