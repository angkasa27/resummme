import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { createLocalId } from "@/features/resume-editor/domain/create-local-id";
import {
  languageProficiencyOptions,
  resumeSectionKeys,
  type CollectionSectionKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import { parseResumeDraft, type ResumeDraft } from "@/features/resume-editor/domain/schema";
import { sanitizeRichTextHtml, sanitizeRichTextHref } from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";
import { collectionSectionConfigs } from "@/features/resume-editor/editor/sections/config/collection-section-config";
import type { ImportedResume } from "@/features/resume-editor/server/imported-resume-schema";

type BuildImportedResumeDraftResult = {
  draft: ResumeDraft;
  warnings: string[];
};

const monthMap: Record<string, string> = {
  january: "Jan",
  jan: "Jan",
  february: "Feb",
  feb: "Feb",
  march: "Mar",
  mar: "Mar",
  april: "Apr",
  apr: "Apr",
  may: "May",
  june: "Jun",
  jun: "Jun",
  july: "Jul",
  jul: "Jul",
  august: "Aug",
  aug: "Aug",
  september: "Sep",
  sep: "Sep",
  sept: "Sep",
  october: "Oct",
  oct: "Oct",
  november: "Nov",
  nov: "Nov",
  december: "Dec",
  dec: "Dec",
};

function cleanText(value: string | undefined) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toRichTextParagraphs(values: string[]) {
  const cleanedValues = values.map(cleanText).filter(Boolean);

  if (cleanedValues.length === 0) {
    return "<p></p>";
  }

  return sanitizeRichTextHtml(
    cleanedValues.map((value) => `<p>${escapeHtml(value)}</p>`).join(""),
  );
}

function toRichTextBullets(values: string[]) {
  const cleanedValues = values.map(cleanText).filter(Boolean);

  if (cleanedValues.length === 0) {
    return "<p></p>";
  }

  return sanitizeRichTextHtml(
    `<ul>${cleanedValues.map((value) => `<li>${escapeHtml(value)}</li>`).join("")}</ul>`,
  );
}

function normalizeUrl(value: string) {
  const cleanedValue = cleanText(value);

  if (!cleanedValue) {
    return "";
  }

  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(cleanedValue)
    ? cleanedValue
    : `https://${cleanedValue.replace(/^\/+/, "")}`;

  return sanitizeRichTextHref(withProtocol) ?? "";
}

function normalizeDateValue(
  value: string,
  label: string,
  warnings: string[],
  allowCurrent = false,
) {
  const cleanedValue = cleanText(value);

  if (!cleanedValue) {
    return "";
  }

  if (allowCurrent && /^(current|present|now|ongoing)$/i.test(cleanedValue)) {
    return "current";
  }

  const monthYearMatch = cleanedValue.match(/^([A-Za-z]{3,9})\s+(\d{4})$/);
  if (monthYearMatch) {
    const month = monthMap[monthYearMatch[1].toLowerCase()];
    if (month) {
      return `${month} ${monthYearMatch[2]}`;
    }
  }

  const numberMonthMatch = cleanedValue.match(/^(\d{1,2})[/-](\d{4})$/);
  if (numberMonthMatch) {
    const monthNumber = Number(numberMonthMatch[1]);
    const month = Object.values(monthMap).filter(
      (value, index, array) => array.indexOf(value) === index,
    )[monthNumber - 1];

    if (month) {
      return `${month} ${numberMonthMatch[2]}`;
    }
  }

  const yearMonthMatch = cleanedValue.match(/^(\d{4})[/-](\d{1,2})$/);
  if (yearMonthMatch) {
    const monthNumber = Number(yearMonthMatch[2]);
    const month = Object.values(monthMap).filter(
      (value, index, array) => array.indexOf(value) === index,
    )[monthNumber - 1];

    if (month) {
      return `${month} ${yearMonthMatch[1]}`;
    }
  }

  warnings.push(`${label} used an unsupported date format and was left blank.`);
  return "";
}

function buildHiddenSection<K extends CollectionSectionKey>(sectionKey: K) {
  return {
    visible: false,
    order: resumeSectionKeys.indexOf(sectionKey),
    items: [collectionSectionConfigs[sectionKey].createItem()],
  } as ResumeDraft["sections"][K];
}

function dedupe(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

export function buildImportedResumeDraft(
  importedResume: ImportedResume,
): BuildImportedResumeDraftResult {
  const baseDraft = createDefaultResumeDraft();
  const warnings: string[] = [];

  const draft: ResumeDraft = {
    ...baseDraft,
    updatedAt: new Date().toISOString(),
    profile: {
      fullName: cleanText(importedResume.profile.fullName),
      location: cleanText(importedResume.profile.location),
      phone: cleanText(importedResume.profile.phone),
      email: cleanText(importedResume.profile.email),
      photo: "",
      extraLinks: dedupe(
        importedResume.profile.extraLinks.map(normalizeUrl),
      ).map((url) => ({
        id: createLocalId("profile-link"),
        url,
      })),
    },
    sections: {
      summary: {
        visible: importedResume.summary.some((paragraph) => cleanText(paragraph)),
        order: resumeSectionKeys.indexOf("summary"),
        content: toRichTextParagraphs(importedResume.summary),
      },
      workExperience: importedResume.workExperience.length
        ? {
            visible: true,
            order: resumeSectionKeys.indexOf("workExperience"),
            items: importedResume.workExperience.map((item) => ({
              id: createLocalId("work-experience"),
              companyName: cleanText(item.companyName),
              position: cleanText(item.position),
              location: cleanText(item.location),
              startDate: normalizeDateValue(
                item.startDate,
                `Work experience start date for ${item.companyName || item.position || "an entry"}`,
                warnings,
              ),
              endDate: normalizeDateValue(
                item.endDate,
                `Work experience end date for ${item.companyName || item.position || "an entry"}`,
                warnings,
                true,
              ),
              description: toRichTextBullets(item.highlights),
            })),
          }
        : buildHiddenSection("workExperience"),
      skills: importedResume.skills.length
        ? {
            visible: true,
            order: resumeSectionKeys.indexOf("skills"),
            items: importedResume.skills.map((item) => ({
              id: createLocalId("skill-category"),
              categoryName: cleanText(item.categoryName),
              skills: dedupe(item.skills.map(cleanText)),
            })),
          }
        : buildHiddenSection("skills"),
      projects: importedResume.projects.length
        ? {
            visible: true,
            order: resumeSectionKeys.indexOf("projects"),
            items: importedResume.projects.map((item) => ({
              id: createLocalId("project"),
              projectName: cleanText(item.projectName),
              projectLink: normalizeUrl(item.projectLink),
              startDate: normalizeDateValue(
                item.startDate,
                `Project start date for ${item.projectName || "an entry"}`,
                warnings,
              ),
              endDate: normalizeDateValue(
                item.endDate,
                `Project end date for ${item.projectName || "an entry"}`,
                warnings,
                true,
              ),
              description: toRichTextBullets(item.highlights),
            })),
          }
        : buildHiddenSection("projects"),
      education: importedResume.education.length
        ? {
            visible: true,
            order: resumeSectionKeys.indexOf("education"),
            items: importedResume.education.map((item) => ({
              id: createLocalId("education"),
              name: cleanText(item.name),
              location: cleanText(item.location),
              startDate: normalizeDateValue(
                item.startDate,
                `Education start date for ${item.name || "an entry"}`,
                warnings,
              ),
              endDate: normalizeDateValue(
                item.endDate,
                `Education end date for ${item.name || "an entry"}`,
                warnings,
                true,
              ),
              degree: cleanText(item.degree),
              gpa: cleanText(item.gpa),
              description: toRichTextBullets(item.highlights),
            })),
          }
        : buildHiddenSection("education"),
      publications: importedResume.publications.length
        ? {
            visible: true,
            order: resumeSectionKeys.indexOf("publications"),
            items: importedResume.publications.map((item) => ({
              id: createLocalId("publication"),
              title: cleanText(item.title),
              publisher: cleanText(item.publisher),
              publicationUrl: normalizeUrl(item.publicationUrl),
              publicationDate: normalizeDateValue(
                item.publicationDate,
                `Publication date for ${item.title || "an entry"}`,
                warnings,
              ),
              description: toRichTextBullets(item.highlights),
            })),
          }
        : buildHiddenSection("publications"),
      certifications: importedResume.certifications.length
        ? {
            visible: true,
            order: resumeSectionKeys.indexOf("certifications"),
            items: importedResume.certifications.map((item) => ({
              id: createLocalId("certification"),
              certificationName: cleanText(item.certificationName),
              issuingOrganization: cleanText(item.issuingOrganization),
              issuedDate: normalizeDateValue(
                item.issuedDate,
                `Certification date for ${item.certificationName || "an entry"}`,
                warnings,
              ),
              certificationLink: normalizeUrl(item.certificationLink),
              credentialId: cleanText(item.credentialId),
            })),
          }
        : buildHiddenSection("certifications"),
      awards: importedResume.awards.length
        ? {
            visible: true,
            order: resumeSectionKeys.indexOf("awards"),
            items: importedResume.awards.map((item) => ({
              id: createLocalId("award"),
              title: cleanText(item.title),
              issuer: cleanText(item.issuer),
              issuedDate: normalizeDateValue(
                item.issuedDate,
                `Award date for ${item.title || "an entry"}`,
                warnings,
              ),
              description: toRichTextBullets(item.highlights),
            })),
          }
        : buildHiddenSection("awards"),
      languages: importedResume.languages.length
        ? {
            visible: true,
            order: resumeSectionKeys.indexOf("languages"),
            items: importedResume.languages.map((item) => ({
              id: createLocalId("language"),
              language: cleanText(item.language),
              proficiency: languageProficiencyOptions.includes(cleanText(item.proficiency))
                ? cleanText(item.proficiency)
                : cleanText(item.proficiency),
            })),
          }
        : buildHiddenSection("languages"),
      references: importedResume.references.length
        ? {
            visible: true,
            order: resumeSectionKeys.indexOf("references"),
            items: importedResume.references.map((item) => ({
              id: createLocalId("reference"),
              name: cleanText(item.name),
              background: cleanText(item.background),
              contactDetails: cleanText(item.contactDetails),
            })),
          }
        : buildHiddenSection("references"),
      organizationVolunteering: importedResume.organizationVolunteering.length
        ? {
            visible: true,
            order: resumeSectionKeys.indexOf("organizationVolunteering"),
            items: importedResume.organizationVolunteering.map((item) => ({
              id: createLocalId("organization"),
              organizationName: cleanText(item.organizationName),
              position: cleanText(item.position),
              location: cleanText(item.location),
              startDate: normalizeDateValue(
                item.startDate,
                `Organization start date for ${item.organizationName || "an entry"}`,
                warnings,
              ),
              endDate: normalizeDateValue(
                item.endDate,
                `Organization end date for ${item.organizationName || "an entry"}`,
                warnings,
                true,
              ),
              description: toRichTextBullets(item.highlights),
            })),
          }
        : buildHiddenSection("organizationVolunteering"),
    },
  };

  return {
    draft: parseResumeDraft(draft),
    warnings: dedupe(warnings),
  };
}
