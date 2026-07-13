import type { ReactNode } from "react";

import type { PdfTemplateId } from "@/features/resume-editor/domain/presentation/pdf-presentation";

import { academicTemplate } from "./templates/academic/template";
import { bannerTemplate } from "./templates/banner/template";
import { boldTypeTemplate } from "./templates/bold-type/template";
import { classicTemplate } from "./templates/classic/template";
import { insetTemplate } from "./templates/inset/template";
import { minimalTemplate } from "./templates/minimal/template";
import { modernCenteredTemplate } from "./templates/modern-centered/template";
import { sidebarTemplate } from "./templates/sidebar/template";
import { splitTemplate } from "./templates/split/template";
import { timelineTemplate } from "./templates/timeline/template";
import { tintedTemplate } from "./templates/tinted/template";
import type { PreviewTemplateDefinition } from "./template-types";
import type { PreviewRenderContext } from "./types";

export const previewTemplateDefinitions = [
  classicTemplate,
  sidebarTemplate,
  modernCenteredTemplate,
  timelineTemplate,
  academicTemplate,
  minimalTemplate,
  insetTemplate,
  bannerTemplate,
  splitTemplate,
  tintedTemplate,
  boldTypeTemplate,
] as const satisfies ReadonlyArray<PreviewTemplateDefinition>;

// Compile-time guard: the registry must cover `pdfTemplateIds` (the domain
// SSOT that feeds the zod enum) exactly — same id set, no missing/extra/renamed
// entries. Drift on either side is a type error, which keeps future culling
// lockstep-safe. (Ordering is asserted by template-registry.test.ts.)
type RegistryId = (typeof previewTemplateDefinitions)[number]["id"];
type AssertEqual<A, B> = [A] extends [B]
  ? [B] extends [A]
    ? true
    : never
  : never;
const _registryCoversTemplateIds: AssertEqual<RegistryId, PdfTemplateId> = true;
void _registryCoversTemplateIds;

export function getTemplate(
  templateId: PdfTemplateId,
): PreviewTemplateDefinition {
  return (
    previewTemplateDefinitions.find((template) => template.id === templateId) ??
    previewTemplateDefinitions[0]
  );
}

// Single source of truth so canvas live-preview and the exported PDF never
// disagree on whether a template renders its own Summary heading.
export function shouldHideSummaryHeading(templateId: PdfTemplateId): boolean {
  return getTemplate(templateId).hideSummaryHeading === true;
}

export function renderTemplateHeader(context: PreviewRenderContext): ReactNode {
  const { Header } = getTemplate(context.presentation.templateId);
  return <Header context={context} />;
}
