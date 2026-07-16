import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";
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
} from "@/features/resume-editor/preview/layouts/_shared/items";

/**
 * The canonical item-view map used by every layout that renders items the
 * default way (classic/minimal/banner/bold-type/modern-centered). Layouts
 * with bespoke item DOM (academic/timeline/inset/tinted/sidebar/split) build
 * their own map instead.
 */
export const defaultItemViews: LayoutSectionItemMap = {
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
