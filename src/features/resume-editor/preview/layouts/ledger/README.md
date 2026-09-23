# Ledger — `ledger`

## Preview

| Ledger Graphite | Ledger Ink |
| --- | --- |
| ![Ledger Graphite template](../../../../../../public/templates/ledger-graphite.webp) | ![Ledger Ink template](../../../../../../public/templates/ledger-ink.webp) |

Monochrome by construction. Nothing on the page is filled — the entire colour
budget is one 28px accent rule under each section heading. The name runs the full
width above a hairline, and below it a single vertical hairline **spine** divides
a narrow left column of details from the wide right column of history.

## What you would see

- **Page shape** — header across the top, then a `0.34fr | 1fr` body grid. Both columns and the header sit inside the standard page margin.
- **The spine** — `border-right: 1px solid --resume-border` on the left column, with `--resume-gutter` of padding on each side of it. The layout's `gap` is **0** so the spine starts exactly where the header's bottom rule ends and the two rules meet at a corner.
- **Header** — name on the left, 96px **square** photo (radius 0) on the right, over a full-width `1px` bottom rule.
- **Name** — `1.45 × h1`, weight 700, **uppercase**, in `--resume-text`, capped at an `8em` measure so it wraps at a fixed width rather than running edge to edge.
- **Headline** — `0.4 × h1`, regular weight, muted.
- **Section headings** — `1.05 × h2`, weight 500, uppercase, tracked `0.08em`, in `--resume-text`, each with a **fixed 28px × 2px accent rule** underneath via `::after`. Fixed length on purpose: a full-width underline would restripe the page once per section.
- **Left column** — "Details" and "Links" rail blocks (the *labeled* contact variant: field name over value), then the side sections.
- **Dates** — `--resume-text`, weight 500, left-aligned, sitting *under* the title rather than across from it.
- **Prose** — `--resume-muted`, so the body recedes behind the item lines.
- **Link cue** — a `0.5px` hairline underline at `0.2em`. The 2px accent rule is the signature line; links must be visibly thinner.

## Wiring

Own `Component` · own `ledgerItemViews` · `ContactRailBlocks` with
`detailVariant="labeled"` · `getColumn: getSideRailColumn`.

## Careful

The rail is a third of the page, so `.layout-side .item-header` stacks — the
title/place split that reads well in the main column squeezes an issuer name into
two words per line there. The `::after` accent rule paints; keep both
`print-color-adjust` properties.

## ATS

Rated `fail`. Monochrome, but a `0.34fr` details column sits left of the history behind a hairline spine (`getColumn`). Plain is not the same as single-column.
