import type { ReactNode } from "react";

import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";

import { academicLayout } from "./layouts/academic/layout";
import { bannerLayout } from "./layouts/banner/layout";
import { boldTypeLayout } from "./layouts/bold-type/layout";
import { classicLayout } from "./layouts/classic/layout";
import { insetLayout } from "./layouts/inset/layout";
import { minimalLayout } from "./layouts/minimal/layout";
import { modernCenteredLayout } from "./layouts/modern-centered/layout";
import { sidebarLayout } from "./layouts/sidebar/layout";
import { splitLayout } from "./layouts/split/layout";
import { timelineLayout } from "./layouts/timeline/layout";
import type { PreviewLayoutDefinition } from "./layout-types";
import type { PreviewRenderContext } from "./types";

export const previewLayoutDefinitions = [
  classicLayout,
  sidebarLayout,
  modernCenteredLayout,
  timelineLayout,
  academicLayout,
  minimalLayout,
  insetLayout,
  bannerLayout,
  splitLayout,
  boldTypeLayout,
] as const satisfies ReadonlyArray<PreviewLayoutDefinition>;

// Compile-time guard: the registry must cover `pdfLayoutIds` (the domain
// SSOT that feeds the zod enum) exactly — same id set, no missing/extra/renamed
// entries. Drift on either side is a type error, which keeps future culling
// lockstep-safe. (Ordering is asserted by layout-registry.test.ts.)
type RegistryId = (typeof previewLayoutDefinitions)[number]["id"];
type AssertEqual<A, B> = [A] extends [B]
  ? [B] extends [A]
    ? true
    : never
  : never;
const _registryCoversLayoutIds: AssertEqual<RegistryId, PdfLayoutId> = true;
void _registryCoversLayoutIds;

export function getLayout(
  layoutId: PdfLayoutId,
): PreviewLayoutDefinition {
  return (
    previewLayoutDefinitions.find((layout) => layout.id === layoutId) ??
    previewLayoutDefinitions[0]
  );
}

// Single source of truth so canvas live-preview and the exported PDF never
// disagree on whether a layout renders its own Summary heading.
export function shouldHideSummaryHeading(layoutId: PdfLayoutId): boolean {
  return getLayout(layoutId).hideSummaryHeading === true;
}

export function renderLayoutHeader(context: PreviewRenderContext): ReactNode {
  const { Header } = getLayout(context.presentation.layoutId);
  return <Header context={context} />;
}
