import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import {
  commaJoin,
  joinParts,
} from "@/features/resume-editor/preview/helpers/string";
import type { SectionItem } from "@/features/resume-editor/preview/sections/types";
import type { LayoutSectionItemMap } from "@/features/resume-editor/preview/layout-types";

function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">{item.companyName || item.position}</h3>
          {item.companyName && item.position ? (
            <em className="meta italic">{item.position}</em>
          ) : null}
          {item.location ? <span className="meta">{item.location}</span> : null}
        </div>
        <div className="item-header-side">
          <div className="item-date">
            {renderDateRange(item.startDate, item.endDate)}
          </div>
        </div>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  return (
    <div className="item">
      <h3 className="item-title">{item.categoryName}</h3>
      <span className="meta">{commaJoin(item.skills)}</span>
    </div>
  );
}

function ProjectsItem({ item }: { item: SectionItem<"projects"> }) {
  return (
    <div className="item">
      <div className="item-header">
        <h3 className="item-title">
          <PreviewLinkedTitle title={item.projectName} link={item.projectLink} />
        </h3>
        <span className="item-date">
          {renderDateRange(item.startDate, item.endDate)}
        </span>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function EducationItem({ item }: { item: SectionItem<"education"> }) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">{item.name || item.degree}</h3>
          {item.degree && item.name ? (
            <em className="meta italic">{item.degree}</em>
          ) : null}
          {item.location ? <span className="meta">{item.location}</span> : null}
          {item.gpa ? <span className="meta">GPA: {item.gpa}</span> : null}
        </div>
        <span className="item-date">
          {renderDateRange(item.startDate, item.endDate)}
        </span>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function PublicationsItem({ item }: { item: SectionItem<"publications"> }) {
  // Bibliography-style: Author/title. Publisher (date).
  return (
    <div className="item">
      <p className="rich-text" style={{ margin: 0 }}>
        <em>
          <PreviewLinkedTitle title={item.title} link={item.publicationUrl} />
        </em>
        {item.publisher ? ` — ${item.publisher}` : ""}
        {item.publicationDate ? ` (${item.publicationDate}).` : "."}
      </p>
      {item.description ? <PreviewRichTextBlock content={item.description} /> : null}
    </div>
  );
}

function CertificationsItem({
  item,
}: {
  item: SectionItem<"certifications">;
}) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">
            <PreviewLinkedTitle
              title={item.certificationName}
              link={item.certificationLink}
            />
          </h3>
          {item.issuingOrganization ? (
            <em className="meta italic">{item.issuingOrganization}</em>
          ) : null}
          {item.credentialId ? (
            <span className="meta">Credential ID: {item.credentialId}</span>
          ) : null}
        </div>
        <span className="item-date">{item.issuedDate}</span>
      </div>
    </div>
  );
}

function AwardsItem({ item }: { item: SectionItem<"awards"> }) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">{item.title}</h3>
          {item.issuer ? <em className="meta italic">{item.issuer}</em> : null}
        </div>
        <span className="item-date">{item.issuedDate}</span>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

function LanguagesItem({ item }: { item: SectionItem<"languages"> }) {
  return (
    <div className="item item-row">
      <h3 className="item-title">{item.language}</h3>
      <em className="meta italic">{item.proficiency}</em>
    </div>
  );
}

function ReferencesItem({ item }: { item: SectionItem<"references"> }) {
  return (
    <div className="item">
      <h3 className="item-title">{item.name}</h3>
      {item.background ? (
        <em className="meta italic">{item.background}</em>
      ) : null}
      {item.contactDetails ? (
        <span className="meta">{item.contactDetails}</span>
      ) : null}
    </div>
  );
}

function OrganizationVolunteeringItem({
  item,
}: {
  item: SectionItem<"organizationVolunteering">;
}) {
  return (
    <div className="item">
      <div className="item-header">
        <div className="item-header-main">
          <h3 className="item-title">{item.organizationName || item.position}</h3>
          {item.organizationName && item.position ? (
            <em className="meta italic">{item.position}</em>
          ) : null}
          {item.location ? <span className="meta">{item.location}</span> : null}
        </div>
        <span className="item-date">
          {renderDateRange(item.startDate, item.endDate)}
        </span>
      </div>
      <PreviewRichTextBlock content={item.description} />
    </div>
  );
}

// joinParts kept imported for parity / future use
void joinParts;

export const academicItemViews: LayoutSectionItemMap = {
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
