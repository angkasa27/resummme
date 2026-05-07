import { classicCenteredLayout } from "@/features/resume-editor/preview/layouts/classic-centered/definition";
import { modernBlockLayout } from "@/features/resume-editor/preview/layouts/modern-block/definition";
import { sidebarHeadingsLayout } from "@/features/resume-editor/preview/layouts/sidebar-headings/definition";
import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";

import type { PreviewDocumentLayoutDefinition } from "./types";

export const previewLayoutDefinitions = [
  sidebarHeadingsLayout,
  classicCenteredLayout,
  modernBlockLayout,
] as const satisfies ReadonlyArray<PreviewDocumentLayoutDefinition>;

export function createPreviewLayoutRegistry(
  definitions: ReadonlyArray<PreviewDocumentLayoutDefinition> = previewLayoutDefinitions,
) {
  return new Map(definitions.map((definition) => [definition.id, definition]));
}

export function getPreviewLayoutDefinition(
  layoutId: PdfLayoutId,
  definitions: ReadonlyArray<PreviewDocumentLayoutDefinition> = previewLayoutDefinitions,
) {
  const registry = createPreviewLayoutRegistry(definitions);
  const definition = registry.get(layoutId);

  if (!definition) {
    return registry.get("sidebar-headings") ?? definitions[0];
  }

  return definition;
}
