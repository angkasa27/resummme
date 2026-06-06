import type { ReactNode } from "react";

import type { PdfTemplateId } from "@/features/resume-editor/domain/presentation/pdf-presentation";

import { academicTemplate } from "./templates/academic/template";
import { AcademicHeader } from "./templates/academic/header";
import { classicTemplate } from "./templates/classic/template";
import { ClassicHeader } from "./templates/classic/header";
import { insetTemplate } from "./templates/inset/template";
import { InsetHeader } from "./templates/inset/header";
import { minimalTemplate } from "./templates/minimal/template";
import { MinimalHeader } from "./templates/minimal/header";
import { modernCenteredTemplate } from "./templates/modern-centered/template";
import { ModernCenteredHeader } from "./templates/modern-centered/header";
import { sidebarTemplate } from "./templates/sidebar/template";
import { SidebarHeader } from "./templates/sidebar/header";
import { timelineTemplate } from "./templates/timeline/template";
import { TimelineHeader } from "./templates/timeline/header";
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
] as const satisfies ReadonlyArray<PreviewTemplateDefinition>;

export function getTemplate(
  templateId: PdfTemplateId,
): PreviewTemplateDefinition {
  return (
    previewTemplateDefinitions.find((template) => template.id === templateId) ??
    previewTemplateDefinitions[0]
  );
}

export function renderTemplateHeader(context: PreviewRenderContext): ReactNode {
  switch (context.presentation.templateId) {
    case "sidebar":
      return <SidebarHeader context={context} />;
    case "modern-centered":
      return <ModernCenteredHeader context={context} />;
    case "timeline":
      return <TimelineHeader context={context} />;
    case "academic":
      return <AcademicHeader context={context} />;
    case "minimal":
      return <MinimalHeader context={context} />;
    case "inset":
      return <InsetHeader context={context} />;
    case "classic":
    default:
      return <ClassicHeader context={context} />;
  }
}
