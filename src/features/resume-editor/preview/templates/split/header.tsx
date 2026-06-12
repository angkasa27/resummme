import type { TemplateHeaderProps } from "@/features/resume-editor/preview/template-types";

import styles from "./styles.module.css";

/* Name only — the split template renders contacts inside the colored rail. */
export function SplitHeader({ context }: TemplateHeaderProps) {
  const { draft } = context;
  return (
    <header className={`${styles.header} layout-header`} data-template="split">
      <h1 className="name" data-testid="resume-preview-full-name">
        {draft.profile.fullName}
      </h1>
    </header>
  );
}
