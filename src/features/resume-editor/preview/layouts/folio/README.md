# Folio — `folio`

## Preview

| Folio Slate | Folio Ink | Folio Claret |
| --- | --- | --- |
| ![Folio Slate template](../../../../../../public/templates/folio-slate.webp) | ![Folio Ink template](../../../../../../public/templates/folio-ink.webp) | ![Folio Claret template](../../../../../../public/templates/folio-claret.webp) |

A framed page. Every sheet carries the same solid band of accent bleeding to all
four paper edges, and inside it a plain single column: a round photo ranged
left, the name and role sharing the line beside it, contacts as a two-column
grid of chipped fields, and section headings each underscored by a short thick
rule the width of their own words.

**Every section runs the full width.** The contact grid in the header is the only
two-column thing on the page.

The accent is spent in exactly three places: the band, the heading rules, and
the contact chips. Everything else, the name included, is the neutral text
colour. A coloured heading over a coloured band is one colour too many.

Replaces `modern-centered`, which is mapped to this layout in `retiredLayoutIds`
so saved drafts land here instead of falling back to `classic`.

## What you would see

- **The band** — a solid `6mm` accent frame reaching every paper edge, **on every sheet**. Page margin is `16mm`, so content clears it by 10mm.
- **Header** — round photo (104px, `1 / 1`, radius 50%) ranged left, with the name (`0.66 × h1`, bold) and the role (italic, `1.1 × h2`) sharing the line beside it. Both in `--resume-text`, not the accent.
- **Contacts** — a two-column grid, each field led by a **filled accent chip** (20px, 3px radius) carrying a white glyph.
- **Section headings** — `1.2 × h2`, bold, near-black, with `width: fit-content` and a `3px` accent `border-bottom` under `4px` of padding. The `fit-content` is what keeps the rule the width of the words instead of the column; the small padding is what keeps it reading as an underline rather than a divider.
- **Items** — title bold at `h3`, employer italic beneath, date and place ranged right on **one line** separated by a pipe. The side block is `nowrap` and does not shrink; the title column gives way instead.
- **Bullets** — en-dashes via `::marker`.
- **Skills** — one running line of pipe-separated terms from every group. The separator is a CSS `::after`, so it never lands on the last term or gets copied into a paste.
- **Link cue** — `underline dotted`. The headings own a solid 3px rule; the links take the plainly quieter one.

## Wiring

`createSingleColumnLayout` with a `renderSection` override for the skills line ·
own `Header` · shared `defaultItemViews` · no `hideSummaryHeading` — Summary
keeps its heading like every other ruled section.

## Watch out

- **The band is four tiled background layers, not a `border`.** A border frames
  the whole stack once, not each sheet — and the page-break markers in
  `document-root.tsx` are editor-only chrome (`print:hidden`), so there is
  nothing per-page to hang one on. Each layer is sized to exactly
  `var(--resume-paper-height)` and set to `repeat-y`, so the tile lands at the
  same offset on every page. All four share one size and position; the
  gradient's **direction** is what picks which edge it paints.
- **Both `print-color-adjust` properties** are on the band *and* on the contact
  chips. Drop either and the exported PDF loses the frame, which is the design.
- **The band follows `--resume-paper-height`**, so it is already correct for A4,
  Letter and JIS B5. Hard-coding 297mm would silently break two of the three.
- **Single column, deliberately.** An earlier pass set runs of short sections
  two-up. It was dropped: every section runs the full width now, and anything
  that reintroduces columns here has to answer to the paginator, which inserts
  spacers into the flow and reflows a balanced column pair.
- **`.name-block` is a column by default.** The shared rule stacks the name and
  role; this layout sets `flex-direction: row` explicitly to put them on one
  line.

## ATS

Rated `pass`. A solid accent frame round each sheet, and inside it a plain single column. The only side-by-side content is the two-column contact grid in the header, where every cell is one short field. The photo is scored separately by `parse/photo`, not here.
