import { z } from "zod";

const currentValueSchema = z.literal("current");
const monthYearSchema = z.string().trim().regex(/^[A-Za-z]{3,9}\s+\d{4}$/);
const monthYearOrCurrentSchema = z.union([monthYearSchema, currentValueSchema]);
const richTextSchema = z.string().trim();
const urlSchema = z.url();

export const summarySectionSchema = z.object({
  visible: z.boolean(),
  order: z.number().int().nonnegative(),
  content: richTextSchema,
});

export const extraLinkSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  url: urlSchema,
});

export const profileSchema = z.object({
  fullName: z.string().min(1),
  location: z.string().min(1),
  phone: z.string().min(1),
  email: z.email(),
  summary: richTextSchema,
  photo: urlSchema.optional().or(z.literal("")),
  extraLinks: z.array(extraLinkSchema),
});

const datedRangeSchema = z.object({
  startDate: monthYearSchema,
  endDate: monthYearOrCurrentSchema,
});

export const workExperienceItemSchema = z.object({
  id: z.string().min(1),
  companyName: z.string().min(1),
  position: z.string().min(1),
  location: z.string().min(1),
  ...datedRangeSchema.shape,
  description: richTextSchema,
});

export const skillCategoryItemSchema = z.object({
  id: z.string().min(1),
  categoryName: z.string().min(1),
  skills: z.array(z.string().min(1)).min(1),
});

export const projectItemSchema = z.object({
  id: z.string().min(1),
  projectName: z.string().min(1),
  projectLink: urlSchema.or(z.literal("")),
  ...datedRangeSchema.shape,
  description: richTextSchema,
});

export const educationItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  location: z.string().min(1),
  ...datedRangeSchema.shape,
  degree: z.string().min(1),
  gpa: z.string().optional().or(z.literal("")),
  description: richTextSchema,
});

export const publicationItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  publisher: z.string().min(1),
  publicationUrl: urlSchema.or(z.literal("")),
  publicationDate: monthYearSchema,
  description: richTextSchema,
});

export const certificationItemSchema = z.object({
  id: z.string().min(1),
  certificationName: z.string().min(1),
  issuingOrganization: z.string().min(1),
  issuedDate: monthYearSchema,
  certificationLink: urlSchema.or(z.literal("")),
  credentialId: z.string().optional().or(z.literal("")),
});

export const awardItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  issuer: z.string().min(1),
  issuedDate: monthYearSchema,
  description: richTextSchema,
});

export const languageItemSchema = z.object({
  id: z.string().min(1),
  language: z.string().min(1),
  proficiency: z.string().min(1),
});

export const referenceItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  background: z.string().min(1),
  contactDetails: z.string().min(1),
});

export const organizationItemSchema = z.object({
  id: z.string().min(1),
  organizationName: z.string().min(1),
  position: z.string().min(1),
  location: z.string().min(1),
  ...datedRangeSchema.shape,
  description: richTextSchema,
});

function createCollectionSectionSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    visible: z.boolean(),
    order: z.number().int().nonnegative(),
    items: z.array(itemSchema),
  });
}

export const workExperienceSectionSchema = createCollectionSectionSchema(
  workExperienceItemSchema
);
export const skillsSectionSchema = createCollectionSectionSchema(
  skillCategoryItemSchema
);
export const projectsSectionSchema = createCollectionSectionSchema(
  projectItemSchema
);
export const educationSectionSchema = createCollectionSectionSchema(
  educationItemSchema
);
export const publicationsSectionSchema = createCollectionSectionSchema(
  publicationItemSchema
);
export const certificationsSectionSchema = createCollectionSectionSchema(
  certificationItemSchema
);
export const awardsSectionSchema = createCollectionSectionSchema(awardItemSchema);
export const languagesSectionSchema = createCollectionSectionSchema(
  languageItemSchema
);
export const referencesSectionSchema = createCollectionSectionSchema(
  referenceItemSchema
);
export const organizationVolunteeringSectionSchema = createCollectionSectionSchema(
  organizationItemSchema
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
  schemaVersion: z.literal(1),
  templateId: z.literal("recruiter-first-clean"),
  updatedAt: z.string().min(1),
  profile: profileSchema,
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
