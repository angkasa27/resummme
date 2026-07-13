import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import {
  commaJoin,
  joinParts,
} from "@/features/resume-editor/preview/helpers/string";
import type { SectionItem } from "@/features/resume-editor/preview/sections/types";
import type { TemplateSectionItemMap } from "@/features/resume-editor/preview/template-types";

import styles from "./styles.module.css";

function InsetItemFrame({
  title,
  titleMeta,
  row2,
  description,
}: {
  title: React.ReactNode;
  titleMeta?: string;
  row2?: string;
  description?: string;
}) {
  return (
    <div className={`item ${styles.insetItem}`}>
      <div className={styles.itemRow1}>
        <h3 className="item-title">{title}</h3>
        {titleMeta ? <span className="meta">{titleMeta}</span> : null}
      </div>
      {row2 ? <div className={styles.itemRow2}>{row2}</div> : null}
      {description ? <PreviewRichTextBlock content={description} /> : null}
    </div>
  );
}

export function WorkExperienceItem({ item }: { item: SectionItem<"workExperience"> }) {
  const titleMeta = item.companyName ? `· ${item.companyName}` : undefined;
  const row2 = joinParts(
    [item.location, renderDateRange(item.startDate, item.endDate) || undefined].filter(Boolean),
  );
  return (
    <InsetItemFrame
      title={item.position}
      titleMeta={titleMeta}
      row2={row2}
      description={item.description}
    />
  );
}

export function EducationItem({ item }: { item: SectionItem<"education"> }) {
  const title = item.degree || item.name;
  const titleMeta = item.degree && item.name ? `· ${item.name}` : undefined;
  const row2 = joinParts(
    [
      item.location || undefined,
      renderDateRange(item.startDate, item.endDate) || undefined,
      item.gpa ? `GPA ${item.gpa}` : undefined,
    ].filter(Boolean),
  );
  return (
    <InsetItemFrame
      title={title}
      titleMeta={titleMeta}
      row2={row2}
      description={item.description}
    />
  );
}

export function ProjectsItem({ item }: { item: SectionItem<"projects"> }) {
  const row2 = renderDateRange(item.startDate, item.endDate) || undefined;
  return (
    <InsetItemFrame
      title={<PreviewLinkedTitle title={item.projectName} link={item.projectLink} />}
      row2={row2}
      description={item.description}
    />
  );
}

export function SkillsItem({ item }: { item: SectionItem<"skills"> }) {
  const skills = commaJoin(item.skills);
  return (
    <div className={`item ${styles.insetItem}`}>
      <div className={styles.itemRow1}>
        <h3 className="item-title">{item.categoryName}</h3>
        {skills ? <span className="meta">· {skills}</span> : null}
      </div>
    </div>
  );
}

function PublicationsItem({ item }: { item: SectionItem<"publications"> }) {
  return (
    <InsetItemFrame
      title={<PreviewLinkedTitle title={item.title} link={item.publicationUrl} />}
      titleMeta={item.publisher ? `· ${item.publisher}` : undefined}
      row2={item.publicationDate}
      description={item.description}
    />
  );
}

function CertificationsItem({ item }: { item: SectionItem<"certifications"> }) {
  const titleMeta = item.issuingOrganization ? `· ${item.issuingOrganization}` : undefined;
  const row2 = joinParts(
    [
      item.issuedDate || undefined,
      item.credentialId ? `Credential ID: ${item.credentialId}` : undefined,
    ].filter(Boolean),
  );
  return (
    <InsetItemFrame
      title={<PreviewLinkedTitle title={item.certificationName} link={item.certificationLink} />}
      titleMeta={titleMeta}
      row2={row2}
    />
  );
}

function AwardsItem({ item }: { item: SectionItem<"awards"> }) {
  return (
    <InsetItemFrame
      title={item.title}
      titleMeta={item.issuer ? `· ${item.issuer}` : undefined}
      row2={item.issuedDate}
      description={item.description}
    />
  );
}

function LanguagesItem({ item }: { item: SectionItem<"languages"> }) {
  return (
    <div className={`item ${styles.insetItem}`}>
      <div className={styles.itemRow1}>
        <h3 className="item-title">{item.language}</h3>
        {item.proficiency ? <span className="meta">· {item.proficiency}</span> : null}
      </div>
    </div>
  );
}

function ReferencesItem({ item }: { item: SectionItem<"references"> }) {
  return (
    <InsetItemFrame
      title={item.name}
      titleMeta={item.background ? `· ${item.background}` : undefined}
      row2={item.contactDetails}
    />
  );
}

function OrganizationVolunteeringItem({
  item,
}: {
  item: SectionItem<"organizationVolunteering">;
}) {
  const titleMeta = item.organizationName ? `· ${item.organizationName}` : undefined;
  const row2 = joinParts(
    [item.location || undefined, renderDateRange(item.startDate, item.endDate) || undefined].filter(
      Boolean,
    ),
  );
  return (
    <InsetItemFrame
      title={item.position}
      titleMeta={titleMeta}
      row2={row2}
      description={item.description}
    />
  );
}

export const insetItemViews: TemplateSectionItemMap = {
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
