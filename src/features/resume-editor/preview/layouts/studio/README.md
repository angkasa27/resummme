# Studio — `studio`

## Preview

| Studio Violet | Studio Teal |
| --- | --- |
| ![Studio Violet template](../../../../../../public/templates/studio-violet.webp) | ![Studio Teal template](../../../../../../public/templates/studio-teal.webp) |

Product-UI language on paper. Every section heading is preceded by a rounded
square **icon chip** — a lucide glyph in the accent colour on a 12%-accent tile —
and the headings themselves stay quiet: sentence case, no rule, no accent text.
Dates render as outlined pills, and skills and languages as filled chips.

## What you would see

- **Page shape** — one column.
- **Section headings** — a flex row: the icon chip, then the label at `--resume-h2`, sentence case, no tracking. The chip is the identity, so the type stays plain.
- **The chip** — `1.55em` square, `0.45em` corners, accent glyph on `accent @ 12%`, holding a `0.85em` icon at `stroke-width: 2.25`.
- **Dates** — outlined **pills**: `999px` radius, `1px` border of `accent @ 35%`, accent text, weight 500. The one place an item header carries a shape.
- **Skills / languages** — `.chip-list` of filled `.chip`s: `999px` radius, `accent @ 10%` background, `--resume-meta` size, list markers removed.
- **Header** — mirrored from the shared photo-left pattern: name on the **left**, 96px square photo with 14px corners on the **right**.
- **Name** — `1.1 × h1`, weight 700, in `--resume-text`.
- **Headline** — `--resume-accent`, weight 600.
- **Contact icons** — accent-coloured.
- **Link cue** — **dotted** underline at `0.18em`, and `.link-marker` arrows are switched on after linked item titles — chips and badges are this layout's language, so an arrow reads native.

## Wiring

`createSingleColumnLayout` · own `studioItemViews` · header from
`createPhotoHeader` (styled to reverse) · `renderSectionHeading:
renderIconSectionHeading`, shared with `compass`.

## Careful

`renderIconSectionHeading` keys off the **section key**, not its title, so a
renamed section keeps its icon. The chip, the pills and the chips all paint —
every one carries both `print-color-adjust` properties. `.chip-list` sets
`list-style: none` explicitly: flex items still render their disc marker, and it
lands after the pill.

## ATS

Rated `pass`. One column. Heading icons are decorative SVG, dates are outlined pills, skills are chips: all plain text underneath.
