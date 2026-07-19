# Design system — forms, spacing, typography

Scope: the editor's form and control surfaces (item forms, profile, summary, Style/Layout/Template tabs, Insights, dialogs) and the primitives they share. **The landing page is exempt** — it's marketing with its own display treatments, and the lint guards below skip it.

The rule behind every rule here: **spacing and type live in the primitives, not at call sites.** A token or a constant only *renames* a choice — an author can still type `gap-3`. A primitive removes the choice. This whole system exists because the old one drifted to 11 label recipes and 10 gap values, and every one of those was a call-site override.

---

## Spacing — 4 / 8 / 16 / 24

| step | role | who owns it |
|---|---|---|
| **4px** `gap-1` | inside a field: control → error/description | `Field`, `FieldContent` |
| **8px** `gap-2` | attached meta: a legend and the fields it heads; row lists | `FieldSet`; row lists set it directly |
| **16px** `gap-4` | between fields, **both axes** | `FieldGroup` |
| **24px** `gap-6` | between groups | the surface (`flex flex-col gap-6`) |
| **16px** `p-4` | **form** container padding | the surface |

Nothing else. No `gap-0.5`, `gap-1.5`, `gap-2.5`, `gap-3`, `gap-5`, `gap-7`, and no `gap-x-*`/`gap-y-*` split.

**16px between fields is a floor, not taste.** It was measured against the old floated label (16.5px tall, hanging 8.25px over its control's top border — 16px gave ~8px clearance, zero overlaps at 360px and 640px sidebar). The floating label is gone, but 12px still collides with the field above at the row heights in use. Don't "tighten" it.

**`p-4` is a *form* rule.** A nav list is not a form: `section-list` uses `p-2` with `gap-2` rows, because a 16px inset around rows that are themselves `py-2` reads heavy. If you're laying out rows, you're on the 8px step.

---

## Typography — 4 steps, no arbitraries

| step | for |
|---|---|
| `text-2xl` | display — the Insights score number, and nothing else |
| `text-base` | dialog titles, `FieldLegend` (group heading) |
| `text-sm` | **default** — body, labels, values, buttons, errors, descriptions, rows |
| `text-xs` | meta — `sr-only` field labels, badges, captions, counters, helper text |

**`text-[Npx]` is banned** (lint-enforced). There is no micro step: de-emphasis is `text-muted-foreground`'s job, not a 5th size. The panel scrolls, so vertical room is not scarce enough to justify 10px text.

**Uppercase + letter-spacing are gone.** No `uppercase`, no `tracking-wider`. Sentence case everywhere.

---

## Labels — placeholder carries the field

**Field labels are not shown.** The input's placeholder carries the field name: `placeholder = config.placeholder ?? config.label`. No visible label sits above or floats over a control.

**Accessibility is preserved regardless** — every field still has an accessible name, just not a painted one:

- `Input` / `Textarea` / `Select` get an `aria-label`, or a `<FieldLabel htmlFor>` wrapped in `sr-only`.
- Button-triggered controls with no native `placeholder` (`MonthYearPicker`, and Profile/Summary fields built on `Field`) use the `sr-only FieldLabel` route — see `profile-fields.tsx` for the pattern.

**A leading icon can reinforce scanning** where the placeholder alone is ambiguous at a glance — Profile's location (pin), phone, and email each get one via `InputGroup` / `InputGroupAddon`. It's an addition, not a requirement: most fields need no icon.

**Group headings are unchanged.** `<FieldLegend>` (16px semibold) still visibly labels a `FieldSet` — only the per-field label was removed, not the group heading.

This replaces the old three-role float/stacked/none recipe (`FloatingField` + `field-layout.ts`'s label-variant table) — both are deleted. `field-layout.ts` still exists, but only for `fieldSpanByKind` (column span), unrelated to labels now.

---

## Buttons — role decides variant + size

| role | variant | size |
|---|---|---|
| Primary add (Add item, Add section, Add link) | `default` | `default` + `w-full` |
| Primary output (Download PDF, top bar) | `default` | `sm` |
| Document action — AI (Extract from PDF) | `ai` | `default` + `w-full` |
| Document action — plain (Import/Export JSON) | `outline` | `default` |
| Dialog confirm — AI | `ai` | `sm` |
| Dialog confirm — plain | `default` | `sm` |
| Secondary / cancel | `outline` | `sm` |
| Section-level remove (labeled, one per header) | `destructive` | `sm` |
| Destructive icon, repeated in a list (delete row/link) | `ghost` + `DESTRUCTIVE_ICON_CLASS` | `icon-sm` |
| Icon-only (clear, toolbar) | `ghost` | `icon-sm` |
| In-card micro (Fix) | `default` | `xs` |
| Segmented control / stepper (zoom) | `ButtonGroup` of `outline` | `icon-sm` / `sm` |
| Toolbar format toggles | `ToggleGroup variant="outline"` | `sm` |
| AI multi-select chips | `ToggleGroup` item `variant="ai"` | `sm` |

**The size ramp already exists — use it.** `xs` = `h-6 px-2 text-xs`, `sm` = `h-8`, `default` = `h-9`, `icon-xs/sm/lg` = `size-6/8/10`. Hand-writing `size="sm" className="h-6 px-2 text-[11px]"` is reinventing `size="xs"`; that exact line was in the codebase and is why this table exists.

**Icon-only buttons take an `icon-*` size**, not `sm` and not `icon` (`h-9`). The editor default is `icon-sm`.

**Destructive has two treatments, chosen by prominence.** A *labeled* section-level action that appears **once** in a header — "Remove Experience" — is the `destructive` Button variant (soft-filled red). A destructive *icon* repeated **down a list** — the row delete — is the quieter `ghost` + `DESTRUCTIVE_ICON_CLASS`, whose intent only shows on hover; a filled red button on every row shouts. Rule: singular labeled → `destructive` variant; repeated icon → subtle ghost.

**Segmented / stepper controls are a `ButtonGroup`, never a hand-rolled pill.** The zoom control is a `ButtonGroup` of `outline` buttons with the standard `rounded-md` corners. Don't rebuild one from `variant="ghost"` buttons each overriding `rounded-full` inside a `rounded-full` container — that was the old zoom control and is why this row exists.

**The `ai` gradient lives in variants, never inline.** `Button variant="ai"` and `ToggleGroup` item `variant="ai"` both carry the violet→indigo gradient (pressed, for the toggle). Don't respell `aria-pressed:bg-gradient-to-br from-violet-500 …` at a call site.

**The zoom control is squared, not a pill.** It's a `ButtonGroup` of `outline` buttons at `rounded-md`. (The floating mobile bottom nav is the one deliberate exception — a pill, matching its detached-overlay language.)

**Add is primary; it's a filled `default` button.** Add item, Add section, and Add link all read as the same full-width primary CTA — the résumé's own rows are bordered, so an `outline` add blended into them. One filled treatment, consistent across every add.

**Document actions live at the top of the Edit list, not the top bar.** Extract from PDF (`ai`) and Import/Export JSON (`outline`) sit above the section list (`editor/sections/document-actions.tsx`). The top bar stays lean — wordmark + save status on the left; Undo/Redo + the primary **Download PDF** (`default`) on the right. No File dropdown, no GitHub button.

**Raw `<button>` is legitimate only when `Button`'s box would fight the content**: the template preview card (an aspect-ratio card wrapping a scaled document), the 28px colour swatches, the 80px photo avatar, the tag ✕, the editor rail's nav icons. Everything else uses `Button`. Raw or not, they all take the one focus ring.

---

## Focus rings — one recipe

```
focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50
```

`ring-[3px]` ≡ `ring-3` — don't reintroduce the arbitrary spelling.

**Selection is not focus.** The selected swatch keeps `ring-2 ring-offset-2 ring-foreground/60` and the selected template card keeps `ring-2 ring-ring`. Different job, deliberately different look.

---

## The Field API

**Use:** `Field` · `FieldGroup` · `FieldSet` · `FieldLegend` · `FieldLabel` · `FieldContent` · `FieldError` · `FieldDescription`

**Deleted:** `FieldTitle` (a div duplicating `FieldLabel`) and `FieldSeparator` (an "or" divider with no role here). Don't re-add them from upstream shadcn without a real use.

`FieldGroup` takes `layout`:
- `stack` (default) — vertical, 16px
- `grid` — 1 column, splitting to 2 against the nearest `@container/fields`

```tsx
<FieldSet>
  <FieldLegend>Page &amp; type</FieldLegend>
  <FieldGroup layout="grid">
    <Field className={span === 2 ? "col-span-full" : undefined}>
      <FieldLabel htmlFor={id} className="sr-only">Paper size</FieldLabel>
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

Container queries measure the **content** box, so the inset differs per surface. Measured for an item card: sidebar − 67px (panel `p-4`, card border, body `p-4`) → flips at a **~411px** sidebar. The 432px default gets two columns; the 360px minimum gets one. **Measure before changing this** — the arithmetic is easy to get wrong, and `@theme` edits need a dev-server restart to recompile.

---

## Control boxes

Every control in an item form wears **`FIELD_CONTROL_CLASS`** (`forms/fields/field-control.ts`) — Input, Textarea, MonthYearPicker, Select.

It pins `bg-background` across *every* state (`hover:`, `aria-expanded:`, `data-popup-open:`, and `dark:`). **This is load-bearing.** The pin keeps the control box's background consistent across hover/expanded/dark states instead of drifting per-state. `Button variant="outline"` carries `aria-expanded:bg-muted`, which is exactly how the date picker broke once.

The dark pin is deliberate too: `Input`/`Textarea`/`SelectTrigger`/`Button outline` each carry `dark:bg-input/30`, twMerge keeps it (different modifier), and it outranks a bare `bg-background` on specificity.

**Don't** unify `Input`/`Textarea`/`Select` onto `bg-background` globally — `dark:bg-input/30` is the shared shadcn dark treatment for every control outside the item form.

`DESTRUCTIVE_ICON_CLASS` lives in the same file, paired with `ghost` + `icon-sm`.

---

## Enforced by lint

Two `no-restricted-syntax` rules in `eslint.config.mjs`, scoped to `src/features/**`, `src/components/ui/**`, `src/app/**`:

1. **No `gap-*` in a `className` on `Field`/`FieldGroup`/`FieldSet`/`FieldContent`.** Fix the primitive or use `layout` — don't override at the call site.
2. **No `text-[Npx]`.** Use the scale.

Both codify a regression that already happened. If a rule blocks you, the answer is almost never to disable it.

---

## Adding a surface — checklist

- [ ] Groups get `<FieldSet>` + `<FieldLegend>`; 24px between them.
- [ ] Fields go in `<FieldGroup>`; declare `@container/fields` on the box they sit in if you want 2-col.
- [ ] Don't pass `gap-*`. Don't pass `text-[Npx]`.
- [ ] Item-form controls get `FIELD_CONTROL_CLASS`.
- [ ] Pick the button variant/size from the table, not by eye.
- [ ] One focus ring.
- [ ] Verify at sidebar **360 and 640** (resizable) and at **375px** mobile.

## Verifying a change

```bash
rtk tsc && rtk lint && rtk vitest run
```

- **`preview/__snapshots__` must not move.** Nothing in this system touches `preview/`; if that snapshot changes, something is wrong.
- 4 tests fail on `master` already (`pdf-presentation`, `layout-registry`) — pre-existing. Confirm the count stays 4, don't "fix" them.
- Grep gates (all must return zero in `src/features` + `src/components/ui`):

```bash
rtk grep -rn "text-\[[0-9]*px\]" src/features src/components/ui
rtk grep -rn "uppercase tracking-wid" src/features
rtk grep -rn "gap-y-5\|gap-x-3\|gap-7\|gap-2\.5\|gap-0\.5" src/features src/components/ui
```
