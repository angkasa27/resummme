import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

/** Strip HTML tags + entities, collapse whitespace. */
export function stripRichText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Split rich-text into bullet/paragraph strings. Splits on </p> and </li>
 * to preserve the document's intent. Empty entries are dropped.
 */
export function extractBullets(html: string): string[] {
  if (!html) return [];
  return html
    .split(/<\/(?:li|p)>/i)
    .map((chunk) => stripRichText(chunk))
    .filter((text) => text.length > 0);
}

type TextSectionConfig<T> = {
  items: readonly T[];
  fields: (item: T) => string[];
  description?: (item: T) => string;
};

/** Push an item's plain fields (and stripped description, if any) onto `parts`.
 *  Empty strings are left in place — the caller does one trailing filter. */
function collectSectionText<T>(parts: string[], config: TextSectionConfig<T>) {
  for (const item of config.items) {
    parts.push(...config.fields(item));
    if (config.description) {
      parts.push(stripRichText(config.description(item)));
    }
  }
}

/** Flatten the whole draft into one plain-text blob for keyword matching. */
export function extractResumeText(draft: ResumeDraft): string {
  const parts: string[] = [];
  const { profile, sections } = draft;

  parts.push(profile.fullName, profile.location, profile.email);
  for (const link of profile.extraLinks) parts.push(link.url);

  if (sections.summary.visible) {
    parts.push(stripRichText(sections.summary.content));
  }

  collectSectionText(parts, {
    items: sections.workExperience.items,
    fields: (item) => [item.position, item.companyName, item.location],
    description: (item) => item.description,
  });
  collectSectionText(parts, {
    items: sections.skills.items,
    fields: (item) => [item.categoryName, item.skills.join(" ")],
  });
  collectSectionText(parts, {
    items: sections.projects.items,
    fields: (item) => [item.projectName],
    description: (item) => item.description,
  });
  collectSectionText(parts, {
    items: sections.education.items,
    fields: (item) => [item.degree, item.name, item.location],
    description: (item) => item.description,
  });
  collectSectionText(parts, {
    items: sections.publications.items,
    fields: (item) => [item.title, item.publisher],
    description: (item) => item.description,
  });
  collectSectionText(parts, {
    items: sections.certifications.items,
    fields: (item) => [
      item.certificationName,
      item.issuingOrganization,
      item.credentialId ?? "",
    ],
  });
  collectSectionText(parts, {
    items: sections.awards.items,
    fields: (item) => [item.title, item.issuer],
    description: (item) => item.description,
  });
  collectSectionText(parts, {
    items: sections.languages.items,
    fields: (item) => [item.language, item.proficiency],
  });
  collectSectionText(parts, {
    items: sections.references.items,
    fields: (item) => [item.name, item.background, item.contactDetails],
  });
  collectSectionText(parts, {
    items: sections.organizationVolunteering.items,
    fields: (item) => [item.position, item.organizationName, item.location],
    description: (item) => item.description,
  });

  return parts.filter(Boolean).join(" ");
}

/** Gather every bullet across narrative sections for content-quality scoring. */
export function extractAllBullets(draft: ResumeDraft): string[] {
  const bullets: string[] = [];
  for (const item of draft.sections.workExperience.items) {
    bullets.push(...extractBullets(item.description));
  }
  for (const item of draft.sections.projects.items) {
    bullets.push(...extractBullets(item.description));
  }
  for (const item of draft.sections.education.items) {
    bullets.push(...extractBullets(item.description));
  }
  for (const item of draft.sections.organizationVolunteering.items) {
    bullets.push(...extractBullets(item.description));
  }
  for (const item of draft.sections.awards.items) {
    bullets.push(...extractBullets(item.description));
  }
  return bullets;
}
