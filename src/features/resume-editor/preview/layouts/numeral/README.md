# Numeral — `numeral`

## Preview

| Numeral Mono | Numeral Signal |
| --- | --- |
| ![Numeral Mono template](../../../../../../public/templates/numeral-mono.webp) | ![Numeral Signal template](../../../../../../public/templates/numeral-signal.webp) |

An index. Sections are numbered `01`, `02`, `03` by a CSS counter, each number in
the accent colour ahead of its label, the pair underlined by a rule that stops at
the text. Every item sits on the same three-track grid, so the dates form a rail
down the left and the place names a right-aligned column — the page reads like a
table of contents.

## What you would see

- **Page shape** — one column, with a strict three-track item grid. Section gaps at `1.6×` the normal step.
- **Section headings** — `01  PROFILE`: an inline-flex baseline row, `0.75em` gap, at `--resume-h3`, weight 700, tracked `0.08em`, in `--resume-text`, over a **2px `--resume-text`** bottom border that stops at the text (`align-self: flex-start`). The number comes from `counter(resume-section, decimal-leading-zero)` in `--resume-accent`, tabular.
- **Items** — `150px | 1fr | max-content`. Each cell names its own column explicitly, because auto-placement dropped a no-date item's title into the date gutter.
  - **Column 1, date** — `0.9 × meta`, weight 700, `--resume-text`, left, wrapping allowed.
  - **Column 2, main** — title (weight 700) and body.
  - **Column 3, place** — `--resume-meta`, *italic*, muted, right-aligned, capped at `20ch` so a long place name wraps instead of starving the body.
- **Summary** — has no items, so it reproduces the 150px gutter by hand with `margin-left`, or its text would start at the page edge out of line with everything else.
- **Header** — name on the left at `1.4 × h1` weight 800; on the right either an 84px **square** photo (radius 0) or, with no photo, `.numeral-mark` — a drawn solid square sized off `--resume-h1` so it holds its proportion at every font scale.
- **Contacts** — a labelled **table**: a 2-column grid of `90px | 1fr` label/value pairs.
- **Link cue** — a `0.5px` hairline at `0.22em`. Against a 2px heading border and a precision grid, anything heavier is noise.

## Wiring

`createSingleColumnLayout` · own `numeralItemViews` (they emit `.item-main` and
`.item-place`) · own `header.tsx` (`.numeral-identity`, `.numeral-mark`,
`.numeral-contacts`).

## Careful

The numbering is a **CSS counter, not data** — document order is the order, so it
is always right, and the layout never has to rebuild a section node. If you wrap
sections in an extra element, check the counter still increments. The mark and the
counter paint; keep both `print-color-adjust` properties.

## ATS

Rated `pass`. Items run on three tracks: date left, title and bullets middle, place right. Each side cell is one short line, so reading across gives "date, title, place". The `01` / `02` numbers print as text in front of the heading.
