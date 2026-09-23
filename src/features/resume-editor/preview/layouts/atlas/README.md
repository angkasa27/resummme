# Atlas — `atlas`

## Preview

| Atlas Onyx | Atlas Marine |
| --- | --- |
| ![Atlas Onyx template](../../../../../../public/templates/atlas-onyx.webp) | ![Atlas Marine template](../../../../../../public/templates/atlas-marine.webp) |

A tiled page. Sections pair off into rows of two cells laid over three equal
tracks: the first section of each pair is **wide** (two tracks) and the second is
**narrow** (one). Position decides the shape, so reordering sections reshapes the
whole page. Every item title carries a filled accent counter disc, and the name is
the largest type in any layout.

## What you would see

- **Page shape** — header, then a lede row, then a flex column of tiling rows. Standard page margin.
- **Header** — `1fr | 0.32fr` grid, `align-items: stretch`. Name at the top of the left cell, contacts pushed to its **foot** (`justify-content: space-between`), so the identity block fills the photo's height instead of leaving dead paper.
- **Name** — `2.1 × h1`, weight 800, line-height **0.95**, tracking `-0.04em`, in `--resume-text`.
- **Contacts** — a 2-column grid under the name, not one long list, which would push the name's block taller than the photo.
- **Photo** — fills its track, square by default, radius 0.
- **The lede** — a `2fr | 1fr` row under a `1px --resume-text` top rule: the **headline used as an `<h2>`** plus the summary on the left, the Links block on the right. The summary's own heading is suppressed (`hideSummaryHeading`) — under the huge name it would read as a second line of the same block.
- **The rows** — `.atlas-row` is a 3-track grid; `.atlas-cell[data-span="wide"]` spans 2, `narrow` spans 1. A wide cell runs **its own items two-up**, so every item on the page is exactly one track across.
- **Section headings** — `--resume-h3`, weight **400**, sentence case, no tracking, over a `1px --resume-text` top rule.
- **Item numbers** — a filled disc before every title: `counter(resume-item)` in a `1.45em` circle of `--resume-accent` with on-accent text. Drawn from a counter, not a glyph, so it keeps going past ❿ where the Unicode dingbats stop. The counter **resets per section**.
- **Link cue** — **dotted** underline. The flat 400-weight headings are quiet, so the cue has to be quieter still.

## Wiring

Own `Component` · `inlineTitleItemViews` · own `header.tsx` (`.atlas-identity`) ·
`hideSummaryHeading: true`.

## Careful

Rows are real block siblings marked **`data-page-unit=""`**, not implicit grid
rows: the pagination pass moves a row whole, and a spacer inside a grid would
reflow the entire tiling. Known limit — a row taller than a page still spills into
the next page's margin band; fixing it means paginating the wide cell's two
columns as separate flows. The counter discs paint; keep both
`print-color-adjust` properties.

## ATS

Rated `fail`. Sections tile across three tracks, and a wide cell runs its own items two-up, so two roles sit side by side on one row. Worse than a rail.
