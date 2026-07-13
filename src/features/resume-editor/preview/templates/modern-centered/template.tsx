import { createSingleColumnTemplate } from "@/features/resume-editor/preview/templates/_shared/create-single-column-template";

import { ModernCenteredHeader } from "./header";
import { modernCenteredItemViews } from "./items";
import styles from "./styles.module.css";

export const modernCenteredTemplate = createSingleColumnTemplate({
  id: "modern-centered",
  label: "Modern",
  description:
    "Hairline accent rule under section headings; item headers stack vertically.",
  styles,
  Header: ModernCenteredHeader,
  itemViews: modernCenteredItemViews,
});
