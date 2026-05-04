import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getOrderedVisibleSectionKeys,
  isCollectionSectionKey,
  sectionLabels,
} from "@/features/resume-editor/config/section-metadata";
import { renderSectionItem } from "@/features/resume-editor/preview/render-section-item";
import { resolvePdfPresentation } from "@/lib/resume/pdf-presentation";
import {
  sanitizeRichTextHref,
  sanitizeRichTextHtml,
  shouldOpenHrefInNewTab,
} from "@/lib/resume/sanitize-rich-text";
import type { ResumeDraft } from "@/lib/resume/schema";
import { cn } from "@/lib/utils";

type ResumeDocumentProps = {
  draft: ResumeDraft;
  className?: string;
  mode?: "preview" | "pdf";
};

function renderHtml(content: string) {
  return { __html: sanitizeRichTextHtml(content) };
}

function richTextHasContent(value: string) {
  return (
    value
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim().length > 0
  );
}

function hasRenderableItem(
  sectionKey: keyof ResumeDraft["sections"],
  item: unknown
) {
  if (sectionKey === "workExperience") {
    const value =
      item as ResumeDraft["sections"]["workExperience"]["items"][number];
    return Boolean(
      value.companyName ||
        value.position ||
        value.location ||
        value.startDate ||
        value.endDate ||
        richTextHasContent(value.description)
    );
  }

  if (sectionKey === "skills") {
    const value = item as ResumeDraft["sections"]["skills"]["items"][number];
    return Boolean(value.categoryName || value.skills.some(Boolean));
  }

  if (sectionKey === "projects") {
    const value = item as ResumeDraft["sections"]["projects"]["items"][number];
    return Boolean(
      value.projectName ||
        value.projectLink ||
        value.startDate ||
        value.endDate ||
        richTextHasContent(value.description)
    );
  }

  if (sectionKey === "education") {
    const value = item as ResumeDraft["sections"]["education"]["items"][number];
    return Boolean(
      value.name ||
        value.location ||
        value.startDate ||
        value.endDate ||
        value.degree ||
        value.gpa ||
        richTextHasContent(value.description)
    );
  }

  if (sectionKey === "publications") {
    const value =
      item as ResumeDraft["sections"]["publications"]["items"][number];
    return Boolean(
      value.title ||
        value.publisher ||
        value.publicationUrl ||
        value.publicationDate ||
        richTextHasContent(value.description)
    );
  }

  if (sectionKey === "certifications") {
    const value =
      item as ResumeDraft["sections"]["certifications"]["items"][number];
    return Boolean(
      value.certificationName ||
        value.issuingOrganization ||
        value.issuedDate ||
        value.certificationLink ||
        value.credentialId
    );
  }

  if (sectionKey === "awards") {
    const value = item as ResumeDraft["sections"]["awards"]["items"][number];
    return Boolean(
      value.title ||
        value.issuer ||
        value.issuedDate ||
        richTextHasContent(value.description)
    );
  }

  if (sectionKey === "languages") {
    const value = item as ResumeDraft["sections"]["languages"]["items"][number];
    return Boolean(value.language || value.proficiency);
  }

  if (sectionKey === "references") {
    const value =
      item as ResumeDraft["sections"]["references"]["items"][number];
    return Boolean(value.name || value.background || value.contactDetails);
  }

  if (sectionKey === "organizationVolunteering") {
    const value =
      item as ResumeDraft["sections"]["organizationVolunteering"]["items"][number];
    return Boolean(
      value.organizationName ||
        value.position ||
        value.location ||
        value.startDate ||
        value.endDate ||
        richTextHasContent(value.description)
    );
  }

  return false;
}

function formatSectionHeading(
  sectionLabel: string,
  layoutId: ResumeDraft["pdfPresentation"]["layoutId"]
) {
  return layoutId === "classic-centered"
    ? sectionLabel.toUpperCase()
    : sectionLabel;
}

export function ResumeDocument({
  draft,
  className,
  mode = "preview",
}: ResumeDocumentProps) {
  const presentation = resolvePdfPresentation(draft.pdfPresentation);
  const orderedSectionKeys = getOrderedVisibleSectionKeys(draft.sections);
  const isClassicCentered = presentation.layoutId === "classic-centered";

  const contactItems = [
    { kind: "text" as const, value: draft.profile.location },
    { kind: "text" as const, value: draft.profile.phone },
    { kind: "text" as const, value: draft.profile.email },
    ...draft.profile.extraLinks
      .map((link) => sanitizeRichTextHref(link.url))
      .filter((value): value is string => Boolean(value))
      .map((value) => ({ kind: "link" as const, value })),
  ].filter((item) => Boolean(item.value));

  return (
    <article
      style={{
        fontFamily: presentation.bodyFontFamily,
        fontSize: `${presentation.bodyFontSizePx}px`,
        lineHeight: String(presentation.bodyLineHeight),
        color: presentation.bodyTextColor,
        gap: `${presentation.articleGapPx}px`,
      }}
      className={cn(
        mode === "preview"
          ? "resume-document mx-0 flex min-h-[297mm] w-[210mm] max-w-none flex-col bg-white px-9 py-10 ring-1 ring-border print:min-h-0 print:max-w-none print:bg-white print:ring-0"
          : "resume-document mx-0 flex min-h-0 w-[186mm] max-w-none flex-col bg-white px-0 py-0 ring-0",
        className
      )}
    >
      <header
        data-layout={presentation.layoutId}
        className={cn(
          "border-b pb-5",
          isClassicCentered
            ? "flex flex-col items-center gap-3 text-center"
            : "flex items-start justify-between gap-6"
        )}
      >
        {draft.profile.photo && isClassicCentered ? (
          <Avatar size="lg" className="size-18 border">
            <AvatarImage src={draft.profile.photo} alt={draft.profile.fullName} />
            <AvatarFallback>
              {draft.profile.fullName
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </AvatarFallback>
          </Avatar>
        ) : null}

        <div className={cn("flex-1", isClassicCentered && "w-full")}>
          <h1
            className={cn("tracking-[-0.03em]", isClassicCentered && "text-balance")}
            data-testid="resume-preview-full-name"
            style={{
              fontFamily: presentation.headingFontFamily,
              fontSize: `${presentation.nameFontSizePx}px`,
              fontWeight: presentation.headingWeight,
              lineHeight: "1.1",
            }}
          >
            {draft.profile.fullName}
          </h1>
          <p
            className={cn(
              "wrap-break-word",
              isClassicCentered ? "mx-auto mt-2 max-w-full" : "mt-2 max-w-152"
            )}
            style={{
              fontSize: `${presentation.contactFontSizePx}px`,
              lineHeight: String(Math.max(1.45, presentation.bodyLineHeight - 0.1)),
              color: presentation.mutedTextColor,
            }}
          >
            {contactItems.map((item, index) => {
              const label =
                index === 0
                  ? `Location: ${item.value}`
                  : index === 1
                    ? `Phone: ${item.value}`
                    : index === 2
                      ? `Email: ${item.value}`
                      : `Link: ${item.value}`;
              return (
                <span key={`${item.kind}-${item.value}-${index}`}>
                  {index > 0 ? " • " : null}
                  {item.kind === "link" ? (
                    <a
                      href={item.value}
                      aria-label={label}
                      target={shouldOpenHrefInNewTab(item.value) ? "_blank" : undefined}
                      rel={
                        shouldOpenHrefInNewTab(item.value)
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="underline underline-offset-4"
                      style={{ color: presentation.accentColor }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span aria-hidden="true">{item.value}</span>
                  )}
                </span>
              );
            })}
          </p>
        </div>

        {draft.profile.photo && !isClassicCentered ? (
          <Avatar size="lg" className="size-16 border">
            <AvatarImage src={draft.profile.photo} alt={draft.profile.fullName} />
            <AvatarFallback>
              {draft.profile.fullName
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </AvatarFallback>
          </Avatar>
        ) : null}
      </header>

      {orderedSectionKeys.map((sectionKey) => {
        if (sectionKey === "summary") {
          if (!richTextHasContent(draft.sections.summary.content)) {
            return null;
          }

          if (isClassicCentered) {
            return (
              <section key={sectionKey} className="space-y-3">
                {presentation.layout.summaryLabelVisible ? (
                  <h2
                    className="border-b pb-1"
                    style={{
                      fontFamily: presentation.headingFontFamily,
                      fontSize: `${presentation.sectionLabelFontSizePx}px`,
                      fontWeight: presentation.sectionLabelWeight,
                      letterSpacing: `${presentation.sectionLabelLetterSpacingEm}em`,
                      textTransform: presentation.sectionLabelTransform,
                      borderColor: presentation.itemBorderColor,
                    }}
                  >
                    {formatSectionHeading("Summary", presentation.layoutId)}
                  </h2>
                ) : null}
                <div
                  className="[&_p]:m-0"
                  style={{ overflowWrap: "anywhere" }}
                  dangerouslySetInnerHTML={renderHtml(draft.sections.summary.content)}
                />
              </section>
            );
          }

          return (
            <section
              key={sectionKey}
              className="grid gap-3 sm:grid-cols-[110px_1fr]"
            >
              <h2
                className="text-muted-foreground"
                data-testid="resume-preview-section-heading"
                style={{
                  fontFamily: presentation.headingFontFamily,
                  fontSize: `${presentation.sectionLabelFontSizePx}px`,
                  fontWeight: presentation.sectionLabelWeight,
                  letterSpacing: `${presentation.sectionLabelLetterSpacingEm}em`,
                  textTransform: presentation.sectionLabelTransform,
                  color: presentation.mutedTextColor,
                }}
              >
                Summary
              </h2>
              <div
                className="[&_p]:m-0"
                style={{ overflowWrap: "anywhere" }}
                dangerouslySetInnerHTML={renderHtml(draft.sections.summary.content)}
              />
            </section>
          );
        }

        if (!isCollectionSectionKey(sectionKey)) {
          return null;
        }

        const section = draft.sections[sectionKey];
        const renderableItems = section.items.filter((item) =>
          hasRenderableItem(sectionKey, item)
        );

        if (renderableItems.length === 0) {
          return null;
        }

        const sectionHeading = formatSectionHeading(
          sectionLabels[sectionKey],
          presentation.layoutId
        );

        if (isClassicCentered) {
          return (
            <section key={sectionKey} className="space-y-4">
              <div className="border-b pb-1" style={{ borderColor: presentation.itemBorderColor }}>
                <h2
                  data-testid="resume-preview-section-heading"
                  style={{
                    fontFamily: presentation.headingFontFamily,
                    fontSize: `${presentation.sectionLabelFontSizePx}px`,
                    fontWeight: presentation.sectionLabelWeight,
                    letterSpacing: `${presentation.sectionLabelLetterSpacingEm}em`,
                    textTransform: presentation.sectionLabelTransform,
                    color: presentation.bodyTextColor,
                  }}
                >
                  {sectionHeading}
                </h2>
              </div>
              <div
                data-section-items={sectionKey}
                className="flex flex-col"
                style={{
                  gap: `${presentation.itemGapPx}px`,
                  paddingLeft: "8px",
                }}
              >
                {renderableItems.map((item) =>
                  renderSectionItem(sectionKey, item, presentation)
                )}
              </div>
            </section>
          );
        }

        return (
          <section
            key={sectionKey}
            className="grid gap-3 sm:grid-cols-[110px_1fr]"
          >
            <h2
              className="text-muted-foreground"
              data-testid="resume-preview-section-heading"
              style={{
                fontFamily: presentation.headingFontFamily,
                fontSize: `${presentation.sectionLabelFontSizePx}px`,
                fontWeight: presentation.sectionLabelWeight,
                letterSpacing: `${presentation.sectionLabelLetterSpacingEm}em`,
                textTransform: presentation.sectionLabelTransform,
                color: presentation.mutedTextColor,
              }}
            >
              {sectionHeading}
            </h2>
            <div
              data-section-items={sectionKey}
              className="flex flex-col"
              style={{ gap: `${presentation.itemGapPx}px` }}
            >
              {renderableItems.map((item) =>
                renderSectionItem(sectionKey, item, presentation)
              )}
            </div>
          </section>
        );
      })}
    </article>
  );
}
