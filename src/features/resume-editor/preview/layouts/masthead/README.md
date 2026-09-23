# Masthead — `masthead`

## Preview

| Masthead Citrus | Masthead Cobalt |
| --- | --- |
| ![Masthead Citrus template](../../../../../../public/templates/masthead-citrus.webp) | ![Masthead Cobalt template](../../../../../../public/templates/masthead-cobalt.webp) |

A newspaper front page. The top of the sheet is two blocks butted together with a
6px white channel between them: a square photo bleeding off the left and top
edges, and beside it a solid accent **plate** carrying the name in large uppercase
type. Below, every section heading is a small filled badge in the secondary
colour.

## What you would see

- **Page shape** — full-bleed. The photo and the plate reach the top, left and right paper edges; the body below keeps the page margin.
- **The band** — a `0.28fr | 1fr` grid with a **6px** gap, `align-items: stretch` so the plate matches the photo's height.
- **Photo** — fills its track, square by default, **radius 0**. Square corners everywhere: the plate, the photo and the badges are all cut from the same rectangle.
- **The plate** — solid `--resume-accent`, on-accent text, page-margin padding, contents vertically centred. With **no photo it spans the full width** (`:first-child` → `grid-column: 1 / -1`).
- **Name** — `1.5 × h1`, weight 800, **uppercase**, line-height 1.08, on-accent.
- **Headline** — `0.5 × h1`, regular weight, on-accent.
- **Contacts** — not in the plate. They lead the body under their own "Details" badge, stacked one per line, no icons.
- **Section headings** — filled badges: `--resume-secondary` background, on-secondary text, **radius 0**, `0.3em 0.75em` padding, `0.92 × meta`, tracked `0.1em`, `align-self: flex-start` so the badge hugs its text instead of running the full measure as a bar.
- **Dates** — uppercase, tracked `0.12em`, at `0.86 × meta` — matching the badge's letterspacing so the page has one voice for its small type.
- **Alignment** — everything left; nothing is pushed to the right margin.
- **Link cue** — plain solid underline. The headings are filled badges; nothing a 1px rule can rival.

## Wiring

Own `Component` (it renders the "Details" block before the summary) ·
`inlineTitleItemViews` · own `header.tsx` (it emits `.masthead-band` and
`.masthead-plate`).

## Careful

`align-self: flex-start` on the heading is load-bearing — `.section` is a stretch
column, and without it every badge becomes a full-width bar. The plate, the photo
and every badge paint; all need both `print-color-adjust` properties. Test the
no-photo case: the plate must span both tracks.

## ATS

Rated `pass`. A square photo beside an accent name plate across the top, then one column with filled-badge headings. The name is light type on the plate (same caveat as Crest). Dates render uppercase through CSS.
