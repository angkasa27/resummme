import { classicCenteredLayout } from "@/features/resume-editor/preview/layouts/classic-centered";
import { sidebarHeadingsLayout } from "@/features/resume-editor/preview/layouts/sidebar-headings";
import type { PdfLayoutId } from "@/lib/resume/pdf-presentation";

import type { PreviewLayoutDefinition } from "./types";

export const previewLayoutDefinitions = [
  sidebarHeadingsLayout,
  classicCenteredLayout,
] as const satisfies ReadonlyArray<PreviewLayoutDefinition>;

export function createPreviewLayoutRegistry(
  definitions: ReadonlyArray<PreviewLayoutDefinition> = previewLayoutDefinitions,
) {
  return new Map(definitions.map((definition) => [definition.id, definition]));
}

export function getPreviewLayoutDefinition(
  layoutId: PdfLayoutId,
  definitions: ReadonlyArray<PreviewLayoutDefinition> = previewLayoutDefinitions,
) {
  const registry = createPreviewLayoutRegistry(definitions);
  const definition = registry.get(layoutId);

  if (!definition) {
    return registry.get("sidebar-headings") ?? definitions[0];
  }

  return definition;
}
