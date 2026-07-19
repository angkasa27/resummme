import type { ComponentType } from "react";

import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { ItemForm } from "@/features/resume-editor/forms/fields/item-field-atoms";
import { AwardsItemFields } from "@/features/resume-editor/forms/fields/sections/awards-item-fields";
import { CertificationsItemFields } from "@/features/resume-editor/forms/fields/sections/certifications-item-fields";
import { EducationItemFields } from "@/features/resume-editor/forms/fields/sections/education-item-fields";
import { LanguagesItemFields } from "@/features/resume-editor/forms/fields/sections/languages-item-fields";
import { OrganizationItemFields } from "@/features/resume-editor/forms/fields/sections/organization-item-fields";
import { ProjectsItemFields } from "@/features/resume-editor/forms/fields/sections/projects-item-fields";
import { PublicationsItemFields } from "@/features/resume-editor/forms/fields/sections/publications-item-fields";
import { ReferencesItemFields } from "@/features/resume-editor/forms/fields/sections/references-item-fields";
import { SkillsItemFields } from "@/features/resume-editor/forms/fields/sections/skills-item-fields";
import { WorkExperienceItemFields } from "@/features/resume-editor/forms/fields/sections/work-experience-item-fields";

type CollectionItemFieldsProps = {
  form: ItemForm;
  index: number;
};

/** Per-section item field components, keyed the same as `collectionSectionConfigs`. */
export const collectionItemFieldsByKey: Record<
  CollectionSectionKey,
  ComponentType<CollectionItemFieldsProps>
> = {
  workExperience: WorkExperienceItemFields,
  skills: SkillsItemFields,
  projects: ProjectsItemFields,
  education: EducationItemFields,
  publications: PublicationsItemFields,
  certifications: CertificationsItemFields,
  awards: AwardsItemFields,
  languages: LanguagesItemFields,
  references: ReferencesItemFields,
  organizationVolunteering: OrganizationItemFields,
};
