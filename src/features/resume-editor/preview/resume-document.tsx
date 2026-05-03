import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  isCollectionSectionKey,
  getOrderedVisibleSectionKeys,
  sectionLabels,
} from "@/features/resume-editor/config/section-metadata";
import { renderSectionItem } from "@/features/resume-editor/preview/render-section-item";
import type { ResumeDraft } from "@/lib/resume/schema";
import { cn } from "@/lib/utils";

type ResumeDocumentProps = {
  draft: ResumeDraft;
  className?: string;
};

function renderHtml(content: string) {
  return { __html: content };
}

function richTextHasContent(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim().length > 0;
}

function hasRenderableItem(
  sectionKey: keyof ResumeDraft["sections"],
  item: unknown,
) {
  if (sectionKey === "workExperience") {
    const value = item as ResumeDraft["sections"]["workExperience"]["items"][number];
    return Boolean(
      value.companyName ||
        value.position ||
        value.location ||
        value.startDate ||
        value.endDate ||
        richTextHasContent(value.description),
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
        richTextHasContent(value.description),
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
        richTextHasContent(value.description),
    );
  }

  if (sectionKey === "publications") {
    const value = item as ResumeDraft["sections"]["publications"]["items"][number];
    return Boolean(
      value.title ||
        value.publisher ||
        value.publicationUrl ||
        value.publicationDate ||
        richTextHasContent(value.description),
    );
  }

  if (sectionKey === "certifications") {
    const value = item as ResumeDraft["sections"]["certifications"]["items"][number];
    return Boolean(
      value.certificationName ||
        value.issuingOrganization ||
        value.issuedDate ||
        value.certificationLink ||
        value.credentialId,
    );
  }

  if (sectionKey === "awards") {
    const value = item as ResumeDraft["sections"]["awards"]["items"][number];
    return Boolean(
      value.title ||
        value.issuer ||
        value.issuedDate ||
        richTextHasContent(value.description),
    );
  }

  if (sectionKey === "languages") {
    const value = item as ResumeDraft["sections"]["languages"]["items"][number];
    return Boolean(value.language || value.proficiency);
  }

  if (sectionKey === "references") {
    const value = item as ResumeDraft["sections"]["references"]["items"][number];
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
        richTextHasContent(value.description),
    );
  }

  return false;
}

export function ResumeDocument({ draft, className }: ResumeDocumentProps) {
  const orderedSectionKeys = getOrderedVisibleSectionKeys(draft.sections);
  const contactItems = [
    draft.profile.location,
    draft.profile.phone,
    draft.profile.email,
    ...draft.profile.extraLinks.map((link) => link.url),
  ].filter(Boolean);

  return (
    <article
      className={cn(
        "resume-document mx-auto flex min-h-[297mm] w-full max-w-[210mm] flex-col gap-6 bg-background px-10 py-10 text-[13px] leading-6 text-foreground shadow-sm print:min-h-0 print:max-w-none print:shadow-none",
        className
      )}
    >
      <header className="flex items-start justify-between gap-6 border-b pb-5">
        <div className="flex-1">
          <h1 className="font-heading text-3xl font-semibold tracking-tight" data-testid="resume-preview-full-name">
            {draft.profile.fullName}
          </h1>
          <p className="mt-2 break-words text-sm text-muted-foreground">
            {contactItems.join(" • ")}
          </p>
        </div>
        {draft.profile.photo ? (
          <Avatar size="lg" className="size-16">
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
          return (
            <section key={sectionKey} className="flex flex-col gap-2">
              <h2
                className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                data-testid="resume-preview-section-heading"
              >
                Summary
              </h2>
              <div
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
          hasRenderableItem(sectionKey, item),
        );

        if (renderableItems.length === 0) {
          return null;
        }

        return (
          <section key={sectionKey} className="flex flex-col gap-3">
            <h2
              className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground"
              data-testid="resume-preview-section-heading"
            >
              {sectionLabels[sectionKey]}
            </h2>
            <div className="flex flex-col gap-4">
              {renderableItems.map((item) => renderSectionItem(sectionKey, item))}
            </div>
          </section>
        );
      })}
    </article>
  );
}
