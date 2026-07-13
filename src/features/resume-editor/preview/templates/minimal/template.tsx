import { createSingleColumnTemplate } from "@/features/resume-editor/preview/templates/_shared/create-single-column-template";

import { MinimalHeader } from "./header";
import { minimalItemViews } from "./items";
import styles from "./styles.module.css";

export const minimalTemplate = createSingleColumnTemplate({
  id: "minimal",
  label: "Minimal",
  description:
    "Clean single-column layout with no borders or decorative elements. Just content.",
  styles,
  Header: MinimalHeader,
  itemViews: minimalItemViews,
});
