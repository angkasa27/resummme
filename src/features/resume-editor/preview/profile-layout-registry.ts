import type { PdfProfileLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { centeredPortraitProfileLayout } from "@/features/resume-editor/preview/profile-layouts/centered-portrait-profile";
import { sidebarProfileLayout } from "@/features/resume-editor/preview/profile-layouts/sidebar-profile";
import type { PreviewProfileLayoutDefinition } from "@/features/resume-editor/preview/types";

export const previewProfileLayoutDefinitions = [
  sidebarProfileLayout,
  centeredPortraitProfileLayout,
] as const satisfies ReadonlyArray<PreviewProfileLayoutDefinition>;

export function createPreviewProfileLayoutRegistry(
  definitions: ReadonlyArray<PreviewProfileLayoutDefinition> = previewProfileLayoutDefinitions,
) {
  return new Map(definitions.map((definition) => [definition.id, definition]));
}

export function getPreviewProfileLayoutDefinition(
  profileLayoutId: PdfProfileLayoutId,
  definitions: ReadonlyArray<PreviewProfileLayoutDefinition> = previewProfileLayoutDefinitions,
) {
  const registry = createPreviewProfileLayoutRegistry(definitions);
  const definition = registry.get(profileLayoutId);

  if (!definition) {
    return registry.get("sidebar-profile") ?? definitions[0];
  }

  return definition;
}
