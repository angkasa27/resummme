import {
  getOrderedVisibleSectionKeys,
  isCollectionSectionKey,
  sectionLabels,
  type CollectionSectionKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import { resolvePdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import {
  sanitizeRichTextHref,
  sanitizeRichTextHtml,
} from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

import { sectionDescriptors } from "./sections";
import type {
  AnyPreviewRenderableSection,
  PreviewMode,
  PreviewRenderContext,
  PreviewSectionItemMap,
} from "./types";

export function renderHtml(content: string) {
  return { __html: sanitizeRichTextHtml(content) };
}

export function richTextHasContent(value: string) {
  if (!value) return false;
  return (
    value
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim().length > 0
  );
}

function createContactItems(draft: ResumeDraft) {
  return [
    { kind: "text" as const, value: draft.profile.location },
    { kind: "text" as const, value: draft.profile.phone },
    { kind: "text" as const, value: draft.profile.email },
    ...draft.profile.extraLinks
      .map((link) => sanitizeRichTextHref(link.url))
      .filter((value): value is string => Boolean(value))
      .map((value) => ({ kind: "link" as const, value })),
  ].filter((item) => Boolean(item.value));
}

function buildRenderableSection<K extends CollectionSectionKey>(
  sectionKey: K,
  draft: ResumeDraft,
): AnyPreviewRenderableSection | null {
  const descriptor = sectionDescriptors[sectionKey];
  const items = (draft.sections[sectionKey].items as PreviewSectionItemMap[K][]).filter(
    (item) => descriptor.hasContent(item as never),
  );
  if (items.length === 0) return null;

  return {
    key: sectionKey,
    label: sectionLabels[sectionKey],
    heading: descriptor.defaultHeading,
    items,
  } as AnyPreviewRenderableSection;
}

function createRenderableSections(
  draft: ResumeDraft,
): AnyPreviewRenderableSection[] {
  const out: AnyPreviewRenderableSection[] = [];
  for (const sectionKey of getOrderedVisibleSectionKeys(draft.sections)) {
    if (!isCollectionSectionKey(sectionKey)) continue;
    const section = buildRenderableSection(sectionKey, draft);
    if (section) out.push(section);
  }
  return out;
}

export function createPreviewRenderContext(
  draft: ResumeDraft,
  mode: PreviewMode,
): PreviewRenderContext {
  return {
    draft,
    mode,
    presentation: resolvePdfPresentation(draft.pdfPresentation),
    contactItems: createContactItems(draft),
    summaryContent: richTextHasContent(draft.sections.summary.content)
      ? draft.sections.summary.content
      : null,
    sections: createRenderableSections(draft),
  };
}
