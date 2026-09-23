# Marquee — `marquee`

## Preview

| Marquee Amber | Marquee Teal | Marquee Oxblood |
| --- | --- | --- |
| ![Marquee Amber template](../../../../../../public/templates/marquee-amber.webp) | ![Marquee Teal template](../../../../../../public/templates/marquee-teal.webp) | ![Marquee Oxblood template](../../../../../../public/templates/marquee-oxblood.webp) |

A dark band across the top of the sheet, bleeding to three paper edges, carrying
the name in the accent colour, the role beside it, and the whole contact strip
underneath. Below it a plain single column whose section headings are a small
glyph and an uppercase label, each closed by a short accent bar sitting under
the glyph. Dates and places range right in the accent; skills and certificates
lay out as bullets across three tracks; languages read as one running line.

**Two colours doing two jobs.** The secondary paints the band and the heading
glyphs. The accent lights the name on that band, the bar under every heading,
and every date. Nothing else on the page is coloured — the body is the neutral
ramp.

That split is why this layout is one of the few that reads `--resume-secondary`
(see `template-presets.test.ts`). A preset that sets no secondary gets the accent
back as its fallback, which would paint an accent band with an accent name on
it; all three presets curate one.

## What you would see

- **The band** — solid `--resume-secondary` to the top, left and right paper edges, with the page margin as its own padding. The layout takes `inset: "none"`; the body below re-adds the margin.
- **Header** — name (`0.92 × h1`, bold, accent) and role (`0.62 × h1`, regular) sharing one baseline, the contact strip under them with **accent glyphs**, and the photo — when there is one — ranged right at 92px.
- **Section headings** — `0.95 × h2`, bold, near-black, uppercase at `0.08em`. Laid out as a **grid**, not a flex row: the accent bar is an `::after` placed in column 1 of a second row, which is the only way to hang it under the glyph without a wrapper the shared heading markup never emits.
- **Items** — role bold, comma, employer italic, all on the title line; the date (accent) and place (muted) ranged right. `TitleWithSubject` does the joining; the canonical item view stacks the employer under the role and costs a line on every entry.
- **Skills** — every term from every group as one bullet, three across. Group names do not print (`renderSection`). Both three-track sections carry **`data-page-unit`**: the pagination pass inserts a spacer *before* a block landing in a page's edge band, and a spacer inserted before a grid child becomes another grid item and reflows the row. `pnpm e2e:pagebreak` caught a skill sitting 151px into the bottom band before the attribute was added.
- **Certificates** — the same three-track grid, issuer and date dropping under the name rather than being pushed to a right margin one third of a column wide.
- **Languages** — one running line, `Filipino — Native | English — Fluent`. The pipe is a CSS `::after` trailing every entry but the last, so it never orphans at a wrap or gets copied into a paste.
- **Link cue** — contacts take a `color-mix`-softened underline; they sit on the dark band, where a solid rule cuts into the band's own edge. Item titles take the **link glyph** (`titleLinkMarker: "link"`) — the page is already icon-led.

## Wiring

`createSingleColumnLayout` with `inset: "none"` · own `Header` ·
`renderIconSectionHeading` (shared with studio and compass) · `marqueeItemViews`
= `defaultItemViews` plus work / education / certifications / languages ·
`renderSection` override for the flattened skills grid.

## ATS

Rated `pass`. A dark band header with the name and contacts, then one column. Heading glyphs are SVG. Skills flatten to a three-across grid of terms and the group names do not print.
