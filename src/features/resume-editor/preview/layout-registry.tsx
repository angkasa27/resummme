import type { ReactNode } from "react";

import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";

import { singleColumnLayout, SingleColumnHeader } from "./layouts/single-column";
import { twoColumnLayout, TwoColumnHeader } from "./layouts/two-column";
import type {
  PreviewLayoutDefinition,
  PreviewRenderContext,
} from "./types";

export const previewLayoutDefinitions = [
  singleColumnLayout,
  twoColumnLayout,
] as const satisfies ReadonlyArray<PreviewLayoutDefinition>;

export function getPreviewLayoutDefinition(
  layoutId: PdfLayoutId,
): PreviewLayoutDefinition {
  return (
    previewLayoutDefinitions.find((layout) => layout.id === layoutId) ??
    previewLayoutDefinitions[0]
  );
}

export function renderLayoutHeader(context: PreviewRenderContext): ReactNode {
  if (context.presentation.layoutId === "two-column") {
    return <TwoColumnHeader context={context} />;
  }
  return <SingleColumnHeader context={context} />;
}
