import type { CSSProperties, ReactNode } from "react";

import { PreviewLinkedTitle } from "@/features/resume-editor/preview/kit/linked-title";
import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import { createClassicItemStyles, itemContainer } from "./styles";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import type {
  PreviewRenderContext,
  PreviewSectionItemRendererMap,
} from "@/features/resume-editor/preview/types";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

const regularWeightStyle: CSSProperties = { fontWeight: 400 };

function renderCompactMetaLine({
  title,
  titleLink,
  subtitle,
  trailing,
  body,
  styles,
}: {
  title: string;
  titleLink?: string;
  subtitle?: string;
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
        <div style={styles.itemTitle}>
          <PreviewLinkedTitle
            title={title}
            link={titleLink}
            style={styles.itemTitle}
          />
        </div>
        {trailing ? <div style={styles.itemDate}>{trailing}</div> : null}
      </div>
      {subtitle ? (
        <p style={{ ...styles.classicBody, ...styles.itemMeta }}>{subtitle}</p>
      ) : null}
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

function renderSplitHeader(
  styles: ReturnType<typeof createClassicItemStyles>,
  left: ReactNode,
  right: ReactNode,
) {
  return (
    <div
      className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"
      style={styles.header}
    >
      <div className="min-w-0 flex flex-col" style={{ gap: styles.item.gap }}>
        {left}
      </div>
      <div className="flex flex-col items-end" style={{ gap: styles.item.gap }}>
        {right}
      </div>
    </div>
  );
}

export function createClassicItemRenderers(
  context: PreviewRenderContext,
): PreviewSectionItemRendererMap {
  const styles = createClassicItemStyles(context.presentation);
  const subtitleRegular: CSSProperties = {
    ...styles.itemMeta,
    color: context.presentation.bodyTextColor,
  };

  return {
    workExperience: (item) => {
      const entry =
        item as ResumeDraft["sections"]["workExperience"]["items"][number];
      return itemContainer(
        entry.id,
        styles.item,
        <>
          {renderSplitHeader(
            styles,
            <>
              <div style={styles.itemTitle}>{entry.position}</div>
              <div style={subtitleRegular}>{entry.companyName}</div>
            </>,
            <>
              <div style={styles.itemDate}>
                {renderDateRange(entry.startDate, entry.endDate)}
              </div>
              {entry.location ? (
                <div style={subtitleRegular}>{entry.location}</div>
              ) : null}
            </>,
          )}
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
          {renderCompactMetaLine({
            styles,
            title: entry.categoryName,
            subtitle: entry.skills.join(", "),
          })}
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
            <div style={styles.itemTitle}>
              <PreviewLinkedTitle
                title={entry.projectName}
                link={entry.projectLink}
                style={styles.itemTitle}
              />
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
      const subtitleText = [entry.degree ? entry.name : null, entry.location]
        .filter(Boolean)
        .join(" · ");

      return itemContainer(
        entry.id,
        styles.item,
        <>
          {renderSplitHeader(
            styles,
            <>
              <div style={styles.itemTitle}>{entry.degree || entry.name}</div>
              {subtitleText ? (
                <div style={subtitleRegular}>{subtitleText}</div>
              ) : null}
            </>,
            <>
              <div style={styles.itemDate}>
                {renderDateRange(entry.startDate, entry.endDate)}
              </div>
              {entry.gpa ? (
                <div style={styles.itemDate}>
                  GPA: <span style={regularWeightStyle}>{entry.gpa}</span>
                </div>
              ) : null}
            </>,
          )}
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
          // byConnector: entry.publisher ? "on" : undefined,
          // byTarget: entry.publisher || undefined,
          trailing: entry.publicationDate,
          body: entry.description,
          styles,
        }),
      );
    },
    certifications: (item) => {
      const entry =
        item as ResumeDraft["sections"]["certifications"]["items"][number];
      const credential = entry.credentialId
        ? `Credential ID: ${entry.credentialId}`
        : undefined;
      const issued = entry.issuingOrganization
        ? `Issued by ${entry.issuingOrganization}`
        : undefined;
      const subtitle = [issued, credential].filter(Boolean).join(" · ");

      return itemContainer(
        entry.id,
        styles.item,
        renderCompactMetaLine({
          title: entry.certificationName,
          titleLink: entry.certificationLink || undefined,
          subtitle: subtitle,
          trailing: entry.issuedDate,
          styles,
        }),
      );
    },
    awards: (item) => {
      const entry = item as ResumeDraft["sections"]["awards"]["items"][number];
      const issuer = entry.issuer ? `by ${entry.issuer}` : undefined;

      return itemContainer(
        entry.id,
        styles.item,
        renderCompactMetaLine({
          title: entry.title,
          // byConnector: entry.issuer ? "by" : undefined,
          // byTarget: entry.issuer || undefined,
          trailing: entry.issuedDate,
          subtitle: issuer,
          body: entry.description,
          styles,
        }),
      );
    },
    languages: (item) => {
      const entry =
        item as ResumeDraft["sections"]["languages"]["items"][number];
      return itemContainer(
        entry.id,
        styles.item,
        <>
          {renderSplitHeader(
            styles,
            <>
              <div style={styles.itemTitle}>{entry.language}</div>
            </>,
            <>
              <div style={subtitleRegular}>{entry.proficiency}</div>
            </>,
          )}
        </>,
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
          <div style={subtitleRegular}>{entry.background}</div>
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
          {renderSplitHeader(
            styles,
            <>
              <div style={styles.itemTitle}>{entry.position}</div>
              <div style={subtitleRegular}>{entry.organizationName}</div>
            </>,
            <>
              <div style={styles.itemDate}>
                {renderDateRange(entry.startDate, entry.endDate)}
              </div>
              {entry.location ? (
                <div style={subtitleRegular}>{entry.location}</div>
              ) : null}
            </>,
          )}
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
