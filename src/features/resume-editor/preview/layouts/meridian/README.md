# Meridian — `meridian`

## Preview

| Meridian Sunset | Meridian Lagoon | Meridian Meadow |
| --- | --- | --- |
| ![Meridian Sunset template](../../../../../../public/templates/meridian-sunset.webp) | ![Meridian Lagoon template](../../../../../../public/templates/meridian-lagoon.webp) | ![Meridian Meadow template](../../../../../../public/templates/meridian-meadow.webp) |

A gradient rail down the left edge of **every** sheet — accent at the head,
secondary at the foot — and beside it a plain black-on-white column: the name
over an italic role, the reach in two iconed rows, a squared photo held top
right, and section headings each closed by a rule the full width of the column.

**The rail is the only colour on the page.** Name, headings, rules, dates and
bullets are all the neutral text ramp. That is what lets the rail read as a
gradient rather than as decoration, and it is why both curated colours land in
one place instead of being spread over the body.

The two are **different hues**, roughly a quarter to a third of the wheel apart,
so the ramp has somewhere to travel — one hue at two depths reads as a shadow,
not a gradient. The gradient interpolates `in oklab` for that reason: sRGB takes
the short cut straight through the desaturated middle between two hues and lays
a grey band across the rail.

## What you would see

- **The rail** — `7%` of the paper width, bleeding to the top, left and bottom edges of every sheet. It cannot be a child element: that paints one strip down the whole stack, and the page-break markers are editor-only chrome, so there is nothing per-page to hang one on. It is one background layer tiled to exactly one `--resume-paper-height` and repeated down the page. Reading the paper height rather than a fixed millimetre keeps it correct at A4, Letter and JIS B5 alike.
- **Header** — name (`0.95 × h1`, bold) over an italic role (`0.6 × h1`), the reach beneath in two iconed rows, and a `112px` square photo ranged right. The photo is sized to land level with the foot of the identity block; taller, and it opens a gap under the contacts that reads as a broken margin.
- **Section headings** — `1.3 × h2`, semibold, title case, with a `1.5px` `border-bottom` in the text colour. A real border on the heading rather than a separate element, so the rule can never drift out of alignment with the words it belongs to.
- **Items** — employer bold, comma, role italic, all on the title line (`TitleWithSubject`, shared with marquee, which puts them the other way round). The description hangs at `--resume-indent` so it stays tied to its own entry once several stack up.
- **Every right-hand line has a left-hand line to sit against.** That is the rule the item views follow, and it decides where each field goes. The **place** always reads down the left, under the title — ranged right it sat beside an empty title row and read as a stray in the margin (work experience, education and organizations all carry one, so all three override the canonical view). The **GPA** goes the other way, to the right under the date, where it pairs with the place on the left.
- **Skills** — every group takes the full row: a bold heading, then its own terms flowing beneath it across `columns: 12ch 4`. That reads as "at most four columns, each at least 12ch", so a long certification-style term drops the count to three or two rather than being hyphenated to shreds in an eight-character column. The dash hang is on the `li`, not the `ul` — list padding applies to the whole multi-column box, so it would indent only the first column and let every later dash fall into a gutter.
- **Certificates** and **languages** — one running line each, bullet-separated by a CSS `::after` so the separator never leads a wrapped line or lands in a paste. Languages keep the bold name and a parenthesised level; certificates read as prose.
- **Link cue** — `underline dotted`. Item titles inherit it rather than grading down further: a title here is bold body text, not the display type it is in a badge layout.

## Wiring

`createSingleColumnLayout` with `inset: "none"` · own `Header` ·
`meridianItemViews` = `defaultItemViews` plus work / education / skills /
certifications / languages · no `renderSection` override — the two inline
sections and the skills grid are all CSS.

## ATS

Rated `pass`. The gradient rail down the left edge carries no text. Everything else is a plain black-on-white single column.
