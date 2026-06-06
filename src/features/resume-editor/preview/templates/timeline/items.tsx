import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import { joinParts } from "@/features/resume-editor/preview/helpers/string";
import type { SectionItem } from "@/features/resume-editor/preview/sections/types";
import type { TemplateSectionItemMap } from "@/features/resume-editor/preview/template-types";

function TimelineItem({
  title,
  meta,
  date,
  description,
}: {
  title: React.ReactNode;
  meta?: string;
  date?: string;
  description?: string;
}) {
  return (
    <div className="item timeline-item">
      <div className="item-content">
        <div className="item-header">
          {date ? <span className="item-date">{date}</span> : null}
          <h3 className="item-title">{title}</h3>
        </div>
        {meta ? <div className="meta">{meta}</div> : null}
        {description ? <PreviewRichTextBlock content={description} /> : null}
      </div>
    </div>
  );
}

function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  return (
    <TimelineItem
      title={item.position}
      meta={joinParts([item.companyName, item.location])}
      date={renderDateRange(item.startDate, item.endDate)}
      description={item.description}
    />
  );
}

function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <div className="item timeline-item">
      <div className="item-content">
        <h3 className="item-title">{item.categoryName}</h3>
        <div className="meta">{item.skills.filter(Boolean).join(", ")}</div>
      </div>
    </div>
  );
}

function ProjectsItem({ item }: { item: SectionItem<"projects"> }) {
  return (
    <TimelineItem
      title={
        <PreviewLinkedTitle title={item.projectName} link={item.projectLink} />
      }
      date={renderDateRange(item.startDate, item.endDate)}
      description={item.description}
    />
  );
}

function EducationItem({ item }: { item: SectionItem<"education"> }) {
  return (
    <TimelineItem
      title={item.degree || item.name}
      meta={joinParts([
        item.degree && item.name ? item.name : undefined,
        item.location,
        item.gpa ? `GPA ${item.gpa}` : undefined,
      ])}
      date={renderDateRange(item.startDate, item.endDate)}
      description={item.description}
    />
  );
}

function PublicationsItem({ item }: { item: SectionItem<"publications"> }) {
  return (
    <TimelineItem
      title={
        <PreviewLinkedTitle title={item.title} link={item.publicationUrl} />
      }
      meta={item.publisher || undefined}
      date={item.publicationDate}
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
    <TimelineItem
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
      date={item.issuedDate}
    />
  );
}

function AwardsItem({ item }: { item: SectionItem<"awards"> }) {
  return (
    <TimelineItem
      title={item.title}
      meta={item.issuer || undefined}
      date={item.issuedDate}
      description={item.description}
    />
  );
}

function LanguagesItem({ item }: { item: SectionItem<"languages"> }) {
  return (
    <div className="item timeline-item">
      <div className="item-content">
        <h3 className="item-title">{item.language}</h3>
        <span className="meta">{item.proficiency}</span>
      </div>
    </div>
  );
}

function ReferencesItem({ item }: { item: SectionItem<"references"> }) {
  return (
    <div className="item timeline-item">
      <div className="item-content">
        <h3 className="item-title">{item.name}</h3>
        <div className="meta">
          {joinParts([item.background, item.contactDetails])}
        </div>
      </div>
    </div>
  );
}

function OrganizationVolunteeringItem({
  item,
}: {
  item: SectionItem<"organizationVolunteering">;
}) {
  return (
    <TimelineItem
      title={item.position}
      meta={joinParts([item.organizationName, item.location])}
      date={renderDateRange(item.startDate, item.endDate)}
      description={item.description}
    />
  );
}

export const timelineItemViews: TemplateSectionItemMap = {
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
