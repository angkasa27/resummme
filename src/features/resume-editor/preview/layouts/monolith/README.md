# Monolith — `monolith`

## Preview

| Monolith Cobalt | Monolith Ink | Monolith Clay |
| --- | --- | --- |
| ![Monolith Cobalt template](../../../../../../public/templates/monolith-cobalt.webp) | ![Monolith Ink template](../../../../../../public/templates/monolith-ink.webp) | ![Monolith Clay template](../../../../../../public/templates/monolith-clay.webp) |

The whole page is one saturated colour. There is no white, no rule, no second
hue and no grey — just the accent and the one foreground colour that reads on
it. Everything the other layouts do with a border, a tint or a muted line, this
one has to do with **size and typeface**, which is the entire idea.

Every row rides two tracks: a **150px label rail** on the left, content on the
right. The header sits on them too (photo in the rail, name and reach in the
body column), and so does the summary — its rail cell holds the **headline**,
which labels the paragraph the way a section name labels its items.

## What you would see

- **Page shape** — the layout root paints `--resume-accent` and is stretched to the full paper by the document root, so the colour reaches every edge of every page. `page-inset` keeps the type off it; margin is `16mm`.
- **Two colours, total** — `--resume-text`, `--resume-muted`, and the name/headline/heading colour overrides are all folded onto `--resume-on-accent`; `--resume-border` goes `transparent`. The shared neutral ramp is built for a white page — grey text on a saturated field is unreadable and a grey hairline is invisible.
- **Two typefaces** — `--monolith-counter` is the user's font flipped to the opposite category (`getCounterFont`). Their pick keeps the **display voice** (name, lede, item titles); its partner takes the **reading voice** (rail labels, dates, prose, the closing location). Pick a sans and the rail turns serif; pick a serif and it inverts. Nothing is pinned, so the Style tab's font control still moves both halves.
- **The rail** — section headings and the headline at `1.15 × h2`, **weight 400**, sentence case, no tracking. Weight is not one of this layout's tools.
- **Name** — `0.95 × h1`, weight 400. The largest thing on the page, but only just: the colour is already doing the shouting.
- **The lede** — the summary at `1.1 × h2`, the one paragraph above body size. Its own `<h2>` is suppressed (`hideSummaryHeading`) because the headline in the rail is its label.
- **Items** — `inlineTitleItemViews`: role, employer and place run together as one sentence, the date underneath, then prose. Title in the display voice at `h3` weight 400; date and prose drop to the reading voice, prose at `0.95 × body`. That alternation is the only thing separating one entry from the next now that no rule or colour can.
- **Photo** — 108px, `3 / 4`, **radius 0** by default: a rounded frame would be the only curve on a page made of straight edges.
- **Closing location** — the location is pulled out of the contact block and set at the foot of the page, in the body column. The reach block above stays flush lines of phone, email and links.
- **Link cue** — a plain `underline` at `0.18em`. With no second colour to tint with and no rule weight to borrow, it is the only cue available; the headings still dominate, on size.

## Wiring

Own `Component` (the summary needs a rail cell of its own, and the location is
lifted out of the header to the foot of the page) · own `Header` (no headline —
it lives in the rail) · shared `inlineTitleItemViews` · `hideSummaryHeading`.

`--monolith-counter` is set as an inline custom property on the root rather than
resolved into the shared `--resume-*` set, because exactly one layout wants it.

## Watch out

- **The summary arrives as a `.section`.** The rail grid is written against
  `.section`, so without the `[data-section="summary"] { display: block }` reset
  the summary opens a *second* rail inside the first and the lede wraps
  150px narrow.
- **Both `print-color-adjust` properties** are on the painted root. Drop either
  and the exported PDF is a white page.
- **The accent must stay dark.** `readableTextOn` flips the foreground to near
  black above 0.55 luminance, and this layout has only that one foreground — a
  pale accent gives you near-black type on a pastel field, which is a different
  design. The three presets are all deep on purpose.

## ATS

Rated `warn`. The text order is fine: a 150px label rail beside the body, as in Inset. The warn is for colour. The whole page is one saturated fill behind light type, which pipelines that flatten to greyscale, and mono printers, ruin.
