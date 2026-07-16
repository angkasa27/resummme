import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

import styles from "./styles.module.css";

/* Name only — the split layout renders contacts inside the colored rail. */
export function SplitHeader({ context }: LayoutHeaderProps) {
  const { draft } = context;
  return (
    <header className={`${styles.header} layout-header`} data-layout="split">
      <h1 className="name" data-testid="resume-preview-full-name">
        {draft.profile.fullName}
      </h1>
    </header>
  );
}
