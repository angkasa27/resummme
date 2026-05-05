import {
  PreviewLinkedTitle,
} from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import {
  createClassicItemStyles,
  itemContainer,
} from "./styles";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import { joinParts, compactJoin } from "@/features/resume-editor/preview/helpers/string";
import type {
  PreviewRenderContext,
  PreviewSectionItemRendererMap,
} from "@/features/resume-editor/preview/types";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

function renderCompactMetaLine({
  title,
  titleLink,
  suffix,
  trailing,
  body,
  styles,
}: {
  title: string;
  titleLink?: string;
  suffix?: string;
  trailing?: string;
  body?: string;
  styles: ReturnType<typeof createClassicItemStyles>;
}) {
  return (
    <>
      <div
        className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"
        style={styles.header}
      >
        <div style={styles.classicSectionInset}>
          <div style={styles.itemTitle}>
            <PreviewLinkedTitle
              title={title}
              link={titleLink}
              style={styles.itemTitle}
            />
            {suffix ? ` ${suffix}` : null}
          </div>
        </div>
        {trailing ? <div style={styles.itemDate}>{trailing}</div> : null}
      </div>
      {body ? (
        <PreviewRichTextBlock
          content={body}
          className="[&_p]:m-0 [&_p+p]:mt-2"
          style={{ ...styles.richText, ...styles.classicBody }}
          testId="true"
        />
      ) : null}
    </>
  );
}

export function createClassicItemRenderers(
  context: PreviewRenderContext,
): PreviewSectionItemRendererMap {
  const styles = createClassicItemStyles(context.presentation);

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
            style={styles.header}
          >
            <div>
              <div style={styles.itemTitle}>{entry.position}</div>
              <div style={styles.itemSubTitle}>{entry.companyName}</div>
            </div>
            <div>
              <div style={styles.itemDate}>
                {renderDateRange(entry.startDate, entry.endDate)}
              </div>
              {entry.location ? (
                <div style={styles.itemDateMuted}>{entry.location}</div>
              ) : null}
            </div>
          </div>
          <PreviewRichTextBlock
            content={entry.description}
            className="[&_p]:m-0 [&_p+p]:mt-2"
            style={{ ...styles.richText, ...styles.classicBody }}
            testId="true"
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
          <div style={styles.richText}>{entry.skills.join(", ")}</div>
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
            style={styles.header}
          >
            <div>
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
            style={{ ...styles.richText, ...styles.classicBody }}
            testId="true"
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
            style={styles.header}
          >
            <div>
              <div style={styles.itemTitle}>{entry.name}</div>
              <div style={styles.itemSubTitle}>
                {joinParts([entry.degree, entry.location])}
              </div>
            </div>
            <div style={styles.itemDate}>
              {renderDateRange(entry.startDate, entry.endDate)}
            </div>
          </div>
          {entry.gpa ? (
            <div style={{ ...styles.itemMeta, ...styles.classicBody }}>
              GPA: {entry.gpa}
            </div>
          ) : null}
          <PreviewRichTextBlock
            content={entry.description}
            className="[&_p]:m-0 [&_p+p]:mt-2"
            style={{ ...styles.richText, ...styles.classicBody }}
            testId="true"
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
        renderCompactMetaLine({
          title: entry.title,
          titleLink: entry.publicationUrl || undefined,
          suffix: entry.publisher ? `on ${entry.publisher}` : undefined,
          trailing: entry.publicationDate,
          body: entry.description,
          styles,
        }),
      );
    },
    certifications: (item) => {
      const entry =
        item as ResumeDraft["sections"]["certifications"]["items"][number];
      const suffix = compactJoin([
        entry.credentialId
          ? `(Credential ID: ${entry.credentialId})`
          : undefined,
        entry.issuingOrganization ? `by ${entry.issuingOrganization}` : undefined,
      ]);

      return itemContainer(
        entry.id,
        styles.item,
        renderCompactMetaLine({
          title: entry.certificationName,
          titleLink: entry.certificationLink || undefined,
          suffix: suffix || undefined,
          trailing: entry.issuedDate,
          styles,
        }),
      );
    },
    awards: (item) => {
      const entry = item as ResumeDraft["sections"]["awards"]["items"][number];
      return itemContainer(
        entry.id,
        styles.item,
        renderCompactMetaLine({
          title: entry.title,
          suffix: entry.issuer ? `by ${entry.issuer}` : undefined,
          trailing: entry.issuedDate,
          body: entry.description,
          styles,
        }),
      );
    },
    languages: (item) => {
      const entry =
        item as ResumeDraft["sections"]["languages"]["items"][number];
      return (
        <div
          key={entry.id}
          className="last:border-b-0 last:pb-0"
          style={{
            ...styles.splitRow,
            ...styles.classicSectionInset,
            justifyContent: "flex-start",
          }}
        >
          <div style={styles.itemTitle}>
            {entry.language}
            {entry.proficiency ? (
              <span
                style={{ ...styles.itemMeta, color: styles.itemTitle.color }}
              >
                {" "}
                ({entry.proficiency})
              </span>
            ) : null}
          </div>
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
          <div style={styles.itemSubTitle}>{entry.background}</div>
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
            style={styles.header}
          >
            <div>
              <div style={styles.itemTitle}>{entry.position}</div>
              <div style={styles.itemSubTitle}>{entry.organizationName}</div>
            </div>
            <div>
              <div style={styles.itemDate}>
                {renderDateRange(entry.startDate, entry.endDate)}
              </div>
              {entry.location ? (
                <div style={styles.itemDateMuted}>{entry.location}</div>
              ) : null}
            </div>
          </div>
          <PreviewRichTextBlock
            content={entry.description}
            className="[&_p]:m-0 [&_p+p]:mt-2"
            style={{ ...styles.richText, ...styles.classicBody }}
            testId="true"
          />
        </>,
      );
    },
  };
}
