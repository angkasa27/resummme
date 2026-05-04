import {
  getOrderedVisibleSectionKeys,
  isCollectionSectionKey,
  sectionLabels,
  type CollectionSectionKey,
} from "@/features/resume-editor/config/section-metadata";
import { resolvePdfPresentation } from "@/lib/resume/pdf-presentation";
import {
  sanitizeRichTextHref,
  sanitizeRichTextHtml,
} from "@/lib/resume/sanitize-rich-text";
import type { ResumeDraft } from "@/lib/resume/schema";

import type {
  AnyPreviewRenderableSection,
  PreviewMode,
  PreviewRenderContext,
  PreviewSectionItemMap,
} from "@/features/resume-editor/preview/types";

export function renderHtml(content: string) {
  return { __html: sanitizeRichTextHtml(content) };
}

export function richTextHasContent(value: string) {
  return (
    value
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim().length > 0
  );
}

export function hasRenderableItem(
  sectionKey: keyof ResumeDraft["sections"],
  item: unknown,
) {
  if (sectionKey === "summary") {
    return false;
  }

  if (sectionKey === "workExperience") {
    const value =
      item as ResumeDraft["sections"]["workExperience"]["items"][number];
    return Boolean(
      value.companyName ||
        value.position ||
        value.location ||
        value.startDate ||
        value.endDate ||
        richTextHasContent(value.description),
    );
  }

  if (sectionKey === "skills") {
    const value = item as ResumeDraft["sections"]["skills"]["items"][number];
    return Boolean(value.categoryName || value.skills.some(Boolean));
  }

  if (sectionKey === "projects") {
    const value = item as ResumeDraft["sections"]["projects"]["items"][number];
    return Boolean(
      value.projectName ||
        value.projectLink ||
        value.startDate ||
        value.endDate ||
        richTextHasContent(value.description),
    );
  }

  if (sectionKey === "education") {
    const value = item as ResumeDraft["sections"]["education"]["items"][number];
    return Boolean(
      value.name ||
        value.location ||
        value.startDate ||
        value.endDate ||
        value.degree ||
        value.gpa ||
        richTextHasContent(value.description),
    );
  }

  if (sectionKey === "publications") {
    const value =
      item as ResumeDraft["sections"]["publications"]["items"][number];
    return Boolean(
      value.title ||
        value.publisher ||
        value.publicationUrl ||
        value.publicationDate ||
        richTextHasContent(value.description),
    );
  }

  if (sectionKey === "certifications") {
    const value =
      item as ResumeDraft["sections"]["certifications"]["items"][number];
    return Boolean(
      value.certificationName ||
        value.issuingOrganization ||
        value.issuedDate ||
        value.certificationLink ||
        value.credentialId,
    );
  }

  if (sectionKey === "awards") {
    const value = item as ResumeDraft["sections"]["awards"]["items"][number];
    return Boolean(
      value.title ||
        value.issuer ||
        value.issuedDate ||
        richTextHasContent(value.description),
    );
  }

  if (sectionKey === "languages") {
    const value = item as ResumeDraft["sections"]["languages"]["items"][number];
    return Boolean(value.language || value.proficiency);
  }

  if (sectionKey === "references") {
    const value =
      item as ResumeDraft["sections"]["references"]["items"][number];
    return Boolean(value.name || value.background || value.contactDetails);
  }

  if (sectionKey === "organizationVolunteering") {
    const value =
      item as ResumeDraft["sections"]["organizationVolunteering"]["items"][number];
    return Boolean(
      value.organizationName ||
        value.position ||
        value.location ||
        value.startDate ||
        value.endDate ||
        richTextHasContent(value.description),
    );
  }

  return false;
}

function formatSectionHeading(
  sectionLabel: string,
  layoutId: ResumeDraft["pdfPresentation"]["layoutId"],
) {
  return layoutId === "classic-centered"
    ? sectionLabel.toUpperCase()
    : sectionLabel;
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

function createRenderableSections(
  draft: ResumeDraft,
  layoutId: ResumeDraft["pdfPresentation"]["layoutId"],
): AnyPreviewRenderableSection[] {
  const sections: AnyPreviewRenderableSection[] = [];

  for (const sectionKey of getOrderedVisibleSectionKeys(draft.sections)) {
    if (!isCollectionSectionKey(sectionKey)) {
      continue;
    }

    const section = createRenderableSection(sectionKey, draft, layoutId);
    if (section) {
      sections.push(section);
    }
  }

  return sections;
}

function createRenderableSection<K extends CollectionSectionKey>(
  sectionKey: K,
  draft: ResumeDraft,
  layoutId: ResumeDraft["pdfPresentation"]["layoutId"],
) {
  const section = draft.sections[sectionKey];
  const items = section.items.filter((item) =>
    hasRenderableItem(sectionKey, item),
  ) as PreviewSectionItemMap[K][];

  if (items.length === 0) {
    return null;
  }

  return {
    key: sectionKey,
    label: sectionLabels[sectionKey],
    heading: formatSectionHeading(sectionLabels[sectionKey], layoutId),
    items,
  } as AnyPreviewRenderableSection;
}

export function createPreviewRenderContext(
  draft: ResumeDraft,
  mode: PreviewMode,
): PreviewRenderContext {
  const presentation = resolvePdfPresentation(draft.pdfPresentation);

  return {
    draft,
    mode,
    presentation,
    contactItems: createContactItems(draft),
    summaryContent: richTextHasContent(draft.sections.summary.content)
      ? draft.sections.summary.content
      : null,
    sections: createRenderableSections(draft, presentation.layoutId),
  };
}
