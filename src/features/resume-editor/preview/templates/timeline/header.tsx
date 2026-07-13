import { createPhotoHeader } from "@/features/resume-editor/preview/templates/_shared/create-photo-header";

import styles from "./styles.module.css";

export const TimelineHeader = createPhotoHeader({
  dataTemplate: "timeline",
  styles,
});
