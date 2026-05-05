import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import {
  awardItemFormSchema,
  certificationItemFormSchema,
  educationItemFormSchema,
  languageItemFormSchema,
  organizationItemFormSchema,
  projectItemFormSchema,
  publicationItemFormSchema,
  referenceItemFormSchema,
  skillCategoryItemFormSchema,
  workExperienceItemFormSchema,
} from "@/features/resume-editor/domain/schema";
import { createCollectionSectionFormSchema } from "@/features/resume-editor/forms/schemas/create-collection-section-form-schema";

export const collectionSectionFormSchemaMap: Record<
  CollectionSectionKey,
  unknown
> = {
  workExperience: createCollectionSectionFormSchema(workExperienceItemFormSchema),
  skills: createCollectionSectionFormSchema(skillCategoryItemFormSchema),
  projects: createCollectionSectionFormSchema(projectItemFormSchema),
  education: createCollectionSectionFormSchema(educationItemFormSchema),
  publications: createCollectionSectionFormSchema(publicationItemFormSchema),
  certifications: createCollectionSectionFormSchema(certificationItemFormSchema),
  awards: createCollectionSectionFormSchema(awardItemFormSchema),
  languages: createCollectionSectionFormSchema(languageItemFormSchema),
  references: createCollectionSectionFormSchema(referenceItemFormSchema),
  organizationVolunteering: createCollectionSectionFormSchema(
    organizationItemFormSchema,
  ),
};
