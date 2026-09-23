# Dossier — `dossier`

## Preview

| Dossier Navy | Dossier Forest |
| --- | --- |
| ![Dossier Navy template](../../../../../../public/templates/dossier-navy.webp) | ![Dossier Forest template](../../../../../../public/templates/dossier-forest.webp) |

The mirror of Split: the wide main column runs down the **left** carrying the
photo, name and history, and a narrow `0.34fr` rail painted `--resume-secondary`
runs down the **right** holding the contacts and the short sections. The rail
starts well below the top edge, so the name gets the top of the page to itself.

## What you would see

- **Page shape** — `1fr | 0.34fr` grid, no gap. Full-bleed: the rail paints to the right, top and bottom paper edges.
- **The rail** — `--resume-secondary` background with `--resume-on-secondary` text, `--resume-text` and `--resume-muted` (78%) locally reassigned. Its top padding is **3× the page margin**, so its first block lands beside the summary rather than beside the name.
- **Main headings** — sentence case at `1.3 × h2`, weight 800, tracking `-0.01em`. They read as chapter titles, not as the uppercase labels the shared rule sets.
- **Rail headings** — `1.05 × h2`, weight 800, sentence case, on-secondary. A step above the item titles they head, or the rail has no hierarchy.
- **Header** — 64px **circular** photo on the left, then the name, separated by `--resume-gap-section` so the gap matches the document's own section rhythm.
- **Name** — `1.1 × h1`, weight 800, in `--resume-text`.
- **Headline** — a tracked caption: `0.9 × meta`, uppercase, tracked `0.18em`, muted. Reads as a subtitle instead of competing with the name.
- **Dates** — in the main column, uppercase, tracked `0.12em`, at `0.86 × meta` — a caption under the bold title, separated by type rather than by another colour or rule.
- **Link cue** — 45%-opacity underline, softened for the coloured rail; the weight-800 headings stay dominant.

## Wiring

Own `Component` · `inlineTitleItemViews` with `RailSkillsItem` / `RailLanguagesItem`
swapped in for the two sections that land in the rail · `ContactRailBlocks` with
`detailVariant="stacked"` · `getColumn: getSideRailColumn`.

## Careful

The **main column is first in the DOM** as well as on screen — a screen reader
should hear the work history before the phone number. If you restructure, keep
that order. The rail's fill paints; both `print-color-adjust` properties are
required.

## ATS

Rated `fail`. The mirror of Split: a painted rail on the right (details, links, skills, certifications, languages, references) beside the history (`getColumn`).
