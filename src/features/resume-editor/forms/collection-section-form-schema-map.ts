import { z } from "zod";

import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import {
  awardItemSchema,
  educationItemSchema,
  languageItemSchema,
  organizationItemSchema,
  referenceItemSchema,
  skillCategoryItemSchema,
  type ResumeDraft,
  workExperienceItemSchema,
} from "@/features/resume-editor/domain/schema";
import {
  certificationFormItemSchema,
  projectFormItemSchema,
  publicationFormItemSchema,
} from "@/features/resume-editor/forms/schemas/collection-form-item-schemas";
import { createCollectionSectionFormSchema } from "@/features/resume-editor/forms/schemas/create-collection-section-form-schema";

type CollectionSectionFormValues<K extends CollectionSectionKey> = {
  items: ResumeDraft["sections"][K]["items"];
};
type CollectionSectionFormSchema<K extends CollectionSectionKey> = z.ZodType<
  CollectionSectionFormValues<K>,
  CollectionSectionFormValues<K>
>;

export const collectionSectionFormSchemaMap: {
  [K in CollectionSectionKey]: CollectionSectionFormSchema<K>;
} = {
  workExperience: createCollectionSectionFormSchema(workExperienceItemSchema),
  skills: createCollectionSectionFormSchema(skillCategoryItemSchema),
  projects: createCollectionSectionFormSchema(projectFormItemSchema),
  education: createCollectionSectionFormSchema(educationItemSchema),
  publications: createCollectionSectionFormSchema(publicationFormItemSchema),
  certifications: createCollectionSectionFormSchema(certificationFormItemSchema),
  awards: createCollectionSectionFormSchema(awardItemSchema),
  languages: createCollectionSectionFormSchema(languageItemSchema),
  references: createCollectionSectionFormSchema(referenceItemSchema),
  organizationVolunteering: createCollectionSectionFormSchema(
    organizationItemSchema,
  ),
};
