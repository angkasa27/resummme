import type { ReactNode } from "react";

import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { renderDateRange } from "@/features/resume-editor/preview/helpers/date";
import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";

/**
 * Reusable primitives for authoring a layout's Component or a custom
 * `renderSection`. They emit the SAME class / `data-*` / `data-testid` contract
 * as the shared `LayoutSection` scaffold, so a layout that composes its own
 * layout out of these stays consistent with the CSS every layout's stylesheet
 * targets. Nothing existing imports these yet — they exist to make genuinely
 * distinct layouts cheap to build.
 */

/** `<section>` wrapper with the standard heading; caller supplies the body. */
export function SectionShell({
  sectionKey,
  heading,
  children,
}: {
  sectionKey: CollectionSectionKey;
  heading: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="section" data-section={sectionKey}>
      <SectionHeading>{heading}</SectionHeading>
      {children}
    </section>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      className="section-heading"
      data-testid="resume-preview-section-heading"
    >
      {children}
    </h2>
  );
}

export function ItemList({ children }: { children: ReactNode }) {
  return <div className="item-list">{children}</div>;
}

export function PhotoFrame({
  src,
  alt,
  className = "header-photo",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={className} data-slot="photo-frame">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
    </div>
  );
}

export function DateRange({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
}) {
  return <>{renderDateRange(startDate, endDate)}</>;
}

export { PreviewContactLine };
