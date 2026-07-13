import { createSingleColumnTemplate } from "@/features/resume-editor/preview/templates/_shared/create-single-column-template";

import { BoldTypeHeader } from "./header";
import { boldTypeItemViews } from "./items";
import styles from "./styles.module.css";

export const boldTypeTemplate = createSingleColumnTemplate({
  id: "bold-type",
  label: "Bold Type",
  description:
    "Editorial layout with an oversized name, heavy rules, and highlight-marker section headings.",
  styles,
  Header: BoldTypeHeader,
  itemViews: boldTypeItemViews,
});
