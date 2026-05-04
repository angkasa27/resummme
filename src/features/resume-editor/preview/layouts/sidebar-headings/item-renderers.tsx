import {
  PreviewLinkedTitle,
  PreviewRichTextBlock,
} from "@/features/resume-editor/preview/kit";
import {
  createSidebarItemStyles,
  itemContainer,
} from "./styles";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import { joinParts } from "@/features/resume-editor/preview/helpers/string";
import type {
  PreviewRenderContext,
  PreviewSectionItemRendererMap,
} from "@/features/resume-editor/preview/types";
import type { ResumeDraft } from "@/lib/resume/schema";

export function createSidebarItemRenderers(
  context: PreviewRenderContext,
): PreviewSectionItemRendererMap {
  const styles = createSidebarItemStyles(context.presentation);

  return {
    workExperience: (item) => {
      const entry =
        item as ResumeDraft["sections"]["workExperience"]["items"][number];
      return itemContainer(
        entry.id,
        styles.item,
        <>
          <div
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"
            style={styles.itemHeader}
          >
            <div style={{ minWidth: 0 }}>
              <div style={styles.itemTitle}>{entry.position}</div>
              <div style={styles.itemMeta}>{entry.companyName}</div>
            </div>
            <div>
              <div style={styles.itemDate}>
                {renderDateRange(entry.startDate, entry.endDate)}
              </div>
              {entry.location ? (
                <div style={styles.itemMeta}>{entry.location}</div>
              ) : null}
            </div>
          </div>
          <PreviewRichTextBlock
            content={entry.description}
            className="[&_p]:m-0 [&_p+p]:mt-2"
            style={styles.richText}
          />
        </>,
      );
    },
    skills: (item) => {
      const entry = item as ResumeDraft["sections"]["skills"]["items"][number];
      return itemContainer(
        entry.id,
        styles.item,
        <>
          <div style={styles.itemTitle}>{entry.categoryName}</div>
          <div style={styles.itemMeta}>{entry.skills.join(", ")}</div>
        </>,
      );
    },
    projects: (item) => {
      const entry =
        item as ResumeDraft["sections"]["projects"]["items"][number];
      return itemContainer(
        entry.id,
        styles.item,
        <>
          <div
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"
            style={styles.itemHeader}
          >
            <div style={{ minWidth: 0 }}>
              <div style={styles.itemTitle}>
                <PreviewLinkedTitle
                  title={entry.projectName}
                  link={entry.projectLink}
                  style={styles.itemTitle}
                />
              </div>
            </div>
            <div style={styles.itemDate}>
              {renderDateRange(entry.startDate, entry.endDate)}
            </div>
          </div>
          <PreviewRichTextBlock
            content={entry.description}
            className="[&_p]:m-0 [&_p+p]:mt-2"
            style={styles.richText}
          />
        </>,
      );
    },
    education: (item) => {
      const entry =
        item as ResumeDraft["sections"]["education"]["items"][number];
      return itemContainer(
        entry.id,
        styles.item,
        <>
          <div
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"
            style={styles.itemHeader}
          >
            <div style={{ minWidth: 0 }}>
              <div style={styles.itemTitle}>{entry.degree}</div>
              <div style={styles.itemMeta}>
                {joinParts([entry.name, entry.location])}
              </div>
            </div>
            <div style={styles.itemDate}>
              {renderDateRange(entry.startDate, entry.endDate)}
            </div>
          </div>
          {entry.gpa ? <div style={styles.itemMeta}>GPA: {entry.gpa}</div> : null}
          <PreviewRichTextBlock
            content={entry.description}
            className="[&_p]:m-0 [&_p+p]:mt-2"
            style={styles.richText}
          />
        </>,
      );
    },
    publications: (item) => {
      const entry =
        item as ResumeDraft["sections"]["publications"]["items"][number];
      return itemContainer(
        entry.id,
        styles.item,
        <>
          <div
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"
            style={styles.itemHeader}
          >
            <div style={{ minWidth: 0 }}>
              <div style={styles.itemTitle}>
                <PreviewLinkedTitle
                  title={entry.title}
                  link={entry.publicationUrl}
                  style={styles.itemTitle}
                />
              </div>
              <div style={styles.itemMeta}>{entry.publisher}</div>
            </div>
            <div style={styles.itemDate}>{entry.publicationDate}</div>
          </div>
          <PreviewRichTextBlock
            content={entry.description}
            className="[&_p]:m-0 [&_p+p]:mt-2"
            style={styles.richText}
          />
        </>,
      );
    },
    certifications: (item) => {
      const entry =
        item as ResumeDraft["sections"]["certifications"]["items"][number];
      return itemContainer(
        entry.id,
        styles.item,
        <>
          <div
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"
            style={styles.itemHeader}
          >
            <div style={{ minWidth: 0 }}>
              <div style={styles.itemTitle}>
                <PreviewLinkedTitle
                  title={entry.certificationName}
                  link={entry.certificationLink}
                  style={styles.itemTitle}
                />
              </div>
              <div style={styles.itemMeta}>{entry.issuingOrganization}</div>
            </div>
            <div style={styles.itemDate}>{entry.issuedDate}</div>
          </div>
          {entry.credentialId ? (
            <div style={styles.itemMeta}>
              Credential ID: {entry.credentialId}
            </div>
          ) : null}
        </>,
      );
    },
    awards: (item) => {
      const entry = item as ResumeDraft["sections"]["awards"]["items"][number];
      return itemContainer(
        entry.id,
        styles.item,
        <>
          <div
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"
            style={styles.itemHeader}
          >
            <div style={{ minWidth: 0 }}>
              <div style={styles.itemTitle}>{entry.title}</div>
              <div style={styles.itemMeta}>{entry.issuer}</div>
            </div>
            <div style={styles.itemDate}>{entry.issuedDate}</div>
          </div>
          <PreviewRichTextBlock
            content={entry.description}
            className="[&_p]:m-0 [&_p+p]:mt-2"
            style={styles.richText}
          />
        </>,
      );
    },
    languages: (item) => {
      const entry =
        item as ResumeDraft["sections"]["languages"]["items"][number];
      return (
        <div
          key={entry.id}
          className="last:border-b-0 last:pb-0"
          style={styles.splitRow}
        >
          <div style={styles.itemTitle}>{entry.language}</div>
          <div style={styles.itemMeta}>{entry.proficiency}</div>
        </div>
      );
    },
    references: (item) => {
      const entry =
        item as ResumeDraft["sections"]["references"]["items"][number];
      return itemContainer(
        entry.id,
        styles.item,
        <>
          <div style={styles.itemTitle}>{entry.name}</div>
          <div style={styles.itemMeta}>{entry.background}</div>
          <div style={styles.itemMeta}>{entry.contactDetails}</div>
        </>,
      );
    },
    organizationVolunteering: (item) => {
      const entry =
        item as ResumeDraft["sections"]["organizationVolunteering"]["items"][number];
      return itemContainer(
        entry.id,
        styles.item,
        <>
          <div
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"
            style={styles.itemHeader}
          >
            <div style={{ minWidth: 0 }}>
              <div style={styles.itemTitle}>{entry.position}</div>
              <div style={styles.itemMeta}>{entry.organizationName}</div>
            </div>
            <div>
              <div style={styles.itemDate}>
                {renderDateRange(entry.startDate, entry.endDate)}
              </div>
              {entry.location ? (
                <div style={styles.itemMeta}>{entry.location}</div>
              ) : null}
            </div>
          </div>
          <PreviewRichTextBlock
            content={entry.description}
            className="[&_p]:m-0 [&_p+p]:mt-2"
            style={styles.richText}
          />
        </>,
      );
    },
  };
}
