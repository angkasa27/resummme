# Contributing

Thank you for considering a contribution! Here's what you need to know.

## Development Setup

```bash
git clone https://github.com/angkasa27/resummme.git
cd resummme
pnpm install
cp .env.example .env.local   # fill in any keys you need
pnpm dev
```

## Before You Start

- For **bug fixes** — open an issue first (unless it's trivial) so we can confirm the bug and agree on a fix.
- For **new features** — open an issue and discuss the approach before writing code. Not every feature fits the project scope.
- For **UI/UX changes** — describe the problem you're solving, not just the solution.

## Workflow

1. Fork the repo and create a branch from `master`:
   ```bash
   git checkout -b fix/short-description
   # or
   git checkout -b feat/short-description
   ```
2. Make your changes.
3. Run the checks:
   ```bash
   pnpm typecheck   # must pass
   pnpm lint        # must pass
   pnpm test        # must pass (112 tests)
   ```
4. Open a pull request against `master`. Fill in the PR template.

## Code Style

- TypeScript strict mode — no `any`, no type assertions unless unavoidable.
- No comments that describe _what_ the code does — only _why_ (hidden constraints, surprising invariants, workarounds).
- No auto-save in canvas forms — Save/Cancel buttons only.
- Prefer editing existing files to creating new ones. No premature abstractions.
- React 19 rules: no component creation during render, no `setState` in `useEffect` for syncing external state (use `useSyncExternalStore` instead).
- New client components that use `window` must handle SSR (`typeof window === "undefined"` guard or `useSyncExternalStore` `getServerSnapshot`).

## Adding a Template

Templates live in `src/features/resume-editor/preview/templates/<name>/`. Each template folder contains:

- `template.tsx` — top-level layout component
- `header.tsx` — resume header (name, contact info)
- `items.tsx` — item-level renderers (optional overrides of the shared defaults)
- `styles.module.css` — scoped CSS that consumes the `--resume-*` CSS variables

Register the new template in `src/features/resume-editor/preview/template-registry.tsx` and add its ID to `pdfTemplateIds` in `pdf-presentation.ts`.

## Adding a Font

Fonts are defined in `src/features/resume-editor/domain/presentation/font-collection.ts`.

- For **Google Fonts**: add a `next/font/google` import in `src/app/fonts.ts`, expose it as a CSS variable (e.g. `--font-my-font`), add the variable to the `<html>` classNames in `src/app/layout.tsx`, then add the font entry to `RESUME_FONTS` with the CSS-variable stack.
- For **system fonts**: add the entry directly to `RESUME_FONTS` with the CSS font-stack string — no import needed.

## Tests

Tests live next to the code they test (`*.test.ts` / `*.test.tsx`). The test suite covers:

- Domain logic (schema parsing, ATS scoring, keyword matching, presentation resolver)
- Server route smoke tests
- UI component rendering

Run `pnpm test:watch` during development. All 112 tests must pass before merging.

## Questions

Open a [GitHub Discussion](../../discussions) for anything that doesn't fit a bug report or feature request.
