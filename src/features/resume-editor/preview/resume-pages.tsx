"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getOrderedVisibleSectionKeys,
  isCollectionSectionKey,
  sectionLabels,
} from "@/features/resume-editor/config/section-metadata";
import {
  A4_HEIGHT_MM,
  A4_HEIGHT_PX,
  A4_WIDTH_MM,
  A4_WIDTH_PX,
  PAGE_CONTENT_HEIGHT_PX,
  PAGE_CONTENT_WIDTH_PX,
  PAGE_PADDING_MM,
  PREVIEW_HORIZONTAL_PADDING_PX,
  SCREEN_PAGE_GAP_PX,
} from "@/features/resume-editor/preview/page-metrics";
import { paginateResumeBlocks } from "@/features/resume-editor/preview/paginate-resume-blocks";
import { renderSectionItem } from "@/features/resume-editor/preview/render-section-item";
import {
  sanitizeRichTextHref,
  sanitizeRichTextHtml,
  shouldOpenHrefInNewTab,
} from "@/lib/resume/sanitize-rich-text";
import type { ResumeDraft } from "@/lib/resume/schema";
import { cn } from "@/lib/utils";

type ResumePagesProps = {
  draft: ResumeDraft;
  mode: "screen" | "print";
  className?: string;
  testId?: string;
};

export type ResumeRenderBlock = {
  key: string;
  node: ReactNode;
};

type RichTextFragment = {
  keySuffix: string;
  html: string;
};

const pageSheetStyle: CSSProperties = {
  width: `${A4_WIDTH_MM}mm`,
  height: `${A4_HEIGHT_MM}mm`,
};

const pageFrameStyle: CSSProperties = {
  height: `${A4_HEIGHT_MM}mm`,
  padding: `${PAGE_PADDING_MM}mm`,
};

const richTextSectionKeys = new Set<
  | "workExperience"
  | "projects"
  | "education"
  | "publications"
  | "awards"
  | "organizationVolunteering"
>([
  "workExperience",
  "projects",
  "education",
  "publications",
  "awards",
  "organizationVolunteering",
]);

function isRichTextSectionKey(
  sectionKey: keyof ResumeDraft["sections"]
): sectionKey is
  | "workExperience"
  | "projects"
  | "education"
  | "publications"
  | "awards"
  | "organizationVolunteering" {
  return richTextSectionKeys.has(
    sectionKey as
      | "workExperience"
      | "projects"
      | "education"
      | "publications"
      | "awards"
      | "organizationVolunteering"
  );
}

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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function serializeFragmentNode(node: ChildNode) {
  if (node.nodeType === Node.TEXT_NODE) {
    const textContent = node.textContent?.trim() ?? "";
    return textContent ? `<p>${escapeHtml(textContent)}</p>` : null;
  }

  if (!(node instanceof HTMLElement)) {
    return null;
  }

  if (node.tagName === "UL" || node.tagName === "OL") {
    const listTag = node.tagName.toLowerCase();
    const items = Array.from(node.children).filter(
      (child): child is HTMLLIElement => child instanceof HTMLLIElement
    );

    return items.map((item, index) => ({
      keySuffix: `${listTag}-${index + 1}`,
      html: `<${listTag}>${item.outerHTML}</${listTag}>`,
    }));
  }

  return [
    {
      keySuffix: `${node.tagName.toLowerCase()}-1`,
      html: node.outerHTML,
    },
  ];
}

function createRichTextFragments(content: string): RichTextFragment[] {
  const sanitized = sanitizeRichTextHtml(content);

  if (!richTextHasContent(sanitized)) {
    return [];
  }

  if (typeof DOMParser === "undefined") {
    return [{ keySuffix: "part-1", html: sanitized }];
  }

  const doc = new DOMParser().parseFromString(sanitized, "text/html");
  const fragments = Array.from(doc.body.childNodes).flatMap((node, index) => {
    const serialized = serializeFragmentNode(node);

    if (!serialized) {
      return [];
    }

    return Array.isArray(serialized)
      ? serialized
      : [{ keySuffix: `part-${index + 1}`, html: serialized }];
  });

  return fragments.length > 0
    ? fragments
    : [{ keySuffix: "part-1", html: sanitized }];
}

function getRichTextContent(
  sectionKey: keyof ResumeDraft["sections"],
  item: unknown
) {
  switch (sectionKey) {
    case "workExperience":
      return (
        item as ResumeDraft["sections"]["workExperience"]["items"][number]
      ).description;
    case "projects":
      return (item as ResumeDraft["sections"]["projects"]["items"][number])
        .description;
    case "education":
      return (item as ResumeDraft["sections"]["education"]["items"][number])
        .description;
    case "publications":
      return (
        item as ResumeDraft["sections"]["publications"]["items"][number]
      ).description;
    case "awards":
      return (item as ResumeDraft["sections"]["awards"]["items"][number])
        .description;
    case "organizationVolunteering":
      return (
        item as ResumeDraft["sections"]["organizationVolunteering"]["items"][number]
      ).description;
    default:
      return "";
  }
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

function renderHeaderBlock(draft: ResumeDraft) {
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
    <header className="flex items-start justify-between gap-6 border-b pb-5">
      <div className="flex-1">
        <h1
          className="text-3xl font-semibold leading-tight tracking-[-0.03em]"
          data-testid="resume-preview-full-name"
        >
          {draft.profile.fullName}
        </h1>
        <p className="mt-2 max-w-152 wrap-break-word text-[12px] leading-5 text-muted-foreground">
          {contactItems.map((item, index) => (
            <span key={`${item.kind}-${item.value}-${index}`}>
              {index > 0 ? " • " : null}
              {item.kind === "link" ? (
                <a
                  href={item.value}
                  target={
                    shouldOpenHrefInNewTab(item.value) ? "_blank" : undefined
                  }
                  rel={
                    shouldOpenHrefInNewTab(item.value)
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="underline underline-offset-4"
                >
                  {item.value}
                </a>
              ) : (
                item.value
              )}
            </span>
          ))}
        </p>
      </div>
      {draft.profile.photo ? (
        <Avatar size="lg" className="size-16 border">
          <AvatarImage
            src={draft.profile.photo}
            alt={draft.profile.fullName}
          />
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
  );
}

function renderSummaryBlock(content: string, showLabel: boolean) {
  return (
    <section className="grid gap-3 sm:grid-cols-[110px_1fr]">
      {showLabel ? (
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Summary
        </h2>
      ) : (
        <div aria-hidden="true" className="hidden sm:block" />
      )}
      <div
        className="[&_p]:m-0"
        dangerouslySetInnerHTML={renderHtml(content)}
      />
    </section>
  );
}

function renderCollectionBlock(
  sectionKey: keyof ResumeDraft["sections"],
  item: unknown,
  showSectionLabel: boolean,
  options?: {
    richTextHtml?: string;
    showHeader?: boolean;
    showDivider?: boolean;
  }
) {
  return (
    <section className="grid gap-3 sm:grid-cols-[110px_1fr]">
      {showSectionLabel ? (
        <h2
          className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          data-testid="resume-preview-section-heading"
        >
          {sectionLabels[sectionKey as keyof typeof sectionLabels]}
        </h2>
      ) : (
        <div aria-hidden="true" className="hidden sm:block" />
      )}
      <div>{renderSectionItem(sectionKey, item, options)}</div>
    </section>
  );
}

export function buildResumeBlocks(draft: ResumeDraft): ResumeRenderBlock[] {
  const orderedSectionKeys = getOrderedVisibleSectionKeys(draft.sections);
  const blocks: ResumeRenderBlock[] = [
    {
      key: "resume-header",
      node: renderHeaderBlock(draft),
    },
  ];

  for (const sectionKey of orderedSectionKeys) {
    if (sectionKey === "summary") {
      const fragments = createRichTextFragments(draft.sections.summary.content);

      fragments.forEach((fragment, index) => {
        blocks.push({
          key: `summary-block-${fragment.keySuffix}-${index + 1}`,
          node: renderSummaryBlock(fragment.html, index === 0),
        });
      });

      continue;
    }

    if (!isCollectionSectionKey(sectionKey)) {
      continue;
    }

    const renderableItems = draft.sections[sectionKey].items.filter((item) =>
      hasRenderableItem(sectionKey, item)
    );

    if (renderableItems.length === 0) {
      continue;
    }

    renderableItems.forEach((item, itemIndex) => {
      const itemId =
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        typeof item.id === "string"
          ? item.id
          : `${sectionKey}-${itemIndex}`;

      if (isRichTextSectionKey(sectionKey)) {
        const richTextFragments = createRichTextFragments(
          getRichTextContent(sectionKey, item)
        );

        if (richTextFragments.length > 1) {
          richTextFragments.forEach((fragment, fragmentIndex) => {
            blocks.push({
              key: `${sectionKey}-${itemId}-${fragment.keySuffix}-${fragmentIndex + 1}`,
              node: renderCollectionBlock(
                sectionKey,
                item,
                itemIndex === 0 && fragmentIndex === 0,
                {
                  richTextHtml: fragment.html,
                  showHeader: fragmentIndex === 0,
                  showDivider: fragmentIndex === richTextFragments.length - 1,
                }
              ),
            });
          });
          return;
        }
      }

      blocks.push({
        key: `${sectionKey}-${itemId}`,
        node: renderCollectionBlock(sectionKey, item, itemIndex === 0),
      });
    });
  }

  return blocks;
}

export function ResumePages({
  draft,
  mode,
  className,
  testId,
}: ResumePagesProps) {
  const blocks = useMemo(() => buildResumeBlocks(draft), [draft]);
  const measureRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [blockHeights, setBlockHeights] = useState<Record<string, number>>({});

  useLayoutEffect(() => {
    const nextHeights = Object.fromEntries(
      blocks.map((block) => [
        block.key,
        Math.ceil(
          measureRefs.current[block.key]?.getBoundingClientRect().height ?? 0
        ),
      ])
    );

    if (JSON.stringify(nextHeights) !== JSON.stringify(blockHeights)) {
      setBlockHeights(nextHeights);
    }
  }, [blocks, blockHeights]);

  useEffect(() => {
    if (mode !== "screen") {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      const availableWidth = width - PREVIEW_HORIZONTAL_PADDING_PX;

      if (availableWidth < A4_WIDTH_PX) {
        setScale(availableWidth / A4_WIDTH_PX);
      } else {
        setScale(1);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [mode]);

  const pages = useMemo(() => {
    const pageKeys = paginateResumeBlocks(
      blocks.map((block) => ({
        key: block.key,
        height: blockHeights[block.key] ?? 0,
        splittable: false,
      })),
      PAGE_CONTENT_HEIGHT_PX
    );

    return pageKeys.map((pageBlockKeys) =>
      pageBlockKeys.map((key) => blocks.find((block) => block.key === key)!)
    );
  }, [blockHeights, blocks]);

  const totalBaseHeight =
    pages.length * A4_HEIGHT_PX +
    Math.max(0, pages.length - 1) * SCREEN_PAGE_GAP_PX;

  const pagesMarkup = (
    <div
      className={cn(
        "flex flex-col items-center",
        mode === "screen" ? "gap-6" : "gap-0"
      )}
      style={mode === "screen" ? { width: `${A4_WIDTH_PX}px` } : undefined}
    >
      {pages.map((pageBlocks, index) => (
        <article
          key={`page-${index + 1}`}
          className={cn(
            "resume-page-sheet box-border bg-white text-[13px] leading-6 text-foreground",
            mode === "screen" && "shadow-md ring-1 ring-border"
          )}
          style={pageSheetStyle}
        >
          <div
            className="resume-document resume-page-frame box-border"
            style={pageFrameStyle}
          >
            <div className="resume-page-body flex flex-col gap-6">
              {pageBlocks.map((block) => (
                <div
                  key={block.key}
                  className="resume-page-block"
                  data-block-key={block.key}
                >
                  {block.node}
                </div>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <div
      ref={containerRef}
      data-testid={testId}
      className={cn(
        mode === "screen"
          ? "h-full min-h-0 overflow-y-auto overflow-x-hidden print:hidden"
          : "hidden print:block",
        className
      )}
    >
      {mode === "screen" ? (
        <div
          className="flex justify-center py-4 sm:py-6"
          style={{ height: `${Math.max(totalBaseHeight * scale, 0)}px` }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
            {pagesMarkup}
          </div>
        </div>
      ) : (
        pagesMarkup
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-[10000px] top-0 opacity-0"
      >
        <div
          className="resume-document box-border bg-white text-[13px] leading-6 text-foreground"
          style={{ width: `${PAGE_CONTENT_WIDTH_PX}px` }}
        >
          <div className="flex flex-col gap-6">
            {blocks.map((block) => (
              <div
                key={`measure-${block.key}`}
                ref={(node) => {
                  measureRefs.current[block.key] = node;
                }}
                className="resume-page-block"
              >
                {block.node}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
