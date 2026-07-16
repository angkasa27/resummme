import { createPhotoHeader } from "@/features/resume-editor/preview/layouts/_shared/create-photo-header";

import styles from "./styles.module.css";

export const ClassicHeader = createPhotoHeader({
  dataLayout: "classic",
  styles,
});
