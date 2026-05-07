# Resume Editor

A free, no-login resume editor built with Next.js. Write your resume as structured data, preview it live, switch layouts without losing content, and export it as PDF or JSON.

## Features

- Structured resume draft with typed sections for profile, summary, experience, projects, education, skills, and more
- Live preview with switchable layouts and presentation settings
- JSON import/export for portable resume data
- Client-side draft persistence with `localStorage`
- Server-side PDF export powered by Playwright

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand
- React Hook Form + Zod
- TipTap
- Vitest

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm test
pnpm test:watch
pnpm typecheck
```

## How It Works

- The main editor lives at `/`
- The PDF render target lives at `/resume-pdf`
- PDF export is handled by `POST /api/export-pdf`
- Resume drafts are stored locally in the browser and can be exported/imported as JSON

## Environment

Optional:

```bash
PDF_EXPORT_TRUSTED_ORIGINS=https://example.com,https://admin.example.com
```

In production, PDF export requests must come from localhost, the active Vercel URL, or one of the trusted origins above.

## Project Structure

```text
src/
  app/                      # Route entrypoints and route handlers
  components/ui/            # Shared UI primitives
  hooks/                    # Reusable app-level hooks
  lib/                      # App-wide utilities
  test/                     # Test setup
  features/resume-editor/
    domain/                 # Draft model, schema, presentation, rich text, section metadata
    editor/                 # Editor UI, section panels, shell, controller hooks
    forms/                  # Shared form helpers and schema adapters
    preview/                # Layouts, live preview, PDF-facing rendering
    server/                 # Server-only PDF generation
    state/                  # Zustand store and draft state helpers
```
