import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { getOrderedVisibleSectionKeys, sectionLabels } from "@/features/resume-editor/section-definitions";
import type { ResumeDraft } from "@/lib/resume/schema";
import { cn } from "@/lib/utils";

type ResumeDocumentProps = {
  draft: ResumeDraft;
  className?: string;
};

function renderHtml(content: string) {
  return { __html: content };
}

function renderCurrentDateLabel(value: string) {
  return value === "current" ? "Current" : value;
}

function renderItem(sectionKey: keyof ResumeDraft["sections"], item: unknown) {
  switch (sectionKey) {
    case "workExperience": {
      const entry = item as ResumeDraft["sections"]["workExperience"]["items"][number];
      return (
        <div key={entry.id} className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="font-semibold">{entry.position}</div>
              <div className="text-sm text-muted-foreground">
                {entry.companyName} · {entry.location}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {entry.startDate} - {renderCurrentDateLabel(entry.endDate)}
            </div>
          </div>
          <div dangerouslySetInnerHTML={renderHtml(entry.description)} />
        </div>
      );
    }
    case "skills": {
      const entry = item as ResumeDraft["sections"]["skills"]["items"][number];
      return (
        <div key={entry.id} className="flex flex-col gap-1">
          <div className="font-semibold">{entry.categoryName}</div>
          <div className="text-sm text-muted-foreground">{entry.skills.join(", ")}</div>
        </div>
      );
    }
    case "projects": {
      const entry = item as ResumeDraft["sections"]["projects"]["items"][number];
      return (
        <div key={entry.id} className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="font-semibold">{entry.projectName}</div>
              {entry.projectLink ? (
                <a className="text-sm text-primary underline underline-offset-4" href={entry.projectLink}>
                  {entry.projectLink}
                </a>
              ) : null}
            </div>
            <div className="text-sm text-muted-foreground">
              {entry.startDate} - {renderCurrentDateLabel(entry.endDate)}
            </div>
          </div>
          <div dangerouslySetInnerHTML={renderHtml(entry.description)} />
        </div>
      );
    }
    case "education": {
      const entry = item as ResumeDraft["sections"]["education"]["items"][number];
      return (
        <div key={entry.id} className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="font-semibold">{entry.degree}</div>
              <div className="text-sm text-muted-foreground">
                {entry.name} · {entry.location}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {entry.startDate} - {renderCurrentDateLabel(entry.endDate)}
            </div>
          </div>
          {entry.gpa ? <div className="text-sm text-muted-foreground">GPA: {entry.gpa}</div> : null}
          <div dangerouslySetInnerHTML={renderHtml(entry.description)} />
        </div>
      );
    }
    case "publications": {
      const entry = item as ResumeDraft["sections"]["publications"]["items"][number];
      return (
        <div key={entry.id} className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="font-semibold">{entry.title}</div>
              <div className="text-sm text-muted-foreground">{entry.publisher}</div>
            </div>
            <div className="text-sm text-muted-foreground">{entry.publicationDate}</div>
          </div>
          {entry.publicationUrl ? (
            <a className="text-sm text-primary underline underline-offset-4" href={entry.publicationUrl}>
              {entry.publicationUrl}
            </a>
          ) : null}
          <div dangerouslySetInnerHTML={renderHtml(entry.description)} />
        </div>
      );
    }
    case "certifications": {
      const entry = item as ResumeDraft["sections"]["certifications"]["items"][number];
      return (
        <div key={entry.id} className="flex flex-col gap-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="font-semibold">{entry.certificationName}</div>
              <div className="text-sm text-muted-foreground">{entry.issuingOrganization}</div>
            </div>
            <div className="text-sm text-muted-foreground">{entry.issuedDate}</div>
          </div>
          {entry.certificationLink ? (
            <a className="text-sm text-primary underline underline-offset-4" href={entry.certificationLink}>
              {entry.certificationLink}
            </a>
          ) : null}
          {entry.credentialId ? (
            <div className="text-sm text-muted-foreground">Credential ID: {entry.credentialId}</div>
          ) : null}
        </div>
      );
    }
    case "awards": {
      const entry = item as ResumeDraft["sections"]["awards"]["items"][number];
      return (
        <div key={entry.id} className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="font-semibold">{entry.title}</div>
              <div className="text-sm text-muted-foreground">{entry.issuer}</div>
            </div>
            <div className="text-sm text-muted-foreground">{entry.issuedDate}</div>
          </div>
          <div dangerouslySetInnerHTML={renderHtml(entry.description)} />
        </div>
      );
    }
    case "languages": {
      const entry = item as ResumeDraft["sections"]["languages"]["items"][number];
      return (
        <div key={entry.id} className="flex items-baseline justify-between gap-2">
          <div className="font-medium">{entry.language}</div>
          <div className="text-sm text-muted-foreground">{entry.proficiency}</div>
        </div>
      );
    }
    case "references": {
      const entry = item as ResumeDraft["sections"]["references"]["items"][number];
      return (
        <div key={entry.id} className="flex flex-col gap-1">
          <div className="font-semibold">{entry.name}</div>
          <div className="text-sm text-muted-foreground">{entry.background}</div>
          <div className="text-sm text-muted-foreground">{entry.contactDetails}</div>
        </div>
      );
    }
    case "organizationVolunteering": {
      const entry = item as ResumeDraft["sections"]["organizationVolunteering"]["items"][number];
      return (
        <div key={entry.id} className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="font-semibold">{entry.position}</div>
              <div className="text-sm text-muted-foreground">
                {entry.organizationName} · {entry.location}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {entry.startDate} - {renderCurrentDateLabel(entry.endDate)}
            </div>
          </div>
          <div dangerouslySetInnerHTML={renderHtml(entry.description)} />
        </div>
      );
    }
    default:
      return null;
  }
}

export function ResumeDocument({ draft, className }: ResumeDocumentProps) {
  const orderedSectionKeys = getOrderedVisibleSectionKeys(draft.sections);
  const contactItems = [
    draft.profile.location,
    draft.profile.phone,
    draft.profile.email,
    ...draft.profile.extraLinks.map((link) => link.label),
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
          <p className="mt-2 text-sm text-muted-foreground">{contactItems.join(" • ")}</p>
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

      {draft.sections.summary.visible ? (
        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Summary
          </h2>
          <div dangerouslySetInnerHTML={renderHtml(draft.sections.summary.content)} />
        </section>
      ) : null}

      {orderedSectionKeys.map((sectionKey) => {
        const section = draft.sections[sectionKey];

        if (section.items.length === 0) {
          return null;
        }

        return (
          <section key={sectionKey} className="flex flex-col gap-3">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {sectionLabels[sectionKey]}
            </h2>
            <div className="flex flex-col gap-4">
              {section.items.map((item) => renderItem(sectionKey, item))}
            </div>
          </section>
        );
      })}
    </article>
  );
}
