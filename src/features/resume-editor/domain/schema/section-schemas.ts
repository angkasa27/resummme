import { z } from "zod";

import {
  monthYearField,
  monthYearOrCurrentField,
  optionalText,
  requiredText,
  richTextField,
  textField,
  urlField,
} from "@/features/resume-editor/domain/schema/shared";

const datedRangeShape = {
  startDate: monthYearField("Start date"),
  endDate: monthYearOrCurrentField("End date"),
} as const;

const summarySectionSchema = z.object({
  visible: z.boolean(),
  order: z.number().int().nonnegative(),
  content: richTextField(),
});

export const summaryContentSchema = summarySectionSchema.pick({
  content: true,
});

export const workExperienceItemSchema = z.object({
  id: requiredText("Work experience ID"),
  companyName: textField(),
  position: textField(),
  location: textField(),
  ...datedRangeShape,
  description: richTextField(),
});

export const skillCategoryItemSchema = z.object({
  id: requiredText("Skill category ID"),
  categoryName: textField(),
  skills: z.array(textField()),
});

export const projectItemSchema = z.object({
  id: requiredText("Project ID"),
  projectName: textField(),
  projectLink: urlField("Project link"),
  ...datedRangeShape,
  description: richTextField(),
});

export const educationItemSchema = z.object({
  id: requiredText("Education ID"),
  name: textField(),
  location: textField(),
  ...datedRangeShape,
  degree: textField(),
  gpa: optionalText(),
  description: richTextField(),
});

export const publicationItemSchema = z.object({
  id: requiredText("Publication ID"),
  title: textField(),
  publisher: textField(),
  publicationUrl: urlField("Publication URL"),
  publicationDate: monthYearField("Publication date"),
  description: richTextField(),
});

export const certificationItemSchema = z.object({
  id: requiredText("Certification ID"),
  certificationName: textField(),
  issuingOrganization: textField(),
  issuedDate: monthYearField("Issued date"),
  certificationLink: urlField("Certification link"),
  credentialId: optionalText(),
});

export const awardItemSchema = z.object({
  id: requiredText("Award ID"),
  title: textField(),
  issuer: textField(),
  issuedDate: monthYearField("Issued date"),
  description: richTextField(),
});

export const languageItemSchema = z.object({
  id: requiredText("Language ID"),
  language: textField(),
  proficiency: textField(),
});

export const referenceItemSchema = z.object({
  id: requiredText("Reference ID"),
  name: textField(),
  background: textField(),
  contactDetails: textField(),
});

export const organizationItemSchema = z.object({
  id: requiredText("Organization ID"),
  organizationName: textField(),
  position: textField(),
  location: textField(),
  ...datedRangeShape,
  description: richTextField(),
});

function createCollectionSectionSchema<TItemSchema extends z.ZodTypeAny>(
  itemSchema: TItemSchema,
) {
  return z.object({
    visible: z.boolean(),
    order: z.number().int().nonnegative(),
    items: z.array(itemSchema).min(1, "At least one item is required."),
  });
}

const workExperienceSectionSchema = createCollectionSectionSchema(
  workExperienceItemSchema,
);
const skillsSectionSchema = createCollectionSectionSchema(
  skillCategoryItemSchema,
);
const projectsSectionSchema = createCollectionSectionSchema(projectItemSchema);
const educationSectionSchema =
  createCollectionSectionSchema(educationItemSchema);
const publicationsSectionSchema = createCollectionSectionSchema(
  publicationItemSchema,
);
const certificationsSectionSchema = createCollectionSectionSchema(
  certificationItemSchema,
);
const awardsSectionSchema = createCollectionSectionSchema(awardItemSchema);
const languagesSectionSchema =
  createCollectionSectionSchema(languageItemSchema);
const referencesSectionSchema =
  createCollectionSectionSchema(referenceItemSchema);
const organizationVolunteeringSectionSchema = createCollectionSectionSchema(
  organizationItemSchema,
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
