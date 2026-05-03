import { z } from "zod";

import type { CollectionSectionKey } from "@/features/resume-editor/config/section-metadata";
import {
  awardItemFormSchema,
  certificationItemFormSchema,
  educationItemFormSchema,
  languageItemFormSchema,
  organizationItemFormSchema,
  profileFormSchema,
  projectItemFormSchema,
  publicationItemFormSchema,
  referenceItemFormSchema,
  skillCategoryItemFormSchema,
  summaryFormSchema,
  workExperienceItemFormSchema,
} from "@/lib/resume/schema";

export { profileFormSchema, summaryFormSchema };

function createCollectionSectionFormSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema).min(1, "Keep at least one item in this section."),
  });
}

export const collectionSectionFormSchemaMap: Record<CollectionSectionKey, unknown> = {
  workExperience: createCollectionSectionFormSchema(workExperienceItemFormSchema),
  skills: createCollectionSectionFormSchema(skillCategoryItemFormSchema),
  projects: createCollectionSectionFormSchema(projectItemFormSchema),
  education: createCollectionSectionFormSchema(educationItemFormSchema),
  publications: createCollectionSectionFormSchema(publicationItemFormSchema),
  certifications: createCollectionSectionFormSchema(certificationItemFormSchema),
  awards: createCollectionSectionFormSchema(awardItemFormSchema),
  languages: createCollectionSectionFormSchema(languageItemFormSchema),
  references: createCollectionSectionFormSchema(referenceItemFormSchema),
  organizationVolunteering: createCollectionSectionFormSchema(organizationItemFormSchema),
};
