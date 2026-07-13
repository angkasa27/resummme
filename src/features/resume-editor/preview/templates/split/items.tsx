import type { TemplateSectionItemMap } from "@/features/resume-editor/preview/template-types";
import {
  AwardsItem,
  CertificationsItem,
  EducationItem,
  OrganizationVolunteeringItem,
  ProjectsItem,
  PublicationsItem,
  ReferencesItem,
  WorkExperienceItem,
} from "@/features/resume-editor/preview/templates/_shared/items";
import {
  RailLanguagesItem,
  RailSkillsItem,
} from "@/features/resume-editor/preview/templates/_shared/items/rail-items";

export const splitItemViews: TemplateSectionItemMap = {
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
