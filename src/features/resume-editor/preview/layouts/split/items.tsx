import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";
import {
  AwardsItem,
  CertificationsItem,
  EducationItem,
  OrganizationVolunteeringItem,
  ProjectsItem,
  PublicationsItem,
  ReferencesItem,
  WorkExperienceItem,
} from "@/features/resume-editor/preview/layouts/_shared/items";
import {
  RailLanguagesItem,
  RailSkillsItem,
} from "@/features/resume-editor/preview/layouts/_shared/items/rail-items";

export const splitItemViews: LayoutSectionItemMap = {
  workExperience: WorkExperienceItem,
  skills: RailSkillsItem,
  projects: ProjectsItem,
  education: EducationItem,
  publications: PublicationsItem,
  certifications: CertificationsItem,
  awards: AwardsItem,
  languages: RailLanguagesItem,
  references: ReferencesItem,
  organizationVolunteering: OrganizationVolunteeringItem,
};
