import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
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
              {section.items.map((item) => renderSectionItem(sectionKey, item))}
            </div>
          </section>
        );
      })}
    </article>
  );
}
