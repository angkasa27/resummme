# Compass — `compass`

## Preview

| Compass Slate | Compass Cerulean |
| --- | --- |
| ![Compass Slate template](../../../../../../public/templates/compass-slate.webp) | ![Compass Cerulean template](../../../../../../public/templates/compass-cerulean.webp) |

Section headings marked by a lucide glyph that **hangs in the margin**: the icon
sits left of the heading text, and the body indents to line up with the *text*,
not the icon — so the glyphs read as a marginal index running down the page. A
narrow, unpainted rail on the right carries the contacts and the short sections.

## What you would see

- **Page shape** — header across the top, then a `1fr | 0.38fr` body grid with `--resume-gutter` between the columns. Standard page margin; nothing bleeds.
- **The indent** — one derived number, `--compass-indent: --compass-heading + 10px`, where `--compass-heading` is `1.15 × h2`. Item lists and prose in the main column pad left by it, so they clear the hanging glyph and align with the heading text.
- **Section headings** — flex row, `10px` gap, at `--compass-heading`, weight 600, sentence case, no tracking, in `--resume-text`. The glyph is `1em`, `stroke-width: 2`, in `--resume-accent`.
- **The rail** — plain text, **no glyphs**: the icons are the main column's device, and repeating them would make the page all index and no content. Rail headings use the same type minus the icon.
- **Rail contents** — "Details" and "Links" blocks (stacked variant), then the side sections. Rail links are **accent-coloured**.
- **Header** — 56px square photo with 12px corners, then the name.
- **Name** — `1.15 × h1`, weight 700, `--resume-text`, with `line-height: 1.3` raised so descenders aren't clipped.
- **Link cue** — a solid `--resume-accent` underline, plus `.link-marker` arrows on linked item titles — it finishes the accent cue the rail links already carry, and the hanging glyphs make an arrow read native.

## Wiring

Own `Component` · `inlineTitleItemViews` with `RailSkillsItem` /
`RailLanguagesItem` swapped in · `ContactRailBlocks` with `detailVariant="stacked"`
· `renderSectionHeading: renderIconSectionHeading` (shared with `studio`) ·
`getColumn: getSideRailColumn`.

## Careful

The rail heading size is *deliberately* the same as the main column's: at
`--resume-h3` it matched the item titles beneath it and the rail read as one flat
list. A wrapping name pushes both columns down a whole line — that's accepted;
cropping the name is worse.

## ATS

Rated `fail`. A main column with icon headings beside a narrow unpainted rail on the right holding details, links and the short sections (`getColumn`).
