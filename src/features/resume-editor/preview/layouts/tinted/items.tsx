import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";
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
} from "@/features/resume-editor/preview/layouts/_shared/items";

function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  const skills = item.skills.filter(Boolean);
  return (
    <div className="item">
      <h3 className="item-title">{item.categoryName}</h3>
      {skills.length > 0 ? (
        <div className="pill-row">
          {skills.map((skill, index) => (
            <span key={`${skill}-${index}`} className="pill">
              {skill}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export const tintedItemViews: LayoutSectionItemMap = {
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
