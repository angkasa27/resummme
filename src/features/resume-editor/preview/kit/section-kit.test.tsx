import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  DateRange,
  ItemList,
  PhotoFrame,
  SectionHeading,
  SectionShell,
} from "@/features/resume-editor/preview/kit/section-kit";

// These primitives exist so new layouts can compose their own layout while
// still emitting the class/data contract the shared CSS targets. Lock that
// contract — a drift here would silently break every layout built on them.
describe("section-kit primitives", () => {
  it("SectionShell emits a data-section section with the standard heading", () => {
    const html = renderToStaticMarkup(
      <SectionShell sectionKey="skills" heading="Skills">
        <span>body</span>
      </SectionShell>,
    );
    expect(html).toBe(
      '<section class="section" data-section="skills">' +
        '<h2 class="section-heading" data-testid="resume-preview-section-heading">Skills</h2>' +
        "<span>body</span>" +
        "</section>",
    );
  });

  it("SectionHeading carries the testid used by the preview", () => {
    expect(renderToStaticMarkup(<SectionHeading>Work</SectionHeading>)).toBe(
      '<h2 class="section-heading" data-testid="resume-preview-section-heading">Work</h2>',
    );
  });

  it("ItemList wraps children in .item-list", () => {
    expect(
      renderToStaticMarkup(
        <ItemList>
          <div>x</div>
        </ItemList>,
      ),
    ).toBe('<div class="item-list"><div>x</div></div>');
  });

  // React hoists an image <link rel="preload"> ahead of an isolated <img>, so
  // assert the frame markup with toContain rather than exact equality.
  it("PhotoFrame emits the photo-frame slot with a default class", () => {
    expect(
      renderToStaticMarkup(<PhotoFrame src="/a.png" alt="Jane" />),
    ).toContain(
      '<div class="header-photo" data-slot="photo-frame"><img src="/a.png" alt="Jane"/></div>',
    );
  });

  it("PhotoFrame honours a custom class", () => {
    expect(
      renderToStaticMarkup(
        <PhotoFrame src="/a.png" alt="Jane" className="side-photo" />,
      ),
    ).toContain(
      '<div class="side-photo" data-slot="photo-frame"><img src="/a.png" alt="Jane"/></div>',
    );
  });

  it("DateRange renders the shared date-range string", () => {
    expect(
      renderToStaticMarkup(<DateRange startDate="Jan 2024" endDate="current" />),
    ).toBe("Jan 2024 - Current");
  });
});
