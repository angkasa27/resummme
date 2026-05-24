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

/** Flatten the whole draft into one plain-text blob for keyword matching. */
export function extractResumeText(draft: ResumeDraft): string {
  const parts: string[] = [];

  const { profile, sections } = draft;
  if (profile.fullName) parts.push(profile.fullName);
  if (profile.location) parts.push(profile.location);
  if (profile.email) parts.push(profile.email);
  for (const link of profile.extraLinks) {
    if (link.url) parts.push(link.url);
  }

  if (sections.summary.visible) {
    parts.push(stripRichText(sections.summary.content));
  }

  for (const item of sections.workExperience.items) {
    parts.push(item.position, item.companyName, item.location);
    parts.push(stripRichText(item.description));
  }
  for (const item of sections.skills.items) {
    parts.push(item.categoryName, item.skills.join(" "));
  }
  for (const item of sections.projects.items) {
    parts.push(item.projectName);
    parts.push(stripRichText(item.description));
  }
  for (const item of sections.education.items) {
    parts.push(item.degree, item.name, item.location);
    parts.push(stripRichText(item.description));
  }
  for (const item of sections.publications.items) {
    parts.push(item.title, item.publisher);
    parts.push(stripRichText(item.description));
  }
  for (const item of sections.certifications.items) {
    parts.push(item.certificationName, item.issuingOrganization);
    if (item.credentialId) parts.push(item.credentialId);
  }
  for (const item of sections.awards.items) {
    parts.push(item.title, item.issuer);
    parts.push(stripRichText(item.description));
  }
  for (const item of sections.languages.items) {
    parts.push(item.language, item.proficiency);
  }
  for (const item of sections.references.items) {
    parts.push(item.name, item.background, item.contactDetails);
  }
  for (const item of sections.organizationVolunteering.items) {
    parts.push(item.position, item.organizationName, item.location);
    parts.push(stripRichText(item.description));
  }

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
