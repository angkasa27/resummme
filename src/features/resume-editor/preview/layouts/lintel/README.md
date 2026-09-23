# Lintel — `lintel`

## Preview

| Lintel Harbour | Lintel Forest | Lintel Plum |
| --- | --- | --- |
| ![Lintel Harbour template](../../../../../../public/templates/lintel-harbour.webp) | ![Lintel Forest template](../../../../../../public/templates/lintel-forest.webp) | ![Lintel Plum template](../../../../../../public/templates/lintel-plum.webp) |

Every section opens with its heading centred on a full-width tinted band — the
lintel — and the page under it is plain: a date gutter on the left carrying the
date with the place beneath it, and a body on the right that opens with the
organisation in bold and the role italic on the same line. The header sets the
name and role on one baseline, contacts as a two-column grid of boxed glyphs,
and a round photo holding the right edge.

**The accent is spent twice**, both on the band: the tint behind the heading and
the words on it. Everything else, the name included, is the neutral text colour.

## What you would see

- **Headings** — centred, `h2`, bold, on a band of `color-mix(in srgb, var(--resume-accent) 5%, transparent)` running the full measure. It stops at the page margin, not the paper edge: a band bleeding out would read as a rail, and every section carries one.
- **Header** — name (`0.8 × h1`, bold, `--resume-text`) and role (italic, `1.1 × h2`) sharing a baseline; round photo (`3.4 × h1` wide, `1 / 1`, radius 50%) at the right.
- **Contacts** — a two-column grid, each field led by a **bare glyph** (`1em`, so it tracks the type) in the text colour — no chip, no box.
- **Items** — a two-track grid: a fixed `150px` gutter holding the date with the place (muted) stacked under it, and the right track opening `**Organisation**, *role*` on one line before the bullets. The comma is drawn by the role's `::before`, so an item with no role never shows one.
- **Skills** — a flat three-column bullet grid: every term from every group, group names dropped.
- **Link cue** — `underline dotted` for contacts and item titles alike; the headings own a painted band, so the links take the plainly quieter mark.

## Wiring

`createSingleColumnLayout` with a `renderSection` override for the skills grid ·
own `Header` and `itemViews` · no `renderSectionHeading` — the band is CSS, not
markup · no `hideSummaryHeading`, so Summary gets a lintel like every other
section.

## Watch out

- **The band needs both `print-color-adjust` properties.** Drop either and the
  exported PDF loses every heading band, which is the design.
- **The tint is `color-mix` on the accent, not a second variable**, so it tracks
  whatever accent the user picks — and the accent has to stay dark enough to
  read as heading text against its own 5% tint. That is what the presets are
  curated for.
- **Three fixed skill tracks, not `auto-fit`.** The count is the look; letting
  it flex gave five thin columns on A4 and two on JIS B5.
- **`.name-block` is a column by default.** The shared rule stacks the name and
  role; this layout sets `flex-direction: row` explicitly to put them on one
  baseline.
- **Every item keeps the two-track grid**, skills and languages included: an
  item view with foreign DOM drops its children into the date gutter.

## ATS

Rated `pass`. Headings are centred on a pale tinted band. Items hang off a 150px gutter holding the date with the place under it: two short lines beside the title and first bullet. Skills are a three-across list; row order does not matter for keyword matching.
