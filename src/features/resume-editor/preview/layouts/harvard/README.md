# Harvard — `harvard`

## Preview

| Harvard Serif | Harvard Sans |
| --- | --- |
| ![Harvard Serif template](../../../../../../public/templates/harvard-serif.webp) | ![Harvard Sans template](../../../../../../public/templates/harvard-sans.webp) |

The Harvard MCS resume format, reproduced. One type size for the entire document,
no colour, no rules except the one under the name, and **bold as the only emphasis
available anywhere on the page**. The name is centred and barely larger than the
body; section headings are centred, title case, and body-sized. Every item is a
pair of lines with content flush left and dates or places flush right.

## What you would see

- **Page shape** — one column, standard margins. The most conventional layout in the set, and the safest through any parser.
- **Header** — centred: optional photo, then the name block spanning the full width with a `1px --resume-text` bottom rule under it, then the contacts on a centred dotted line.
- **Name** — only `0.6 × h1`, weight 700, no tracking, in `--resume-text`. It is a label on the page, not a masthead.
- **Headline** — `--resume-body` size, regular weight.
- **Section headings** — **centred**, title case, **no capitals and no rule**, at `--resume-body` size, weight 700.
- **One type size** — `.item-title`, `.item-line-lead`, `.item-line-side` and `.meta` are all pinned to `--resume-body` in `--resume-text`. Dates and places are body text set flush right, not secondary metadata.
- **Items** — two lines. Lead text (organisation, then role) bold on the left; dates and places right-aligned and tabular on the right. `.item` has `gap: 0` so the two lines bind together; only the bullets below get air.
- **Skills** — `.inline-item`: a bold label running into its list on one line — "Technical: Python, SQL".
- **Photo** — 64px, square by default, 4px corners, centred. Note the format traditionally has no photo at all; it is supported, not encouraged.
- **Link cue** — a plain underline at `0.15em`, the only decoration a format with no colour has left.

## Wiring

`createSingleColumnLayout` · own `harvardItemViews` (they emit `.item-line-lead`,
`.item-line-side`, `.inline-item`) · own `header.tsx`.

## Careful

The value of this layout is its **plainness** — it is the ATS-safest option in the
gallery. Do not add an accent fill, a badge, a counter, or a second type size; any
of those turns it into a different layout. `--resume-accent` is intentionally
unused. Bullet indent is a fixed `1.6em`, matching the printed format rather than
`--resume-indent`.

## ATS

Rated `pass`. One column, no colour. Centred header, contacts on one dotted line, then every item as title/place line, role/date line, bullets — the page order is the reading order.
