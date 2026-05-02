import type { CollectionSectionKey } from "@/features/resume-editor/config/section-metadata";
import {
  awardsSectionSchema,
  certificationsSectionSchema,
  educationSectionSchema,
  languagesSectionSchema,
  organizationVolunteeringSectionSchema,
  projectsSectionSchema,
  publicationsSectionSchema,
  referencesSectionSchema,
  skillsSectionSchema,
  workExperienceSectionSchema,
} from "@/lib/resume/schema";

export const collectionSectionSchemaMap: Record<CollectionSectionKey, unknown> = {
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
};
