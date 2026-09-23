# Design system — forms, spacing, typography

Scope: the editor's form and control surfaces (item forms, profile, summary, Style/Layout/Template tabs, Insights, dialogs) and the primitives they share. **The landing page is exempt** — it's marketing with its own display treatments, and the lint guards below skip it.

The rule behind every rule here: **spacing and type live in the primitives, not at call sites.** A token or a constant only _renames_ a choice — an author can still type `gap-3`. A primitive removes the choice. This whole system exists because the old one drifted to 11 label recipes and 10 gap values, and every one of those was a call-site override.

---

## Spacing — 4 / 8 / 12 / 16

| step             | role                                                       | who owns it                           |
| ---------------- | ---------------------------------------------------------- | ------------------------------------- |
| **4px** `gap-1`  | inside a field: control → error/description                | `Field`, `FieldContent`               |
| **8px** `gap-2`  | attached meta: a legend and the fields it heads; row lists | `FieldSet`; row lists set it directly |
| **12px** `gap-3` | between fields, **both axes**                              | `FieldGroup`                          |
| **16px** `gap-4` | between groups                                             | the surface (`flex flex-col gap-4`)   |
| **12px** `p-3`   | **form / card** container padding                          | the surface                           |

Nothing else. No `gap-0.5`, `gap-1.5`, `gap-2.5`, `gap-5`, `gap-6`, `gap-7`, and no `gap-x-*`/`gap-y-*` split.

**This is the compact standard.** The editor lives in a sidebar, so density is the point — dense but organized, like a Figma inspector. It replaces the older, looser 4/8/16/24 scale; every editor surface (forms, Design, Insights, dialogs, cards) sits on this one scale.

**12px between fields is the floor.** The old 16px floor guarded a floated label (16.5px tall, hanging 8.25px over its control's top border). That label is gone — the control box no longer overhangs — so 12px clears the field above at the row heights in use (verified at 360px and 640px sidebar, 375px mobile). Don't drop below it.

**`p-3` is a _form / card_ rule.** A nav list is a step tighter: `section-list` uses `p-2` with `gap-2` rows, because even a 12px inset around rows that are themselves `py-2` reads heavy. If you're laying out rows, you're on the 8px step.

---

## Typography — 4 steps, no arbitraries

| step        | for                                                                     |
| ----------- | ----------------------------------------------------------------------- |
| `text-2xl`  | display — the Insights score number, and nothing else                   |
| `text-base` | dialog titles, `FieldLegend` (group heading)                            |
| `text-sm`   | **default** — body, labels, values, buttons, errors, descriptions, rows |
| `text-xs`   | meta — `sr-only` field labels, badges, captions, counters, helper text  |

**`text-[Npx]` is banned** (lint-enforced). There is no micro step: de-emphasis is `text-muted-foreground`'s job, not a 5th size. The panel scrolls, so vertical room is not scarce enough to justify 10px text.

One site carries an `eslint-disable` for this rule: the mobile bottom nav's `text-[10px]` labels (`editor/mobile/mobile-bottom-nav.tsx`), where four labels share a phone-width pill. It is the only one — a second disable means the scale needs a real 5th step, not another escape hatch.

**Uppercase + letter-spacing are gone.** No `uppercase`, no `tracking-wider`. Sentence case everywhere.

---

## Labels — placeholder carries the field

**Field labels are not shown.** The input's placeholder carries the field name: `placeholder = config.placeholder ?? config.label`. No visible label sits above or floats over a control.

**Accessibility is preserved regardless** — every field still has an accessible name, just not a painted one:

- `Input` / `Textarea` / `Select` get an `aria-label`, or a `<FieldLabel htmlFor>` wrapped in `sr-only`.
- Button-triggered controls with no native `placeholder` (`DatePicker`, and Profile/Summary fields built on `Field`) use the `sr-only FieldLabel` route — see `profile-fields.tsx` for the pattern.

**A leading icon can reinforce scanning** where the placeholder alone is ambiguous at a glance — Profile's location (pin), phone, and email each get one via `InputGroup` / `InputGroupAddon`. It's an addition, not a requirement: most fields need no icon.

**Group headings are unchanged.** `<FieldLegend>` (16px semibold) still visibly labels a `FieldSet` — only the per-field label was removed, not the group heading.

This replaces the old three-role float/stacked/none recipe (`FloatingField` + `field-layout.ts`'s label-variant table) — both are deleted. `field-layout.ts` still exists, but only for `fieldSpanByKind` (column span), unrelated to labels now.

---

## Buttons — role decides variant + size

| role                                                   | variant                            | size                 |
| ------------------------------------------------------ | ---------------------------------- | -------------------- |
| Primary add (Add item, Add section, Add link)          | `default`                          | `default` + `w-full` |
| Primary output (Download PDF, top bar)                 | `default`                          | `sm`                 |
| Document action — AI (Extract from PDF)                | `ai`                               | `default` + `w-full` |
| Document action — plain (Import JSON)                  | `outline`                          | `default` + `w-full` |
| Split-button menu trigger (top bar export menu)        | `default` + `ButtonGroup`          | `icon-sm`            |
| Dialog confirm — AI                                    | `ai`                               | `sm`                 |
| Dialog confirm — plain                                 | `default`                          | `sm`                 |
| Secondary / cancel                                     | `outline`                          | `sm`                 |
| Section-level remove (labeled, one per header)         | `destructive`                      | `sm`                 |
| Destructive icon, repeated in a list (delete row/link) | `ghost` + `DESTRUCTIVE_ICON_CLASS` | `icon-sm`            |
| Icon-only (clear, toolbar)                             | `ghost`                            | `icon-sm`            |
| In-card micro (Fix)                                    | `default`                          | `xs`                 |
| Segmented control / stepper (zoom)                     | `ButtonGroup` of `outline`         | `icon-sm` / `sm`     |
| Toolbar format toggles                                 | `ToggleGroup variant="outline"`    | `sm`                 |
| AI multi-select chips                                  | `ToggleGroup` item `variant="ai"`  | `sm`                 |

**The size ramp already exists — use it.** `xs` = `h-6 px-2 text-xs`, `sm` = `h-8`, `default` = `h-9`, `icon-xs/sm/lg` = `size-6/8/10`. Hand-writing `size="sm" className="h-6 px-2 text-[11px]"` is reinventing `size="xs"`; that exact line was in the codebase and is why this table exists.

**Icon-only buttons take an `icon-*` size**, not `sm` and not `icon` (`h-9`). The editor default is `icon-sm`.

**Destructive has two treatments, chosen by prominence.** A _labeled_ section-level action that appears **once** in a header — "Remove Experience" — is the `destructive` Button variant (soft-filled red). A destructive _icon_ repeated **down a list** — the row delete — is the quieter `ghost` + `DESTRUCTIVE_ICON_CLASS`, whose intent only shows on hover; a filled red button on every row shouts. Rule: singular labeled → `destructive` variant; repeated icon → subtle ghost.

**Segmented / stepper controls are a `ButtonGroup`, never a hand-rolled pill.** The zoom control is a `ButtonGroup` of `outline` buttons with the standard `rounded-md` corners. Don't rebuild one from `variant="ghost"` buttons each overriding `rounded-full` inside a `rounded-full` container — that was the old zoom control and is why this row exists.

**The `ai` gradient lives in variants, never inline.** `Button variant="ai"` and `ToggleGroup` item `variant="ai"` both carry the violet→indigo gradient (pressed, for the toggle). Don't respell `aria-pressed:bg-gradient-to-br from-violet-500 …` at a call site.

**The zoom control is squared, not a pill.** It's a `ButtonGroup` of `outline` buttons at `rounded-md`. (The floating mobile bottom nav is the one deliberate exception — a pill, matching its detached-overlay language.)

**Add is primary; it's a filled `default` button.** Add item, Add section, and Add link all read as the same full-width primary CTA — the resume's own rows are bordered, so an `outline` add blended into them. One filled treatment, consistent across every add.

**File actions split by direction, not by format.** What _replaces_ the document goes at the top of the Edit list (`editor/sections/document-actions.tsx`): Extract from PDF (`ai`), Import JSON (`outline`). What gets the resume _out_ goes in the top bar's split button: **Download PDF** (`default`) + a chevron menu holding Export JSON. Import stays out of that menu — it wipes the draft with no confirm and must not sit one row from a harmless export. Bar otherwise stays lean: wordmark + save status left, Undo/Redo right. No general File dropdown, no GitHub button.

**Under 360px the Download PDF label yields, the button doesn't.** `sr-only min-[360px]:not-sr-only` — the icon carries the smallest phones, where the words push the split menu off-screen. Don't answer a tight bar by demoting the primary output into the menu.

**Raw `<button>` is legitimate only when `Button`'s box would fight the content**: the template preview card (an aspect-ratio card wrapping a scaled document), the 28px colour swatches, the 80px photo avatar, the tag ✕, the editor rail's nav icons. Everything else uses `Button`. Raw or not, they all take the one focus ring.

---

## Interaction states — one recipe each

**Ring or fill? Ask whether the surface can be tinted.** If it can, tint it and use no ring. If it renders its own content — a document thumbnail, a colour swatch, a photo — a fill is impossible or invisible, so it gets a ring instead. That one question decides every case below; it's the rule whose absence let call sites improvise into three focus-ring spellings and five hover opacities.

**Ring geometry — the offset is the tell.**

| | Ring | Offset | Colour |
|---|---|---|---|
| **Focus** | `ring-3` | **none** | `focus-visible:border-ring` + `focus-visible:ring-ring/40` |
| **Selection** | `ring-2` | `ring-offset-2 ring-offset-background` | opaque `ring-primary`, including over arbitrary swatch fills |

Focus is transient and soft: `--ring` is a **light primary** (`--color-ring: var(--ring)`, retinted per theme in `globals.css`), a blue halo bleeding off the border rather than a second outline. It is never offset — in a dense form an offset ring collides with the neighbouring control. `ring-[3px]` ≡ `ring-3`; don't reintroduce the arbitrary spelling, and the halo is `/40` (not `/10`, not `/50`). The string lives in `FOCUS_RING_CLASS` (`field-control.ts`); feature code spreads it, `ui/*` inline the identical string by shadcn convention (colour is token-driven, so a re-tint is one edit). Semantic states recolour but keep the geometry: destructive `ring-destructive/20`, ai `ring-violet-400/40`, every `aria-invalid:ring-destructive/*`.

Selection is persistent and **vivid** (`--primary`), and the offset gap is what stops it reading as a fat focus ring. `SELECTION_RING_CLASS` (`field-control.ts`) carries the geometry; the colour stays at the call site. **`ring-offset-*` appears nowhere else** — if you see it, it is a selection. Both are lint-enforced.

**Fills — two steps, so hover never collides with selected.**

| Surface | Hover | Selected |
|---|---|---|
| Not selectable — ghost/outline button, toolbar toggle, menu item, tag ✕ | `hover:bg-muted` | — |
| Selectable — rows, accordions (`aria-pressed`) | `aria-[pressed=false]:hover:bg-muted/60` | `aria-pressed:bg-muted` |
| Nav item — rail, mobile bottom nav, tabs | one step below, suppressed when active | `bg-primary/10` + `text-primary` |
| Bordered control — input, textarea, select, tag input, input group, rich text, slider thumb | `hover:border-ring` (**previews focus**), no fill |
| Content surface — template card, dropzone | `hover:border-ring`, **no fill** | selection ring (card) · `data-[dragging]:border-primary data-[dragging]:bg-primary/5` (dropzone) |
| Colour swatch | `hover:scale-110` | selection ring |

Where a surface can be selected, hover sits one step *below* selected and is guarded (`aria-[pressed=false]:` / `not-data-active:`) so hovering the selected item can't wash it out — `editor-row.tsx` is the reference. `--accent` ≡ `--muted` today, so shadcn menus keep their `focus:bg-accent` idiom and it matches. **No dark-mode neutral-fill overrides**: `--muted` already retints per theme, so `dark:hover:bg-muted/50` and `dark:hover:bg-input/50` are shadcn compensations for a palette this project replaced (lint-enforced). Semantic tokens may still step in dark — destructive's dark base genuinely differs.

**Hover on a bordered control previews focus**: the border moves to `--ring`, and focus adds the halo on top. Same move as cards and dropzones, so every bordered thing in the editor answers the pointer the same way. The fill never changes — `FIELD_CONTROL_CLASS` pins the background across `hover:`/`aria-expanded:`/`dark:` on purpose, because ten fields all lighting up under the pointer is noise. Filled controls with no border (switch) step their own token instead.

**Filled variants darken their own token, never switch to another.** Solid fill → `hover:bg-<token>/80` (primary, secondary). Soft/tinted fill → `10` → `hover:20` (destructive). Gradient (ai) → `hover:opacity-90`, since a gradient can't be stepped.

**Press — `active:translate-y-px`**, on button-sized controls (buttons, icon buttons, toolbar toggles, nav items). Popup triggers are excluded via `active:not-aria-[haspopup]:translate-y-px` — the menu opening is already the feedback, so the trigger must not also dip. Colour swatches settle instead of dipping (`hover:scale-110 active:scale-105`), since they're already on the scale axis.

**Large surfaces get no press state, deliberately.** A 1px translate on a full-width row or a template card reads as layout jitter, and the state flip on click is immediate feedback on its own. Don't add one back.

**Disabled — one recipe.** `disabled:pointer-events-none disabled:opacity-50` (Base-UI controls: `data-disabled:pointer-events-none data-disabled:opacity-50`). **No `cursor-not-allowed`** — `pointer-events-none` makes it moot.

**Transitions — one duration.** `transition-[color,box-shadow]` for colour/ring states, `transition-transform` for scale/translate, Tailwind's default 150ms. No ad-hoc `duration-*` on a state; the 300ms fade-in of a template card's preview is a reveal, not a state.

**Interaction state is attribute-driven.** State that has a semantic attribute (`aria-pressed`, `aria-invalid`, `aria-checked`, `data-active`, …) is styled off that attribute via a CSS selector — never a `cn(cond && "…")` branch. State with no semantic attribute (drag) exposes a `data-*` (`data-dragging`) and is styled off it. A control that shows a visual state **must** expose the matching attribute, so a11y and styling come from one source.

**Four blessed exceptions**, each commented at its site — don't "fix" them:

- `sidebar-resize-handle.tsx` takes no focus ring. A 3px halo around a 1px full-height column reads as a rendering artifact, so the bar itself lights up primary instead.
- `tabs.tsx`'s active pill stays a JS branch. It's a `motion.span` with a shared `layoutId`, and the branch is what drives the slide animation.
- `preset-swatch.tsx` marks its selected preset with the check alone, no selection ring. It sits 8px under a template card that already carries the ring, and two offset rings meet in that gap.
- react-colorful is styled in `globals.css`, not Tailwind — it's a third-party widget that ships its own CSS, so its pointer and tracks are retinted to the tokens there.

---

## The Field API

**Use:** `Field` · `FieldGroup` · `FieldSet` · `FieldLegend` · `FieldLabel` · `FieldContent` · `FieldError` · `FieldDescription`

**Deleted:** `FieldTitle` (a div duplicating `FieldLabel`) and `FieldSeparator` (an "or" divider with no role here). Don't re-add them from upstream shadcn without a real use.

`FieldGroup` takes `layout`:

- `stack` (default) — vertical, 12px
- `grid` — 1 column, splitting to 2 against the nearest `@container/fields`

```tsx
<FieldSet>
  <FieldLegend>Page &amp; type</FieldLegend>
  <FieldGroup layout="grid">
    <Field className={span === 2 ? "col-span-full" : undefined}>
      <FieldLabel htmlFor={id} className="sr-only">
        Paper size
      </FieldLabel>
      <FieldContent>
        {/* control — placeholder="Paper size", or aria-label if it has no placeholder prop */}
        <FieldError errors={[error]} />
      </FieldContent>
    </Field>
  </FieldGroup>
</FieldSet>
```

No visible `FieldLabel` sits over a control anymore — the placeholder carries the name, and `FieldLabel` stays for its accessible name only (`sr-only`, or omitted in favour of `aria-label` on the control itself when there's no single focusable target to attach `htmlFor` to).

`FieldLabel` with no `htmlFor` is correct for controls with no single focusable target (ToggleGroup, colour swatches) — the group carries its own `aria-label`.

`span === 2` → `col-span-full`. That's the convention across the Style tab and item fields.

---

## Two-column layout

The grid splits against **`@container/fields`**, which each surface declares on the box its fields actually sit in:

- item card body — `collection-item-row.tsx`
- profile form — `profile-fields.tsx`
- Style tab — `style-tab.tsx`

Threshold: `--container-field-2col` in `globals.css` (**21.5rem / 344px**).

Container queries measure the **content** box, so the inset differs per surface. Measured for an item card: sidebar − ~51px (panel `p-3`, card border, body `p-3`) → flips at a **~395px** sidebar. Both insets dropped `p-4`→`p-3` under the compact standard, widening the content box ~16px and moving the flip ~16px earlier (was ~411px). The 432px default still gets two columns; the 360px minimum still gets one, so `--container-field-2col` (**21.5rem / 344px**) is unchanged. **Measure before changing this** — the arithmetic is easy to get wrong, and `@theme` edits need a dev-server restart to recompile.

---

## Control boxes

Every control in an item form wears **`FIELD_CONTROL_CLASS`** (`forms/fields/field-control.ts`) — Input, Textarea, DatePicker, Select.

It pins `bg-background` across _every_ state (`hover:`, `aria-expanded:`, `data-popup-open:`, and `dark:`). **This is load-bearing.** The pin keeps the control box's background consistent across hover/expanded/dark states instead of drifting per-state. `Button variant="outline"` carries `aria-expanded:bg-muted`, which is exactly how the date picker broke once.

The dark pin is deliberate too: `Input`/`Textarea`/`SelectTrigger`/`Button outline` each carry `dark:bg-input/30`, twMerge keeps it (different modifier), and it outranks a bare `bg-background` on specificity.

**Don't** unify `Input`/`Textarea`/`Select` onto `bg-background` globally — `dark:bg-input/30` is the shared shadcn dark treatment for every control outside the item form.

`DESTRUCTIVE_ICON_CLASS` lives in the same file, paired with `ghost` + `icon-sm`.

---

## Enforced by lint

`no-restricted-syntax` rules in `eslint.config.mjs`, scoped to `src/features/**`, `src/components/ui/**`, `src/app/**`:

1. **No `gap-*` in a `className` on `Field`/`FieldGroup`/`FieldSet`/`FieldContent`.** Fix the primitive or use `layout` — don't override at the call site.
2. **No `text-[Npx]`.** Use the scale.
3. **No `ring-[Npx]`.** The focus ring is `ring-3`.
4. **No `focus-visible:ring-ring/<n>` other than `/40`.** Semantic states recolour; neutral focus doesn't.
5. **No `ring-offset-background`** outside `SELECTION_RING_CLASS`. Offset means selection.
6. **No `dark:hover:bg-{muted,input,accent}`.** Neutral fills already retint per theme.

Each codifies a regression that already happened — spacing drifted to ten gap values, the type scale grew a tail of one-off pixels, and interaction states forked into three ring spellings and five hover opacities. If a rule blocks you, the answer is almost never to disable it.

---

## Adding a surface — checklist

- [ ] Groups get `<FieldSet>` + `<FieldLegend>`; 16px between them.
- [ ] Fields go in `<FieldGroup>`; declare `@container/fields` on the box they sit in if you want 2-col.
- [ ] Don't pass `gap-*`. Don't pass `text-[Npx]`.
- [ ] Item-form controls get `FIELD_CONTROL_CLASS`.
- [ ] Pick the button variant/size from the table, not by eye.
- [ ] One focus ring — `FOCUS_RING_CLASS`, never offset.
- [ ] Can the surface be tinted? Fill it. Can't? `SELECTION_RING_CLASS`. Not both.
- [ ] Selectable surface? Hover is `/60`, selected is full, and hover is suppressed when selected.
- [ ] Button-sized? `active:translate-y-px`. Row- or card-sized? No press state.
- [ ] Verify at sidebar **360 and 640** (resizable) and at **375px** mobile.

## Verifying a change

```bash
rtk tsc && rtk lint && rtk vitest run
```

- **`preview/__snapshots__` must not move.** Nothing in this system touches `preview/`; if that snapshot changes, something is wrong.
- The suite is green (461 tests as of this writing). A failure is yours — don't reach for "pre-existing".
- Grep gates. Run each and compare against the count in the right-hand column — anything above it is drift you introduced:

```bash
rtk grep -rn "text-\[[0-9]*px\]" src/features src/components/ui              # 1 — mobile-bottom-nav, disabled inline
rtk grep -rn "uppercase tracking-wid" src/features                            # 0
rtk grep -rn "gap-6\|gap-y-5\|gap-x-3\|gap-7\|gap-2\.5\|gap-0\.5" src/features src/components/ui  # 3 — see below
rtk grep -rn "ring-ring/10\|ring-ring/50" src/features src/components/ui      # 0
rtk grep -rn "disabled:cursor-not-allowed" src/features src/components/ui      # 0
```

The three gap hits are shadcn dialog shells (`ui/dialog.tsx`, `ui/alert-dialog.tsx` — `gap-6` on the modal box, outside the field scale) and one `gap-0.5` in `insights/suggestion-list.tsx`. Don't add a fourth; fold new work onto the scale.
