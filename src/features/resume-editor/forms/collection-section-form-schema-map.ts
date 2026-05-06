import { z } from "zod";

import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import {
  awardItemSchema,
  certificationItemSchema,
  educationItemSchema,
  languageItemSchema,
  organizationItemSchema,
  projectItemSchema,
  publicationItemSchema,
  referenceItemSchema,
  skillCategoryItemSchema,
  type ResumeDraft,
  workExperienceItemSchema,
} from "@/features/resume-editor/domain/schema";
import { createCollectionSectionFormSchema } from "@/features/resume-editor/forms/schemas/create-collection-section-form-schema";

type CollectionSectionFormSchema<K extends CollectionSectionKey> = z.ZodType<{
  items: ResumeDraft["sections"][K]["items"];
}>;

export const collectionSectionFormSchemaMap: {
  [K in CollectionSectionKey]: CollectionSectionFormSchema<K>;
} = {
  workExperience: createCollectionSectionFormSchema(workExperienceItemSchema),
  skills: createCollectionSectionFormSchema(skillCategoryItemSchema),
  projects: createCollectionSectionFormSchema(projectItemSchema),
  education: createCollectionSectionFormSchema(educationItemSchema),
  publications: createCollectionSectionFormSchema(publicationItemSchema),
  certifications: createCollectionSectionFormSchema(certificationItemSchema),
  awards: createCollectionSectionFormSchema(awardItemSchema),
  languages: createCollectionSectionFormSchema(languageItemSchema),
  references: createCollectionSectionFormSchema(referenceItemSchema),
  organizationVolunteering: createCollectionSectionFormSchema(
    organizationItemSchema,
  ),
};
