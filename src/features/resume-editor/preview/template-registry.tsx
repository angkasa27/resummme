import type { ReactNode } from "react";

import type { PdfTemplateId } from "@/features/resume-editor/domain/presentation/pdf-presentation";

import { academicTemplate } from "./templates/academic/template";
import { AcademicHeader } from "./templates/academic/header";
import { bannerTemplate } from "./templates/banner/template";
import { BannerHeader } from "./templates/banner/header";
import { boldTypeTemplate } from "./templates/bold-type/template";
import { BoldTypeHeader } from "./templates/bold-type/header";
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
import { splitTemplate } from "./templates/split/template";
import { SplitHeader } from "./templates/split/header";
import { timelineTemplate } from "./templates/timeline/template";
import { TimelineHeader } from "./templates/timeline/header";
import { tintedTemplate } from "./templates/tinted/template";
import { TintedHeader } from "./templates/tinted/header";
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
  return (
    templateId === "classic" ||
    templateId === "timeline" ||
    templateId === "banner"
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
    case "banner":
      return <BannerHeader context={context} />;
    case "split":
      return <SplitHeader context={context} />;
    case "tinted":
      return <TintedHeader context={context} />;
    case "bold-type":
      return <BoldTypeHeader context={context} />;
    case "classic":
    default:
      return <ClassicHeader context={context} />;
  }
}
