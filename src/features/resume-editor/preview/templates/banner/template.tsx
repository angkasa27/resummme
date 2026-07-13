import { createSingleColumnTemplate } from "@/features/resume-editor/preview/templates/_shared/create-single-column-template";

import { BannerHeader } from "./header";
import { bannerItemViews } from "./items";
import styles from "./styles.module.css";

export const bannerTemplate = createSingleColumnTemplate({
  id: "banner",
  label: "Banner",
  description:
    "Bold solid-color header band with the name and contacts inside, and a circular photo overlapping its edge.",
  hideSummaryHeading: true,
  styles,
  Header: BannerHeader,
  itemViews: bannerItemViews,
});
