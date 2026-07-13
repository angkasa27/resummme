import type { TemplateSectionItemMap } from "@/features/resume-editor/preview/template-types";
import {
  AwardsItem,
  CertificationsItem,
  EducationItem,
  LanguagesItem,
  OrganizationVolunteeringItem,
  ProjectsItem,
  PublicationsItem,
  ReferencesItem,
  SkillsItem,
  WorkExperienceItem,
} from "@/features/resume-editor/preview/templates/_shared/items";

/**
 * The canonical item-view map used by every template that renders items the
 * default way (classic/minimal/banner/bold-type/modern-centered). Templates
 * with bespoke item DOM (academic/timeline/inset/tinted/sidebar/split) build
 * their own map instead.
 */
export const defaultItemViews: TemplateSectionItemMap = {
  workExperience: WorkExperienceItem,
  skills: SkillsItem,
  projects: ProjectsItem,
  education: EducationItem,
  publications: PublicationsItem,
  certifications: CertificationsItem,
  awards: AwardsItem,
  languages: LanguagesItem,
  references: ReferencesItem,
  organizationVolunteering: OrganizationVolunteeringItem,
};
