import type { TemplateSectionItemMap } from "@/features/resume-editor/preview/template-types";
import type { SectionItem } from "@/features/resume-editor/preview/sections/types";
import {
  AwardsItem,
  CertificationsItem,
  EducationItem,
  LanguagesItem,
  OrganizationVolunteeringItem,
  ProjectsItem,
  PublicationsItem,
  ReferencesItem,
  WorkExperienceItem,
} from "@/features/resume-editor/preview/templates/_shared/items";

function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <div className="item">
      <h3 className="item-title">{item.categoryName}</h3>
      <div>{item.skills.filter(Boolean).join(", ")}</div>
    </div>
  );
}

export const sidebarItemViews: TemplateSectionItemMap = {
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
