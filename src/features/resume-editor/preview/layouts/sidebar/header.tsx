import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";

export function SidebarHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;
  return (
    <header className={`${styles.header} layout-header`} data-layout="sidebar">
      <div className="header-body">
        <h1 className="name" data-testid="resume-preview-full-name">
          {draft.profile.fullName}
        </h1>
        <PreviewContactLine context={context} />
      </div>
    </header>
  );
}
