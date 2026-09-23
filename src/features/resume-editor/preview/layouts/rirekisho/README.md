# Rirekisho — `rirekisho`

## Preview

| Rirekisho Gothic | Rirekisho Mincho |
| --- | --- |
| ![Rirekisho Gothic template](../../../../../../public/templates/rirekisho-gothic.webp) | ![Rirekisho Mincho template](../../../../../../public/templates/rirekisho-mincho.webp) |

The Japanese 履歴書, reproduced as a form rather than a resume. Every block is a
ruled box: an identity table with a 30×40mm photo cell, an address table under
it, then the whole history in fixed 年 / 月 columns. The rules are not
decoration — they are the format, so nothing here has gaps between sections.

## What you would see

- **Page shape** — one column, 12mm margins. The boxes reach almost to the paper edge: the form, not the whitespace, frames the page.
- **The line grid** — the whole point. `--rirekisho-row` is the height of a printed line; every cell sets `line-height` to exactly that and takes no vertical padding, and each row paints a rule at the **top** of every line it occupies. A cell that wraps to three lines is therefore three rows tall with a rule under each — row heights stay equal down the page, like a spreadsheet, and long text never makes a half-height box. Top and not bottom because two rows share that edge: one rule is drawn there, never two stacked or one clipped. The pitch is `2 × --resume-body` so it is always a whole number of pixels; at a fractional pitch the browser drops rules.
- **Title row** — 履歴書 at `0.85 × h1` with `0.35em` tracking, and the draft's `updatedAt` at the right *of the table column*, beside the photo rather than above it: the photo hangs from the top edge of the sheet. Dates print spaced and padded the way the sheet does — 令和 8 年 08 月 23 日現在 — with `Intl`'s `ja-JP-u-ca-japanese` calendar supplying the era, so the next era needs no edit.
- **Identity box** — ふりがな over 氏 名 (two rows tall), then the birth row: 平成 6 年 06 月 12 日生 on the left and the answered 性別 in a ruled-off cell on the right. Neither carries a caption and there is no 満 age, because the printed sheet prints neither.
- **Photo box** — 30mm at `var(--resume-photo-aspect, 3 / 4)` = 30×40mm, hanging from the top of the sheet with the same air below it as beside it. The dashes are the **placeholder**: an empty box is dashed and carries the printed sheet's instructions (写真をはる位置 …), a filled one is just the photo, unframed.
- **Contact boxes** — ふりがな / 現 住 所 / E-mail down the left, （自宅電話）and（携帯電話）down the right; 連絡先 repeats the shape for the address post should go to instead, when that differs. The postal code is **not** a row of its own: it heads the address cell as 〒150-0041 with the address on the line under it, which is how the sheet prints two inputs into one box. Profile links are **not** printed: the form has no row for a URL, and inventing one is not the format.
- **学歴・職歴 table** — one table captioned 年 / 月 / 学歴・職歴（各別にまとめて書く）, with 学歴 and 職歴 as centred label rows over their runs. Work rows read `会社名 入社`, the role, the description, then `一身上の都合により退職` or a dateless `現在に至る`. Education rows read `入学` / `卒業`. Closed by a right-aligned 以上.
- **年 / 月** — split from the stored `MMM yyyy` via `parseMonthYear`; a date the picker never produced (`current`, free text) leaves both cells blank rather than guessing. The rule between 年 and 月 is dashed, the one before the entry solid — the form's own hierarchy.
- **免許・資格 table** — certifications and languages share it; the caption row names it, so their own headings are hidden.
- **The band** — 志望動機、特技、自己PRなど holds the summary and skills as prose; 通勤時間 / 扶養家族 / 配偶者 / 配偶者の扶養義務 sit in boxes to its right.
- **本人希望記入欄** — a free-text box, newlines preserved.
- **Descriptions** — bullets are stripped to plain lines (`list-style: none`, no indent): the form rules prose line by line and has no bullets.
- **Link cue** — a plain underline at `0.15em`; every heading here is boxed and captioned, so a rule under a URL cannot be read as one.

## What it demands of the document

All three knobs in `domain/presentation/layout-section-rules.ts`, and this is the
only layout that uses any of them:

- **Extra fields** — exactly the boxes the printed sheet asks for and a résumé
  has no field for: ふりがな for the name and both addresses, 生年月日, 性別,
  郵便番号 (×2), 自宅電話, 連絡先 and 連絡先電話, 通勤時間, 扶養家族数, 配偶者,
  配偶者の扶養義務, and 本人希望記入欄. The address, e-mail and mobile number
  come from the Profile — nothing is duplicated here. 性別, 配偶者 and
  配偶者の扶養義務 are selects (男/女, 有り/無し); the rest are text, one date and
  one multi-line box. All read from the free `profile.extras` map and are edited
  in the pinned **Rirekisho details** row, which appears only while this layout
  is selected. Values survive a switch away. The date field uses the same picker
  every dated section uses (`precision="day"`, storing `"12 Jun 1994"`); the
  header also parses ISO, for drafts written before it.
- **Fixed titles** — 学歴, 職歴, 免許・資格, 志望動機, 特技, 語学. A recruiter
  looks for these exact words, so they outrank a rename and the rename control
  steps aside. The sidebar reads Work Experience (職歴); the paper prints 職歴
  alone.
- **Hidden sections** — projects, publications, awards, references and
  volunteering belong on the companion 職務経歴書. Their content is kept; the
  sidebar row is chipped "Hidden by template".

## Regions, not order

The form files sections into fixed regions, so `layout.tsx` looks them up by key
instead of printing `slots.sections` in the sidebar's order: education and work
into the history table (学歴 first, the form's order), certifications and
languages into 免許・資格, skills into the 志望動機 box. A section the form never
anticipated still prints, in a table of its own.

Two things stay the user's: the order of *items* inside a section — the form's
convention is oldest-first, and the Sort action only sorts newest-first — and
whether a section is visible at all.

## Paper

A4 is the norm for a 履歴書 sent as a PDF. **JIS B5** (182×257mm) is the size the
printed form is sold and filed at, and is in the global paper picker for it —
`generate-resume-pdf.ts` passes explicit millimetres rather than puppeteer's
`format`, which has no B series.

## Wiring

Own `Component` (the 以上 row follows the sections, and the summary box follows
that) · own `rirekishoItemViews` (every item emits `.rirekisho-row` cells) ·
own `header.tsx` · `renderSectionHeading` for the 年 / 月 heading row.

## Careful

`.section`, `.item-list` and `.item` all run at `gap: 0` and no padding on
purpose: any spacing there pushes the text off the line grid and the rules cut
through it. The band and the 本人希望記入欄 box carry `data-page-unit` so the
paginator moves them whole — without it a page break lands between a caption and
the prose under it. Every box sets the
`print-color-adjust` pair — the borders are painted, and without it the exported
PDF comes out blank.

## ATS

Rated `warn`, deliberately: a 履歴書 is read by a person, and saying otherwise
would be a lie about the format. The whole page is ruled tables. The score's
Western checks (experience above education, bullets, action verbs) read the
draft, not this page. The form always prints 学歴 above 職歴, whatever order the
draft holds.
