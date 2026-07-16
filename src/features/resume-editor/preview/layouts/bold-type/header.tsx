import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";

export function BoldTypeHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;
  return (
    <header
      className={`${styles.header} layout-header`}
      data-layout="bold-type"
    >
      {/* Contacts sit inside header-top, so the rule is drawn under the whole
          block rather than between the name and its own contact details —
          which left the name floating above dead space beside the photo. */}
      <div className="header-top">
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
