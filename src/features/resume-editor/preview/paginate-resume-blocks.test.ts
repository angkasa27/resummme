import { describe, expect, it } from "vitest";

import {
  paginateResumeBlocks,
  type ResumeLayoutBlock,
} from "@/features/resume-editor/preview/paginate-resume-blocks";

describe("paginate resume blocks", () => {
  it("moves a section-start block onto the next page when it does not fit", () => {
    const blocks: ResumeLayoutBlock[] = [
      { key: "header", height: 400, splittable: false },
      { key: "summary", height: 250, splittable: false },
      { key: "work-1", height: 300, splittable: false },
    ];

    const pages = paginateResumeBlocks(blocks, 700);

    expect(pages).toEqual([["header", "summary"], ["work-1"]]);
  });

  it("keeps regular items together when they fit on a fresh page", () => {
    const blocks: ResumeLayoutBlock[] = [
      { key: "section-start", height: 500, splittable: false },
      { key: "item-2", height: 260, splittable: false },
      { key: "item-3", height: 200, splittable: false },
    ];

    const pages = paginateResumeBlocks(blocks, 700);

    expect(pages).toEqual([["section-start"], ["item-2", "item-3"]]);
  });
});
