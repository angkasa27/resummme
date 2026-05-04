import type { ResolvedPdfPresentation } from "@/lib/resume/pdf-presentation";
import {
  sanitizeRichTextHref,
  sanitizeRichTextHtml,
  shouldOpenHrefInNewTab,
} from "@/lib/resume/sanitize-rich-text";
import type { ResumeDraft } from "@/lib/resume/schema";

function renderHtml(content: string) {
  return { __html: sanitizeRichTextHtml(content) };
}

function renderCurrentDateLabel(value: string) {
  return value === "current" ? "Current" : value;
}

function joinParts(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" · ");
}

function compactJoin(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function createItemStyles(presentation: ResolvedPdfPresentation) {
  const isClassicCentered = presentation.layoutId === "classic-centered";

  return {
    item: {
      display: "flex",
      flexDirection: "column" as const,
      gap: `${presentation.sectionBodyGapPx}px`,
      paddingBottom: isClassicCentered
        ? "0px"
        : `${presentation.itemPaddingBottomPx}px`,
      borderBottom: isClassicCentered
        ? "0px solid transparent"
        : `1px solid ${presentation.itemBorderColor}`,
    },
    itemHeader: {
      display: "flex",
      flexWrap: "wrap" as const,
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "12px",
    },
    classicHeader: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
      alignItems: "start",
      gap: "12px",
    },
    itemTitle: {
      fontFamily: presentation.headingFontFamily,
      fontSize: `${presentation.titleFontSizePx}px`,
      fontWeight: presentation.headingWeight,
      lineHeight: String(presentation.titleLineHeight),
      color: presentation.bodyTextColor,
    },
    itemSubTitle: {
      fontFamily:
        presentation.layoutId === "classic-centered"
          ? presentation.headingFontFamily
          : presentation.bodyFontFamily,
      fontSize: `${presentation.metaFontSizePx}px`,
      fontWeight: presentation.layoutId === "classic-centered" ? 700 : 400,
      lineHeight: String(presentation.bodyLineHeight),
      color: presentation.bodyTextColor,
    },
    itemMeta: {
      fontSize: `${presentation.metaFontSizePx}px`,
      lineHeight: String(presentation.bodyLineHeight),
      color: presentation.mutedTextColor,
    },
    itemDate: {
      textAlign: "right" as const,
      fontSize: `${presentation.dateFontSizePx}px`,
      fontWeight: presentation.layoutId === "classic-centered" ? 700 : 600,
      lineHeight: String(presentation.bodyLineHeight),
      color:
        presentation.layoutId === "classic-centered"
          ? presentation.bodyTextColor
          : presentation.mutedTextColor,
    },
    itemDateMuted: {
      textAlign: "right" as const,
      fontSize: `${presentation.metaFontSizePx}px`,
      fontWeight: 700,
      lineHeight: String(presentation.bodyLineHeight),
      color: presentation.bodyTextColor,
    },
    richText: {
      fontSize: `${presentation.metaFontSizePx}px`,
      lineHeight: String(presentation.bodyLineHeight),
      color: presentation.bodyTextColor,
      textAlign: "justify" as const,
    },
    classicBody: {
      paddingLeft: "18px",
      paddingRight: "12px",
    },
    classicSectionInset: {
      paddingLeft: "8px",
    },
    link: {
      fontSize: `${presentation.metaFontSizePx}px`,
      lineHeight: String(presentation.bodyLineHeight),
      color: presentation.accentColor,
      textDecoration: "underline",
      // textUnderlineOffset: "4px",
      overflowWrap: "anywhere" as const,
    },
    splitRow: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: "12px",
      paddingBottom:
        presentation.layoutId === "classic-centered"
          ? "0px"
          : `${Math.max(12, presentation.itemPaddingBottomPx - 4)}px`,
      borderBottom:
        presentation.layoutId === "classic-centered"
          ? "0px solid transparent"
          : `1px solid ${presentation.itemBorderColor}`,
    },
  };
}

function renderLinkedItemTitle({
  title,
  link,
  styles,
}: {
  title: string;
  link?: string;
  styles: ReturnType<typeof createItemStyles>;
}) {
  const safeHref = link ? sanitizeRichTextHref(link) : null;
  const shouldOpenInNewTab = safeHref
    ? shouldOpenHrefInNewTab(safeHref)
    : false;

  if (!safeHref) {
    return <span>{title}</span>;
  }

  return (
    <a
      href={safeHref}
      target={shouldOpenInNewTab ? "_blank" : undefined}
      rel={shouldOpenInNewTab ? "noopener noreferrer" : undefined}
      style={{
        ...styles.itemTitle,
        color: styles.link.color,
        textDecoration: "underline",
        // textUnderlineOffset: styles.link.textUnderlineOffset,
        overflowWrap: styles.link.overflowWrap,
      }}
    >
      {title}
    </a>
  );
}

function renderDateRange(startDate?: string, endDate?: string, fallback = "") {
  if (startDate || endDate) {
    return `${startDate || ""}${startDate || endDate ? " - " : ""}${renderCurrentDateLabel(endDate || "")}`.trim();
  }

  return fallback;
}

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
  styles: ReturnType<typeof createItemStyles>;
}) {
  return (
    <>
      <div
        className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"
        style={styles.classicHeader}
      >
        <div style={styles.classicSectionInset}>
          <div style={styles.itemTitle}>
            {renderLinkedItemTitle({ title, link: titleLink, styles })}
            {suffix ? ` ${suffix}` : null}
          </div>
        </div>
        {trailing ? <div style={styles.itemDate}>{trailing}</div> : null}
      </div>
      {body ? (
        <div
          data-classic-description="true"
          className="[&_p]:m-0 [&_p+p]:mt-2"
          style={{ ...styles.richText, ...styles.classicBody }}
          dangerouslySetInnerHTML={renderHtml(body)}
        />
      ) : null}
    </>
  );
}

export function renderSectionItem(
  sectionKey: keyof ResumeDraft["sections"],
  item: unknown,
  presentation: ResolvedPdfPresentation,
) {
  const styles = createItemStyles(presentation);
  const isClassicCentered = presentation.layoutId === "classic-centered";

  switch (sectionKey) {
    case "workExperience": {
      const entry =
        item as ResumeDraft["sections"]["workExperience"]["items"][number];
      return (
        <div
          key={entry.id}
          className="flex flex-col last:border-b-0 last:pb-0"
          style={styles.item}
        >
          <div
            className={
              isClassicCentered
                ? "grid grid-cols-[minmax(0,1fr)_auto] gap-3"
                : "flex flex-wrap items-start justify-between gap-3"
            }
            style={isClassicCentered ? styles.classicHeader : styles.itemHeader}
          >
            <div>
              <div style={styles.itemTitle}>{entry.position}</div>
              <div
                style={
                  isClassicCentered ? styles.itemSubTitle : styles.itemMeta
                }
              >
                {entry.companyName}
              </div>
            </div>
            <div>
              <div style={styles.itemDate}>
                {renderDateRange(entry.startDate, entry.endDate)}
              </div>
              {isClassicCentered && entry.location ? (
                <div style={styles.itemDateMuted}>{entry.location}</div>
              ) : null}
              {!isClassicCentered && entry.location ? (
                <div style={styles.itemMeta}>{entry.location}</div>
              ) : null}
            </div>
          </div>
          <div
            data-classic-description={isClassicCentered ? "true" : undefined}
            className="[&_p]:m-0 [&_p+p]:mt-2"
            style={
              isClassicCentered
                ? { ...styles.richText, ...styles.classicBody }
                : styles.richText
            }
            dangerouslySetInnerHTML={renderHtml(entry.description)}
          />
        </div>
      );
    }
    case "skills": {
      const entry = item as ResumeDraft["sections"]["skills"]["items"][number];
      return (
        <div
          key={entry.id}
          className="flex flex-col last:border-b-0 last:pb-0"
          style={styles.item}
        >
          <div style={styles.itemTitle}>{entry.categoryName}</div>
          <div style={isClassicCentered ? styles.richText : styles.itemMeta}>
            {entry.skills.join(", ")}
          </div>
        </div>
      );
    }
    case "projects": {
      const entry =
        item as ResumeDraft["sections"]["projects"]["items"][number];
      return (
        <div
          key={entry.id}
          className="flex flex-col last:border-b-0 last:pb-0"
          style={styles.item}
        >
          <div
            className={
              isClassicCentered
                ? "grid grid-cols-[minmax(0,1fr)_auto] gap-3"
                : "flex flex-wrap items-start justify-between gap-3"
            }
            style={isClassicCentered ? styles.classicHeader : styles.itemHeader}
          >
            <div>
              <div style={styles.itemTitle}>
                {renderLinkedItemTitle({
                  title: entry.projectName,
                  link: entry.projectLink,
                  styles,
                })}
              </div>
            </div>
            <div style={styles.itemDate}>
              {renderDateRange(entry.startDate, entry.endDate)}
            </div>
          </div>
          <div
            data-classic-description={isClassicCentered ? "true" : undefined}
            className="[&_p]:m-0 [&_p+p]:mt-2"
            style={
              isClassicCentered
                ? { ...styles.richText, ...styles.classicBody }
                : styles.richText
            }
            dangerouslySetInnerHTML={renderHtml(entry.description)}
          />
        </div>
      );
    }
    case "education": {
      const entry =
        item as ResumeDraft["sections"]["education"]["items"][number];
      return (
        <div
          key={entry.id}
          className="flex flex-col last:border-b-0 last:pb-0"
          style={styles.item}
        >
          <div
            className={
              isClassicCentered
                ? "grid grid-cols-[minmax(0,1fr)_auto] gap-3"
                : "flex flex-wrap items-start justify-between gap-3"
            }
            style={isClassicCentered ? styles.classicHeader : styles.itemHeader}
          >
            <div>
              <div style={styles.itemTitle}>
                {isClassicCentered ? entry.name : entry.degree}
              </div>
              <div
                style={
                  isClassicCentered ? styles.itemSubTitle : styles.itemMeta
                }
              >
                {isClassicCentered
                  ? joinParts([entry.degree, entry.location])
                  : joinParts([entry.name, entry.location])}
              </div>
            </div>
            <div style={styles.itemDate}>
              {renderDateRange(entry.startDate, entry.endDate)}
            </div>
          </div>
          {entry.gpa ? (
            <div
              style={
                isClassicCentered
                  ? { ...styles.itemMeta, ...styles.classicBody }
                  : styles.itemMeta
              }
            >
              GPA: {entry.gpa}
            </div>
          ) : null}
          <div
            data-classic-description={isClassicCentered ? "true" : undefined}
            className="[&_p]:m-0 [&_p+p]:mt-2"
            style={
              isClassicCentered
                ? { ...styles.richText, ...styles.classicBody }
                : styles.richText
            }
            dangerouslySetInnerHTML={renderHtml(entry.description)}
          />
        </div>
      );
    }
    case "publications": {
      const entry =
        item as ResumeDraft["sections"]["publications"]["items"][number];
      if (isClassicCentered) {
        return (
          <div
            key={entry.id}
            className="flex flex-col last:border-b-0 last:pb-0"
            style={styles.item}
          >
            {renderCompactMetaLine({
              title: entry.title,
              titleLink: entry.publicationUrl || undefined,
              suffix: entry.publisher ? `on ${entry.publisher}` : undefined,
              trailing: entry.publicationDate,
              body: entry.description,
              styles,
            })}
          </div>
        );
      }
      return (
        <div
          key={entry.id}
          className="flex flex-col last:border-b-0 last:pb-0"
          style={styles.item}
        >
          <div
            className={
              isClassicCentered
                ? "grid grid-cols-[minmax(0,1fr)_auto] gap-3"
                : "flex flex-wrap items-start justify-between gap-3"
            }
            style={isClassicCentered ? styles.classicHeader : styles.itemHeader}
          >
            <div>
              <div style={styles.itemTitle}>
                {renderLinkedItemTitle({
                  title: entry.title,
                  link: entry.publicationUrl,
                  styles,
                })}
              </div>
              <div
                style={
                  isClassicCentered ? styles.itemSubTitle : styles.itemMeta
                }
              >
                {entry.publisher}
              </div>
            </div>
            <div style={styles.itemDate}>{entry.publicationDate}</div>
          </div>
          <div
            className="[&_p]:m-0 [&_p+p]:mt-2"
            style={styles.richText}
            dangerouslySetInnerHTML={renderHtml(entry.description)}
          />
        </div>
      );
    }
    case "certifications": {
      const entry =
        item as ResumeDraft["sections"]["certifications"]["items"][number];
      if (isClassicCentered) {
        const suffix = compactJoin([
          entry.credentialId
            ? `(Credential ID: ${entry.credentialId})`
            : undefined,
          entry.issuingOrganization
            ? `by ${entry.issuingOrganization}`
            : undefined,
        ]);

        return (
          <div
            key={entry.id}
            className="flex flex-col last:border-b-0 last:pb-0"
            style={styles.item}
          >
            {renderCompactMetaLine({
              title: entry.certificationName,
              titleLink: entry.certificationLink || undefined,
              suffix: suffix || undefined,
              trailing: entry.issuedDate,
              styles,
            })}
          </div>
        );
      }
      return (
        <div
          key={entry.id}
          className="flex flex-col last:border-b-0 last:pb-0"
          style={styles.item}
        >
          <div
            className={
              isClassicCentered
                ? "grid grid-cols-[minmax(0,1fr)_auto] gap-3"
                : "flex flex-wrap items-start justify-between gap-3"
            }
            style={isClassicCentered ? styles.classicHeader : styles.itemHeader}
          >
            <div>
              <div style={styles.itemTitle}>
                {renderLinkedItemTitle({
                  title: entry.certificationName,
                  link: entry.certificationLink,
                  styles,
                })}
              </div>
              <div
                style={
                  isClassicCentered ? styles.itemSubTitle : styles.itemMeta
                }
              >
                {entry.issuingOrganization}
              </div>
            </div>
            <div style={styles.itemDate}>{entry.issuedDate}</div>
          </div>
          {entry.credentialId ? (
            <div style={styles.itemMeta}>
              Credential ID: {entry.credentialId}
            </div>
          ) : null}
        </div>
      );
    }
    case "awards": {
      const entry = item as ResumeDraft["sections"]["awards"]["items"][number];
      if (isClassicCentered) {
        return (
          <div
            key={entry.id}
            className="flex flex-col last:border-b-0 last:pb-0"
            style={styles.item}
          >
            {renderCompactMetaLine({
              title: entry.title,
              suffix: entry.issuer ? `by ${entry.issuer}` : undefined,
              trailing: entry.issuedDate,
              body: entry.description,
              styles,
            })}
          </div>
        );
      }
      return (
        <div
          key={entry.id}
          className="flex flex-col last:border-b-0 last:pb-0"
          style={styles.item}
        >
          <div
            className={
              isClassicCentered
                ? "grid grid-cols-[minmax(0,1fr)_auto] gap-3"
                : "flex flex-wrap items-start justify-between gap-3"
            }
            style={isClassicCentered ? styles.classicHeader : styles.itemHeader}
          >
            <div>
              <div style={styles.itemTitle}>{entry.title}</div>
              <div
                style={
                  isClassicCentered ? styles.itemSubTitle : styles.itemMeta
                }
              >
                {entry.issuer}
              </div>
            </div>
            <div style={styles.itemDate}>{entry.issuedDate}</div>
          </div>
          <div
            className="[&_p]:m-0 [&_p+p]:mt-2"
            style={styles.richText}
            dangerouslySetInnerHTML={renderHtml(entry.description)}
          />
        </div>
      );
    }
    case "languages": {
      const entry =
        item as ResumeDraft["sections"]["languages"]["items"][number];
      if (isClassicCentered) {
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
      }
      return (
        <div
          key={entry.id}
          className="last:border-b-0 last:pb-0"
          style={styles.splitRow}
        >
          <div style={styles.itemTitle}>{entry.language}</div>
          <div style={isClassicCentered ? styles.itemDate : styles.itemMeta}>
            {entry.proficiency}
          </div>
        </div>
      );
    }
    case "references": {
      const entry =
        item as ResumeDraft["sections"]["references"]["items"][number];
      return (
        <div
          key={entry.id}
          className="flex flex-col last:border-b-0 last:pb-0"
          style={styles.item}
        >
          <div style={styles.itemTitle}>{entry.name}</div>
          <div
            style={isClassicCentered ? styles.itemSubTitle : styles.itemMeta}
          >
            {entry.background}
          </div>
          <div style={styles.itemMeta}>{entry.contactDetails}</div>
        </div>
      );
    }
    case "organizationVolunteering": {
      const entry =
        item as ResumeDraft["sections"]["organizationVolunteering"]["items"][number];
      return (
        <div
          key={entry.id}
          className="flex flex-col last:border-b-0 last:pb-0"
          style={styles.item}
        >
          <div
            className={
              isClassicCentered
                ? "grid grid-cols-[minmax(0,1fr)_auto] gap-3"
                : "flex flex-wrap items-start justify-between gap-3"
            }
            style={isClassicCentered ? styles.classicHeader : styles.itemHeader}
          >
            <div>
              <div style={styles.itemTitle}>{entry.position}</div>
              <div
                style={
                  isClassicCentered ? styles.itemSubTitle : styles.itemMeta
                }
              >
                {entry.organizationName}
              </div>
            </div>
            <div>
              <div style={styles.itemDate}>
                {renderDateRange(entry.startDate, entry.endDate)}
              </div>
              {isClassicCentered && entry.location ? (
                <div style={styles.itemDateMuted}>{entry.location}</div>
              ) : null}
              {!isClassicCentered && entry.location ? (
                <div style={styles.itemMeta}>{entry.location}</div>
              ) : null}
            </div>
          </div>
          <div
            data-classic-description={isClassicCentered ? "true" : undefined}
            className="[&_p]:m-0 [&_p+p]:mt-2"
            style={
              isClassicCentered
                ? { ...styles.richText, ...styles.classicBody }
                : styles.richText
            }
            dangerouslySetInnerHTML={renderHtml(entry.description)}
          />
        </div>
      );
    }
    default:
      return null;
  }
}
