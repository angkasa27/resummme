# Editorial — `editorial`

## Preview

| Editorial Sand | Editorial Sage |
| --- | --- |
| ![Editorial Sand template](../../../../../../public/templates/editorial-sand.webp) | ![Editorial Sage template](../../../../../../public/templates/editorial-sage.webp) |

A magazine opening. The top of the page is a tinted band running to three edges,
carrying the masthead — photo, uppercase name over a heavy rule, contacts set
flush right — and beneath it the summary set as a **display-size pull quote**.
Below the band, items are spreads: a title column on the left, prose on the
right, separated by generous air.

## What you would see

- **Page shape** — full-bleed opening band, then a body that keeps the side and bottom margins (`page-inset-x page-inset-b`). Section gaps at `2×`, item gaps at `2×`.
- **The band** — `--resume-secondary-tint` (the secondary hue at 90% white). A wash, not a solid: the summary is set on it at display size and has to stay readable across six or seven lines.
- **The masthead** — photo (76px, `3 / 4`, radius 0) on the left, name block in the middle, contacts flush right, all over a **2px `--resume-text`** bottom rule that closes the block with a clean edge at both ends.
- **Name** — `0.78 × h1`, weight 700, **uppercase**, line-height 1.15.
- **The pull quote** — the summary at `0.66 × h1`, line-height 1.4, left-aligned, running the **full width** of the band. Its own `<h2>` is suppressed (`hideSummaryHeading`).
- **Section headings** — deliberately **tiny**: `0.95 × meta`, weight 700, sentence case, `--resume-text`. Smaller than the item titles beneath them, because the items are the content and the section name is only a filing marker.
- **Items** — a spread: `0.42fr | 1fr`. Title and date in the left column, prose in the right. Item titles at `1.25 × h3`, weight 700.
- **The item rule** — every item after the first is preceded by an 18px × 2px text-coloured rule, **absolutely positioned** above it. As a block it pushed only the left column down and the prose sat level with the rule; positioned, both columns start on the same line.
- **Link cue** — a `0.5px` hairline. Its headings are the smallest of all twenty layouts; only a hairline stays under them.

## Wiring

Own `Component` (the summary renders *inside* the opening band, not in the section
flow) · own `editorialItemViews` (they emit `.item-lead` and `.item-body`) · own
`header.tsx` (`.editorial-masthead`, `.editorial-reach`, `.editorial-place`).

## Careful

`slots.summary` is lifted out of the normal flow into the band — that is the
layout's whole idea, and it is why `hideSummaryHeading` is set. The band's tint
paints, as does the item rule; both need both `print-color-adjust` properties.

## ATS

Rated `warn`. A tinted band header, then the summary as a large pull quote with no heading. Each item is a spread: title, employer and place wrap over several lines in a `0.42fr` left column while the bullets run in the right one. A parser reading line by line splices the title into the first bullets. The DOM order is fine; the geometry is the risk.
