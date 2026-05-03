import type { ResumeDraft } from "@/lib/resume/schema";
import { sanitizeRichTextHtml } from "@/lib/resume/sanitize-rich-text";

function renderHtml(content: string) {
  return { __html: sanitizeRichTextHtml(content) };
}

function renderCurrentDateLabel(value: string) {
  return value === "current" ? "Current" : value;
}

const itemClassName = "flex flex-col gap-1.5 border-b pb-4 last:border-b-0 last:pb-0";
const itemHeaderClassName = "flex flex-wrap items-start justify-between gap-3";
const itemTitleClassName = "font-semibold leading-snug";
const itemMetaClassName = "text-[12px] leading-5 text-muted-foreground";
const itemDateClassName = "text-right text-[11px] font-medium text-muted-foreground";
const richTextClassName = "text-[12.5px] leading-6 text-foreground/90 [&_p]:m-0 [&_p+p]:mt-2";

export function renderSectionItem(
  sectionKey: keyof ResumeDraft["sections"],
  item: unknown
) {
  switch (sectionKey) {
    case "workExperience": {
      const entry = item as ResumeDraft["sections"]["workExperience"]["items"][number];
      return (
        <div key={entry.id} className={itemClassName}>
          <div className={itemHeaderClassName}>
            <div>
              <div className={itemTitleClassName}>{entry.position}</div>
              <div className={itemMetaClassName}>
                {entry.companyName} · {entry.location}
              </div>
            </div>
            <div className={itemDateClassName}>
              {entry.startDate} - {renderCurrentDateLabel(entry.endDate)}
            </div>
          </div>
          <div
            className={richTextClassName}
            dangerouslySetInnerHTML={renderHtml(entry.description)}
          />
        </div>
      );
    }
    case "skills": {
      const entry = item as ResumeDraft["sections"]["skills"]["items"][number];
      return (
        <div key={entry.id} className={itemClassName}>
          <div className={itemTitleClassName}>{entry.categoryName}</div>
          <div className={itemMetaClassName}>{entry.skills.join(", ")}</div>
        </div>
      );
    }
    case "projects": {
      const entry = item as ResumeDraft["sections"]["projects"]["items"][number];
      return (
        <div key={entry.id} className={itemClassName}>
          <div className={itemHeaderClassName}>
            <div>
              <div className={itemTitleClassName}>{entry.projectName}</div>
              {entry.projectLink ? (
                <a
                  className="text-[12px] text-primary underline underline-offset-4"
                  href={entry.projectLink}
                >
                  {entry.projectLink}
                </a>
              ) : null}
            </div>
            <div className={itemDateClassName}>
              {entry.startDate} - {renderCurrentDateLabel(entry.endDate)}
            </div>
          </div>
          <div
            className={richTextClassName}
            dangerouslySetInnerHTML={renderHtml(entry.description)}
          />
        </div>
      );
    }
    case "education": {
      const entry = item as ResumeDraft["sections"]["education"]["items"][number];
      return (
        <div key={entry.id} className={itemClassName}>
          <div className={itemHeaderClassName}>
            <div>
              <div className={itemTitleClassName}>{entry.degree}</div>
              <div className={itemMetaClassName}>
                {entry.name} · {entry.location}
              </div>
            </div>
            <div className={itemDateClassName}>
              {entry.startDate} - {renderCurrentDateLabel(entry.endDate)}
            </div>
          </div>
          {entry.gpa ? (
            <div className={itemMetaClassName}>GPA: {entry.gpa}</div>
          ) : null}
          <div
            className={richTextClassName}
            dangerouslySetInnerHTML={renderHtml(entry.description)}
          />
        </div>
      );
    }
    case "publications": {
      const entry = item as ResumeDraft["sections"]["publications"]["items"][number];
      return (
        <div key={entry.id} className={itemClassName}>
          <div className={itemHeaderClassName}>
            <div>
              <div className={itemTitleClassName}>{entry.title}</div>
              <div className={itemMetaClassName}>{entry.publisher}</div>
            </div>
            <div className={itemDateClassName}>{entry.publicationDate}</div>
          </div>
          {entry.publicationUrl ? (
            <a
              className="text-[12px] text-primary underline underline-offset-4"
              href={entry.publicationUrl}
            >
              {entry.publicationUrl}
            </a>
          ) : null}
          <div
            className={richTextClassName}
            dangerouslySetInnerHTML={renderHtml(entry.description)}
          />
        </div>
      );
    }
    case "certifications": {
      const entry =
        item as ResumeDraft["sections"]["certifications"]["items"][number];
      return (
        <div key={entry.id} className={itemClassName}>
          <div className={itemHeaderClassName}>
            <div>
              <div className={itemTitleClassName}>{entry.certificationName}</div>
              <div className={itemMetaClassName}>
                {entry.issuingOrganization}
              </div>
            </div>
            <div className={itemDateClassName}>{entry.issuedDate}</div>
          </div>
          {entry.certificationLink ? (
            <a
              className="text-[12px] text-primary underline underline-offset-4"
              href={entry.certificationLink}
            >
              {entry.certificationLink}
            </a>
          ) : null}
          {entry.credentialId ? (
            <div className={itemMetaClassName}>
              Credential ID: {entry.credentialId}
            </div>
          ) : null}
        </div>
      );
    }
    case "awards": {
      const entry = item as ResumeDraft["sections"]["awards"]["items"][number];
      return (
        <div key={entry.id} className={itemClassName}>
          <div className={itemHeaderClassName}>
            <div>
              <div className={itemTitleClassName}>{entry.title}</div>
              <div className={itemMetaClassName}>{entry.issuer}</div>
            </div>
            <div className={itemDateClassName}>{entry.issuedDate}</div>
          </div>
          <div
            className={richTextClassName}
            dangerouslySetInnerHTML={renderHtml(entry.description)}
          />
        </div>
      );
    }
    case "languages": {
      const entry = item as ResumeDraft["sections"]["languages"]["items"][number];
      return (
        <div key={entry.id} className="flex items-baseline justify-between gap-3 border-b pb-3 last:border-b-0 last:pb-0">
          <div className={itemTitleClassName}>{entry.language}</div>
          <div className={itemMetaClassName}>{entry.proficiency}</div>
        </div>
      );
    }
    case "references": {
      const entry = item as ResumeDraft["sections"]["references"]["items"][number];
      return (
        <div key={entry.id} className={itemClassName}>
          <div className={itemTitleClassName}>{entry.name}</div>
          <div className={itemMetaClassName}>{entry.background}</div>
          <div className={itemMetaClassName}>{entry.contactDetails}</div>
        </div>
      );
    }
    case "organizationVolunteering": {
      const entry =
        item as ResumeDraft["sections"]["organizationVolunteering"]["items"][number];
      return (
        <div key={entry.id} className={itemClassName}>
          <div className={itemHeaderClassName}>
            <div>
              <div className={itemTitleClassName}>{entry.position}</div>
              <div className={itemMetaClassName}>
                {entry.organizationName} · {entry.location}
              </div>
            </div>
            <div className={itemDateClassName}>
              {entry.startDate} - {renderCurrentDateLabel(entry.endDate)}
            </div>
          </div>
          <div
            className={richTextClassName}
            dangerouslySetInnerHTML={renderHtml(entry.description)}
          />
        </div>
      );
    }
    default:
      return null;
  }
}
