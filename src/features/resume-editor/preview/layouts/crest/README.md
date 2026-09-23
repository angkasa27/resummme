# Crest — `crest`

## Preview

| Crest Charcoal | Crest Burgundy |
| --- | --- |
| ![Crest Charcoal template](../../../../../../public/templates/crest-charcoal.webp) | ![Crest Burgundy template](../../../../../../public/templates/crest-burgundy.webp) |

A solid accent band across the top of the page, bleeding to three edges, carrying
everything about the person: a centred round photo with a ring, the name, a widely
tracked headline, and — below a full-width hairline, as a second course of the same
band — the contacts spread edge to edge like a nav bar. Below the band the page
goes deliberately quiet.

## What you would see

- **Page shape** — full-bleed (`inset: "none"`). The band paints to the top, left and right paper edges; the body below keeps the page margin.
- **The band** — solid `--resume-accent` with `--resume-on-accent` text throughout, including the name.
- **Course 1 (`.crest-identity`)** — centred column: photo, name, headline.
- **Photo** — 84px, **circular** by default, with a `2px` ring at 65% of the on-accent colour so it detaches from the band whatever hue the accent is.
- **Name** — `1.15 × h1`, weight **500**, tracking `+0.01em`. Restrained for its size.
- **Headline** — `0.92 × meta`, uppercase, tracked `0.24em` — the widest tracking in any layout — at 85% opacity.
- **Course 2 (`.crest-contacts`)** — separated by a `1px` on-accent 30% rule that runs the **full paper width**, because the border sits on the full-bleed block itself. Contacts are laid out `justify-content: space-between`, so with few of them the strip reads as a nav bar, and with many it wraps to a second line.
- **Body headings** — `1.35 × h2`, weight **400**, sentence case, no tracking. After a band that shouts, the body should not.
- **Alignment** — everything reads down the left edge: `.item-row`, `.item-header-side` and every `.meta` are forced left, so no field is pushed to the right margin.
- **Link cue** — 50%-opacity underline; contacts sit inside the dark band, where a full rule fights the band's edge.

## Wiring

`createSingleColumnLayout` with `inset: "none"` · `inlineTitleItemViews` · own
`header.tsx` (it emits `.crest-band`, `.crest-identity`, `.crest-contacts`).

## Careful

The band sets `--resume-name-color` to on-accent rather than colouring `.name`
directly — a direct override would only tie with the shared rule on specificity.
The band, the photo ring and the divider all paint; keep both
`print-color-adjust` properties on each.

## ATS

Rated `pass`. A single column under a dark full-width band carrying the photo, name and a contact grid. The text order is fine. The contacts are light type on the dark band, the same greyscale risk that makes Monolith a `warn`; it is confined to the header here and not counted.
