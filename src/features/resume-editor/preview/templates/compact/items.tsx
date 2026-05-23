import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import { joinParts } from "@/features/resume-editor/preview/helpers/string";
import type { SectionItem } from "@/features/resume-editor/preview/sections/types";
import type { TemplateSectionItemMap } from "@/features/resume-editor/preview/template-types";

function CompactRow({
  title,
  trailing,
  meta,
  description,
}: {
  title: React.ReactNode;
  trailing?: string;
  meta?: string;
  description?: string;
}) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">{title}</h3>
          {meta ? <span className="meta">{meta}</span> : null}
        </div>
        {trailing ? <span className="item-date">{trailing}</span> : null}
      </div>
      {description ? <PreviewRichTextBlock content={description} /> : null}
    </div>
  );
}

function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  return (
    <CompactRow
      title={item.position}
      meta={joinParts([item.companyName, item.location])}
      trailing={renderDateRange(item.startDate, item.endDate)}
      description={item.description}
    />
  );
}

function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <div className="item item-row">
      <h3 className="item-title">{item.categoryName}</h3>
      <span className="meta">{item.skills.filter(Boolean).join(", ")}</span>
    </div>
  );
}

function ProjectsItem({ item }: { item: SectionItem<"projects"> }) {
  return (
    <CompactRow
      title={
        <PreviewLinkedTitle title={item.projectName} link={item.projectLink} />
      }
      trailing={renderDateRange(item.startDate, item.endDate)}
      description={item.description}
    />
  );
}

function EducationItem({ item }: { item: SectionItem<"education"> }) {
  return (
    <CompactRow
      title={item.degree || item.name}
      meta={joinParts([
        item.degree && item.name ? item.name : undefined,
        item.location,
        item.gpa ? `GPA ${item.gpa}` : undefined,
      ])}
      trailing={renderDateRange(item.startDate, item.endDate)}
      description={item.description}
    />
  );
}

function PublicationsItem({ item }: { item: SectionItem<"publications"> }) {
  return (
    <CompactRow
      title={<PreviewLinkedTitle title={item.title} link={item.publicationUrl} />}
      meta={item.publisher || undefined}
      trailing={item.publicationDate}
      description={item.description}
    />
  );
}

function CertificationsItem({
  item,
}: {
  item: SectionItem<"certifications">;
}) {
  return (
    <CompactRow
      title={
        <PreviewLinkedTitle
          title={item.certificationName}
          link={item.certificationLink}
        />
      }
      meta={joinParts([
        item.issuingOrganization,
        item.credentialId ? `ID ${item.credentialId}` : undefined,
      ])}
      trailing={item.issuedDate}
    />
  );
}

function AwardsItem({ item }: { item: SectionItem<"awards"> }) {
  return (
    <CompactRow
      title={item.title}
      meta={item.issuer || undefined}
      trailing={item.issuedDate}
      description={item.description}
    />
  );
}

function LanguagesItem({ item }: { item: SectionItem<"languages"> }) {
  return (
    <div className="item item-row">
      <h3 className="item-title">{item.language}</h3>
      <span className="meta">{item.proficiency}</span>
    </div>
  );
}

function ReferencesItem({ item }: { item: SectionItem<"references"> }) {
  return (
    <div className="item">
      <h3 className="item-title">{item.name}</h3>
      <span className="meta">
        {joinParts([item.background, item.contactDetails])}
      </span>
    </div>
  );
}

function OrganizationVolunteeringItem({
  item,
}: {
  item: SectionItem<"organizationVolunteering">;
}) {
  return (
    <CompactRow
      title={item.position}
      meta={joinParts([item.organizationName, item.location])}
      trailing={renderDateRange(item.startDate, item.endDate)}
      description={item.description}
    />
  );
}

export const compactItemViews: TemplateSectionItemMap = {
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
