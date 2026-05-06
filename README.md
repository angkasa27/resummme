# Resume Editor

A free, no-login resume editor that treats your CV as portable data. Edit a detailed, structured draft in your browser, switch layouts without losing a single bullet, and export to PDF or JSON whenever you want.

## Why This Exists

Most resume editors force a tradeoff:

- **Detailed but rigid** — they let you express the full shape of a real CV (multiple roles per company, project sub-bullets, links, custom sections) but lock you into one fixed visual style.
- **Customizable but shallow** — they offer themes and layouts but flatten everything into "title / company / dates / one paragraph," and your nuance is gone.
- **Free but gated** — even the lightweight ones tend to ask you to sign up, hand over an email, and store your CV on someone else's server before you can export a single PDF.

The thing that pushed me to build this: every time I tried switching editors because I disliked the current one, I had to retype every bullet, every date, every link from scratch. Your resume should be portable.

This project is a personal answer to those frustrations:

- **Structured data, not a styled blob.** Your CV is a typed, validated draft you can export as JSON and re-import anywhere this tool runs. Switching themes never costs you data.
- **Detail without compromise.** The schema supports the things real CVs actually have — multiple links, rich text bullets, dated achievements, project breakdowns — and the layout system reflects that detail rather than collapsing it.
- **Customization that's actually customizable.** Layouts are pluggable definitions (see `preview/layouts`), and presentation settings (theme, density, font) are separate from content. Swap the look without touching the data.
- **No login, no account, no server-side storage.** Drafts live in your browser's `localStorage`. PDF export runs through a stateless server route that doesn't persist anything.

## What It Does

- Edit a structured resume draft in the browser with an inline canvas editor (hover a section to edit/move/delete it).
- Preview the rendered document live with switchable layouts and presentation settings.
- Zoom the canvas in and out without affecting the exported PDF.
- Export and import JSON drafts so your data is yours and travels with you.
- Generate a print-ready PDF through a server-side Playwright flow.

## Stack

- Next.js 16.2.4
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand
- React Hook Form + Zod
- TipTap
- Vitest

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm test
pnpm test:watch
pnpm typecheck
```

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Start the dev server:

```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

The codebase is organized around the `resume-editor` feature:

```text
src/
  app/
    page.tsx
    resume-pdf/page.tsx
    api/export-pdf/route.ts
  components/ui/
  hooks/
  lib/
  test/
  features/resume-editor/
    domain/
      draft/
      presentation/
      rich-text/
      schema/
      sections/
    editor/
      hooks/
      rich-text/
      sections/
      shell/
    forms/
    preview/
      components/
      helpers/
      kit/
      layouts/
    server/
    state/
```

### Folder Responsibilities

- `src/app`
  Thin route entrypoints and route handlers only.
- `src/features/resume-editor/domain`
  Resume draft model, parsing, defaults, serialization, presentation config, and shared feature domain logic.
- `src/features/resume-editor/editor`
  Editor UI, section panels, editor shell, and editor-specific hooks.
- `src/features/resume-editor/forms`
  Form schema adapters and shared form helpers.
- `src/features/resume-editor/preview`
  Resume rendering, layout definitions, preview controls, and PDF-facing preview UI.
- `src/features/resume-editor/server`
  Server-only PDF generation code.
- `src/features/resume-editor/state`
  Zustand store and draft state helpers.
- `src/hooks`
  App-level reusable hooks.
- `src/components/ui`
  Shared UI primitives.

## How It Works

### Draft Storage

- Resume drafts are stored client-side in `localStorage`.
- Import/export uses a JSON representation of the validated draft schema.

### Preview

- The main route `/` renders the editor shell.
- The preview panel renders the selected PDF presentation and layout in real time.
- `/resume-pdf` is a dedicated render target used during PDF generation.

### PDF Export

PDF export is handled by `POST /api/export-pdf`.

The route:
- validates the incoming draft with Zod
- checks request origin policy
- delegates rendering to a Playwright-based server flow
- returns a generated PDF binary

## Environment Notes

Optional environment variable:

```bash
PDF_EXPORT_TRUSTED_ORIGINS=https://example.com,https://admin.example.com
```

Behavior:
- in development, export requests are allowed
- in production, requests must come from localhost, the current Vercel URL, or one of `PDF_EXPORT_TRUSTED_ORIGINS`

## Testing And Verification

Recommended verification flow:

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

Tests are colocated with the feature modules they cover, using `*.test.ts` and `*.test.tsx`.

## Notes For Contributors

- Keep route files thin.
- Keep resume-specific logic inside `src/features/resume-editor`.
- Keep only genuinely reusable logic in `src/hooks`, `src/lib`, and `src/components/ui`.
- Prefer direct imports over feature-internal barrel files unless a barrel is a deliberate public boundary.
