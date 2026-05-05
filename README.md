# Resume Editor

A web-based resume editor built with Next.js 16, React 19, and a feature-first App Router structure.

The app lets you:
- edit a structured resume draft in the browser
- preview the rendered document live
- export and import JSON drafts
- generate a PDF through a server-side Playwright flow

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
