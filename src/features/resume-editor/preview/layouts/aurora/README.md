# Aurora — `aurora`

## Preview

| Aurora Haze | Aurora Peach |
| --- | --- |
| ![Aurora Haze template](../../../../../../public/templates/aurora-haze.webp) | ![Aurora Peach template](../../../../../../public/templates/aurora-peach.webp) |

A soft colour wash bleeding off the top edge of the paper — two overlapping radial
gradients, accent and secondary, fading to white before they reach the middle of
the band. Under it the body runs on a **label gutter**: each section's heading
parks in a fixed 128px left column and the content runs beside it, separated from
the next section by a faint hairline.

## What you would see

- **Page shape** — full-bleed (`inset: "none"`). The band paints to the top, left and right paper edges; the body below keeps the page margin.
- **The band** — white base, plus a `linear-gradient` to white from 42% down, over two radial gradients: accent at `27% -18%` and secondary at `73% -12%`. Blur without a filter. The bottom resolves to paper white, so there is no visible edge.
- **Band layout** — a `128px | 1fr` grid matching the sections below, so the name starts where the content starts.
- **Name** — `1.45 × h1`, weight **900**, tracking `-0.035em`, in `--resume-text`. Not the accent: the band is pale and an accent name would nearly vanish on it.
- **Photo** — 92px in the gutter track, `3 / 4` portrait, 12px corners, with a `3px` translucent white ring.
- **Contacts** — details as an inline icon run; **links as outlined pills** (999px, 25%-text border, 55%-white fill).
- **Sections** — `128px | 1fr` grid, `--resume-gutter` between the tracks, `--resume-gap-section` of vertical padding, and a bottom hairline at 40% of `--resume-border`. It separates; it does not stripe.
- **Section headings** — sentence case, no tracking, `--resume-h2`, in `--resume-text`, parked in column 1.
- **Bullets** — drawn as 4px muted circles (whole pixels, not em-sized — an em box lands on fractions and antialiases into an oval on some lines).
- **Tags** — neutral grey (`text @ 7%`), 4px corners. The accent is spent on the band.
- **Link cue** — plain underline, **except** inside the link pills, where an underline would be a double affordance.

## Wiring

`createSingleColumnLayout` with `inset: "none"` · own `auroraItemViews` · own
`header.tsx` (it emits `.aurora-band`) · `.link-marker` arrows enabled.

## Careful

`--resume-secondary` falls back to the accent when a preset leaves it unset, so
the band degrades to a single-hue wash rather than breaking. Everything in the
band paints; both `print-color-adjust` properties are on the band, the photo ring
and the pills. Because the layout is full-bleed, the body re-adds
`--resume-page-margin` itself.

## ATS

Rated `pass`. The gradient wash is background only. Headings sit in a 128px left track beside the body, as in Inset. Links are outlined pills but still plain text.
