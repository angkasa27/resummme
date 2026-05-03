import { z } from "zod";
import { sanitizeRichTextHtml } from "@/lib/resume/sanitize-rich-text";

const monthYearPattern = /^[A-Za-z]{3,9}\s+\d{4}$/;
const currentValueSchema = z.literal("current");

function requiredText(label: string) {
  return z.string().trim().min(1, `${label} is required.`);
}

function optionalText() {
  return z.string().trim().optional().or(z.literal(""));
}

function requiredUrl(label: string) {
  return z.string().trim().url(`${label} must be a valid URL.`);
}

function optionalUrl(label: string) {
  return z.literal("").or(requiredUrl(label));
}

function requiredEmail(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .email(`${label} must be a valid email address.`);
}

function richTextTextContent(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function requiredRichText(label: string) {
  return z
    .string()
    .trim()
    .transform((value) => sanitizeRichTextHtml(value))
    .refine((value) => richTextTextContent(value).length > 0, {
      message: `${label} is required.`,
    });
}

function requiredMonthYear(label: string) {
  return z
    .string()
    .trim()
    .regex(monthYearPattern, `${label} must use the format MMM YYYY.`);
}

function draftText() {
  return z.string().trim();
}

function draftRichText() {
  return z.string().trim().transform((value) => sanitizeRichTextHtml(value));
}

function draftMonthYear() {
  return z.literal("").or(z.string().trim().regex(monthYearPattern));
}

function draftCurrentOrMonthYear() {
  return z.union([z.literal(""), z.string().trim().regex(monthYearPattern), currentValueSchema]);
}

function draftUrl() {
  return z.string().trim();
}

export const summarySectionSchema = z.object({
  visible: z.boolean(),
  order: z.number().int().nonnegative(),
  content: requiredRichText("Summary content"),
});

export const extraLinkSchema = z.object({
  id: requiredText("Link ID"),
  url: requiredUrl("Link URL"),
}).strict();

export const profileSchema = z.object({
  fullName: requiredText("Full name"),
  location: requiredText("Location"),
  phone: requiredText("Phone number"),
  email: requiredEmail("Email address"),
  summary: requiredRichText("Short description"),
  photo: optionalUrl("Photo URL"),
  extraLinks: z.array(extraLinkSchema),
});

const extraLinkDraftSchema = z.object({
  id: requiredText("Link ID"),
  url: draftUrl(),
}).strict();

const profileDraftSchema = z.object({
  fullName: draftText(),
  location: draftText(),
  phone: draftText(),
  email: draftText(),
  summary: draftRichText(),
  photo: draftUrl(),
  extraLinks: z.array(extraLinkDraftSchema),
});

const datedRangeSchema = z.object({
  startDate: requiredMonthYear("Start date"),
  endDate: z.union([requiredMonthYear("End date"), currentValueSchema]),
});

export const workExperienceItemSchema = z.object({
  id: requiredText("Work experience ID"),
  companyName: requiredText("Company name"),
  position: requiredText("Position"),
  location: requiredText("Location"),
  ...datedRangeSchema.shape,
  description: requiredRichText("Description"),
});

const workExperienceDraftItemSchema = z.object({
  id: requiredText("Work experience ID"),
  companyName: draftText(),
  position: draftText(),
  location: draftText(),
  startDate: draftMonthYear(),
  endDate: draftCurrentOrMonthYear(),
  description: draftRichText(),
});

export const skillCategoryItemSchema = z.object({
  id: requiredText("Skill category ID"),
  categoryName: requiredText("Category name"),
  skills: z.array(requiredText("Skill")).min(1, "Add at least one skill."),
});

const skillCategoryDraftItemSchema = z.object({
  id: requiredText("Skill category ID"),
  categoryName: draftText(),
  skills: z.array(draftText()),
});

export const projectItemSchema = z.object({
  id: requiredText("Project ID"),
  projectName: requiredText("Project name"),
  projectLink: optionalUrl("Project link"),
  ...datedRangeSchema.shape,
  description: requiredRichText("Description"),
});

const projectDraftItemSchema = z.object({
  id: requiredText("Project ID"),
  projectName: draftText(),
  projectLink: draftUrl(),
  startDate: draftMonthYear(),
  endDate: draftCurrentOrMonthYear(),
  description: draftRichText(),
});

export const educationItemSchema = z.object({
  id: requiredText("Education ID"),
  name: requiredText("Institution name"),
  location: requiredText("Location"),
  ...datedRangeSchema.shape,
  degree: requiredText("Degree or major"),
  gpa: optionalText(),
  description: requiredRichText("Description"),
});

const educationDraftItemSchema = z.object({
  id: requiredText("Education ID"),
  name: draftText(),
  location: draftText(),
  startDate: draftMonthYear(),
  endDate: draftCurrentOrMonthYear(),
  degree: draftText(),
  gpa: optionalText(),
  description: draftRichText(),
});

export const publicationItemSchema = z.object({
  id: requiredText("Publication ID"),
  title: requiredText("Title"),
  publisher: requiredText("Publisher"),
  publicationUrl: optionalUrl("Publication URL"),
  publicationDate: requiredMonthYear("Publication date"),
  description: requiredRichText("Description"),
});

const publicationDraftItemSchema = z.object({
  id: requiredText("Publication ID"),
  title: draftText(),
  publisher: draftText(),
  publicationUrl: draftUrl(),
  publicationDate: draftMonthYear(),
  description: draftRichText(),
});

export const certificationItemSchema = z.object({
  id: requiredText("Certification ID"),
  certificationName: requiredText("Certification name"),
  issuingOrganization: requiredText("Issuing organization"),
  issuedDate: requiredMonthYear("Issued date"),
  certificationLink: optionalUrl("Certification link"),
  credentialId: optionalText(),
});

const certificationDraftItemSchema = z.object({
  id: requiredText("Certification ID"),
  certificationName: draftText(),
  issuingOrganization: draftText(),
  issuedDate: draftMonthYear(),
  certificationLink: draftUrl(),
  credentialId: optionalText(),
});

export const awardItemSchema = z.object({
  id: requiredText("Award ID"),
  title: requiredText("Title"),
  issuer: requiredText("Issuer"),
  issuedDate: requiredMonthYear("Issued date"),
  description: requiredRichText("Description"),
});

const awardDraftItemSchema = z.object({
  id: requiredText("Award ID"),
  title: draftText(),
  issuer: draftText(),
  issuedDate: draftMonthYear(),
  description: draftRichText(),
});

export const languageItemSchema = z.object({
  id: requiredText("Language ID"),
  language: requiredText("Language"),
  proficiency: requiredText("Proficiency"),
});

const languageDraftItemSchema = z.object({
  id: requiredText("Language ID"),
  language: draftText(),
  proficiency: draftText(),
});

export const referenceItemSchema = z.object({
  id: requiredText("Reference ID"),
  name: requiredText("Name"),
  background: requiredText("Background"),
  contactDetails: requiredText("Contact details"),
});

const referenceDraftItemSchema = z.object({
  id: requiredText("Reference ID"),
  name: draftText(),
  background: draftText(),
  contactDetails: draftText(),
});

export const organizationItemSchema = z.object({
  id: requiredText("Organization ID"),
  organizationName: requiredText("Organization name"),
  position: requiredText("Position"),
  location: requiredText("Location"),
  ...datedRangeSchema.shape,
  description: requiredRichText("Description"),
});

const organizationDraftItemSchema = z.object({
  id: requiredText("Organization ID"),
  organizationName: draftText(),
  position: draftText(),
  location: draftText(),
  startDate: draftMonthYear(),
  endDate: draftCurrentOrMonthYear(),
  description: draftRichText(),
});

function createCollectionSectionSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    visible: z.boolean(),
    order: z.number().int().nonnegative(),
    items: z.array(itemSchema).min(1, "At least one item is required."),
  });
}

export const workExperienceSectionSchema = createCollectionSectionSchema(
  workExperienceDraftItemSchema
);
export const skillsSectionSchema = createCollectionSectionSchema(
  skillCategoryDraftItemSchema
);
export const projectsSectionSchema = createCollectionSectionSchema(projectDraftItemSchema);
export const educationSectionSchema = createCollectionSectionSchema(
  educationDraftItemSchema
);
export const publicationsSectionSchema = createCollectionSectionSchema(
  publicationDraftItemSchema
);
export const certificationsSectionSchema = createCollectionSectionSchema(
  certificationDraftItemSchema
);
export const awardsSectionSchema = createCollectionSectionSchema(awardDraftItemSchema);
export const languagesSectionSchema = createCollectionSectionSchema(
  languageDraftItemSchema
);
export const referencesSectionSchema = createCollectionSectionSchema(
  referenceDraftItemSchema
);
export const organizationVolunteeringSectionSchema = createCollectionSectionSchema(
  organizationDraftItemSchema
);

export const sectionsSchema = z.object({
  summary: summarySectionSchema,
  workExperience: workExperienceSectionSchema,
  skills: skillsSectionSchema,
  projects: projectsSectionSchema,
  education: educationSectionSchema,
  publications: publicationsSectionSchema,
  certifications: certificationsSectionSchema,
  awards: awardsSectionSchema,
  languages: languagesSectionSchema,
  references: referencesSectionSchema,
  organizationVolunteering: organizationVolunteeringSectionSchema,
});

export const resumeDraftSchema = z.object({
  schemaVersion: z.literal(2),
  templateId: z.literal("recruiter-first-clean"),
  updatedAt: z.string().min(1),
  profile: profileDraftSchema,
  sections: sectionsSchema,
});

export type ExtraLink = z.infer<typeof extraLinkSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type SummarySection = z.infer<typeof summarySectionSchema>;
export type WorkExperienceItem = z.infer<typeof workExperienceItemSchema>;
export type SkillCategoryItem = z.infer<typeof skillCategoryItemSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type PublicationItem = z.infer<typeof publicationItemSchema>;
export type CertificationItem = z.infer<typeof certificationItemSchema>;
export type AwardItem = z.infer<typeof awardItemSchema>;
export type LanguageItem = z.infer<typeof languageItemSchema>;
export type ReferenceItem = z.infer<typeof referenceItemSchema>;
export type OrganizationItem = z.infer<typeof organizationItemSchema>;
export type ResumeDraft = z.infer<typeof resumeDraftSchema>;

export function parseResumeDraft(input: unknown): ResumeDraft {
  return resumeDraftSchema.parse(input);
}
