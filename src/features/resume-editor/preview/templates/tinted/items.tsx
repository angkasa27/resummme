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

export const tintedItemViews: TemplateSectionItemMap = {
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
