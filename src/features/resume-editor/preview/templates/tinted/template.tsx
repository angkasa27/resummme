import { createSingleColumnTemplate } from "@/features/resume-editor/preview/templates/_shared/create-single-column-template";

import { TintedHeader } from "./header";
import { tintedItemViews } from "./items";
import styles from "./styles.module.css";

export const tintedTemplate = createSingleColumnTemplate({
  id: "tinted",
  label: "Tinted",
  description:
    "Soft color-tinted header block, chip-style section headings, and skill tags as pills.",
  styles,
  Header: TintedHeader,
  itemViews: tintedItemViews,
});
