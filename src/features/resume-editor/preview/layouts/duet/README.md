# Duet — `duet`

## Preview

| Duet Stone | Duet Harbor |
| --- | --- |
| ![Duet Stone template](../../../../../../public/templates/duet-stone.webp) | ![Duet Harbor template](../../../../../../public/templates/duet-harbor.webp) |

Two near-even columns, the left one painted solid `--resume-accent`. Unlike Split
(a narrow supporting rail), Duet's left column is a real second column at
`0.8fr` — it carries the header, the photo, the contacts *and* the summary, so the
right column stays purely chronological. Every section heading on both grounds is
a centred, tinted band.

## What you would see

- **Page shape** — `0.8fr | 1fr` grid, no gap. Full-bleed: the accent column paints to the left, top and bottom edges.
- **Left column, in order** — the header (name + headline), a stacked iconic contact line, the summary, then the side sections (skills, languages, certifications, references).
- **Left column colour** — `--resume-accent` background, `--resume-on-accent` text, with `--resume-text`, `--resume-muted` (78%) and `--resume-border` (30%) locally reassigned.
- **Right column** — plain white, holding the work history and everything else.
- **Section headings** — a centred band: `--resume-secondary` at 16% opacity behind secondary-coloured text, `4px 8px` of padding, no border. In the accent column the band switches to `--resume-on-accent` at 12% with on-accent text.
- **Name** — `--resume-on-accent`, since it sits on the painted column.
- **Photo** — 150px tall, circular by default, `align-self: flex-start` (without that the flex column stretches the frame into an ellipse).
- **Insets** — page margin on the bleeding edges, `--resume-gutter` on the inner edges of both columns.
- **Rail typography** — item headers and item rows stack; the column is too narrow for a title and a date on one line.
- **Link cue** — 45%-opacity underline; the banded headings are already the strongest element on both grounds.

## Wiring

Own `Component` · **`splitItemViews`, imported from `../split/items`** ·
`getColumn: getSideRailColumn`.

## Careful

`slots.header` renders *inside* the left column, not above the grid — that's the
structural difference from every other rail layout. Item views are borrowed from
Split, so editing `split/items.tsx` changes this layout too. The band backgrounds
and the column fill all paint; keep both `print-color-adjust` properties.

## ATS

Rated `fail`. Two near-even columns (`getColumn`). The left carries the header, contacts, the summary and the side sections; the right carries the history. The summary itself is in the side column.
