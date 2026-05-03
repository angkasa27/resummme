import { z } from "zod";

import type { CollectionSectionKey } from "@/features/resume-editor/config/section-metadata";
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
  summarySectionSchema,
  workExperienceItemSchema,
} from "@/lib/resume/schema";

export const summaryFormSchema = summarySectionSchema.pick({
  content: true,
});

function createCollectionSectionFormSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema).min(1, "Keep at least one item in this section."),
  });
}

export const collectionSectionFormSchemaMap: Record<CollectionSectionKey, unknown> = {
  workExperience: createCollectionSectionFormSchema(workExperienceItemSchema),
  skills: createCollectionSectionFormSchema(skillCategoryItemSchema),
  projects: createCollectionSectionFormSchema(projectItemSchema),
  education: createCollectionSectionFormSchema(educationItemSchema),
  publications: createCollectionSectionFormSchema(publicationItemSchema),
  certifications: createCollectionSectionFormSchema(certificationItemSchema),
  awards: createCollectionSectionFormSchema(awardItemSchema),
  languages: createCollectionSectionFormSchema(languageItemSchema),
  references: createCollectionSectionFormSchema(referenceItemSchema),
  organizationVolunteering: createCollectionSectionFormSchema(organizationItemSchema),
};
