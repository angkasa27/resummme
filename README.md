# Resume Editor

> A free, open-source resume editor. Write once, preview instantly, export to PDF — no account required.

**[Live Demo → resume-editor.asaa.dev](https://resume-editor.asaa.dev/)**

---

## Features

- **5 professional templates** — Classic, Sidebar, Modern Centered, Compact, Academic
- **Live canvas preview** — Real-time preview that matches the exported PDF
- **AI writing assistant** — Improve any bullet point with AI; choose quick actions (stronger verb, add a metric, more concise) or write a custom instruction; output is generated in the same language as your resume
- **AI PDF extraction** — Upload an existing resume PDF and Gemini parses it directly into the editor
- **ATS score** — Live structural/content score with categorized suggestions; paste a job description to get keyword-gap analysis powered by Gemini
- **Font picker** — Google Fonts (Inter, Lato, Open Sans, Roboto, Merriweather, Playfair Display, Lora) and web-safe system fonts, grouped by sans-serif / serif; each option renders in its own typeface
- **Full style control** — Accent color, font scale, line height, section spacing, paper size (A4 / Letter), page margins
- **PDF export** — High-fidelity PDF via Puppeteer locally and Cloudflare Browser Run in production
- **JSON import / export** — Portable, version-controllable resume data
- **No account required** — All data stored locally in the browser via `localStorage`

## Tech Stack

| Layer         | Library                              |
| ------------- | ------------------------------------ |
| Framework     | Next.js 16 (App Router)              |
| UI primitives | React 19, Base UI, Tailwind CSS 4    |
| Forms         | React Hook Form + Zod                |
| Rich text     | TipTap                               |
| State         | Zustand                              |
| PDF export    | Puppeteer / Cloudflare Browser Run   |
| AI            | Google Gemini API (gemini-2.0-flash) |
| Testing       | Vitest + Testing Library             |

## Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+

### Installation

```bash
git clone https://github.com/angkasa27/resume-editor.git
cd resume-editor
pnpm install
```

### Environment

Copy the example env file and fill in the values you need:

```bash
cp .env.example .env.local
```

All variables are optional — the editor works without them. Only AI features and production PDF export require keys. See [Environment Variables](#environment-variables) for details.

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
pnpm dev          # Start the development server
pnpm build        # Build for production
pnpm start        # Start the production server
pnpm lint         # Run ESLint
pnpm test         # Run Vitest (single pass)
pnpm test:watch   # Run Vitest in watch mode
pnpm typecheck    # Type-check with tsc
```

## Environment Variables

Create a `.env.local` from the template:

```bash
cp .env.example .env.local
```

### AI features — Google Gemini

Powers "Extract from PDF", "Improve with AI", and "Analyze job description".

```bash
GEMINI_API_KEY=                  # https://aistudio.google.com/
GEMINI_MODEL=gemini-2.0-flash    # Optional model override
```

Without a key the AI buttons are visible but calls will return a 503 error.

### PDF export

```bash
# "auto" (default) | "puppeteer" | "cloudflare-browser-run"
PDF_EXPORT_PROVIDER=auto
```

`auto` uses local Puppeteer in development. For production with Cloudflare Browser Run:

```bash
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_BROWSER_RUN_API_TOKEN=
CLOUDFLARE_BROWSER_RUN_KEEP_ALIVE_MS=60000
```

### Security

```bash
# Comma-separated origins allowed to call /api/export-pdf cross-origin.
# Same-origin requests are always allowed without this.
PDF_EXPORT_TRUSTED_ORIGINS=https://example.com
```

## Project Structure

```text
src/
  app/                         # Next.js route entrypoints and API handlers
  components/ui/               # Shared UI primitives (Button, Dialog, Select…)
  hooks/                       # App-level React hooks
  lib/                         # Utilities (cn, etc.)
  test/                        # Vitest setup
  features/resume-editor/
    canvas/                    # Control panel (Style tab, Insights tab, canvas forms)
      controls/                # Color picker, font picker, extract-CV dialog, ATS insights
      forms/                   # Canvas-mode section editors (dialog-based)
    domain/
      insights/                # ATS scoring, keyword matching, text extraction
      presentation/            # CSS-var resolver, font collection, paper/margin config
      rich-text/               # Rich-text sanitization helpers
      schema/                  # Zod schemas for the full resume draft
      sections/                # Section metadata, ordering, field config maps
    editor/                    # Sidebar editor (section panels, shell, rich text)
      rich-text/               # TipTap editor + "Improve with AI" dialog
      sections/                # Per-section form field renderers
    forms/                     # Shared form utilities and schema adapters
    preview/                   # Template registry, live preview, CSS modules
      templates/               # classic | sidebar | modern-centered | compact | academic
    server/                    # Server-only helpers (PDF generation, Gemini wrappers)
    state/                     # Zustand store and draft state helpers
```

## How It Works

- **Editor** (`/`) — Split-panel layout: form editor left, live canvas preview center, Style/Insights panel right.
- **PDF render target** (`/resume-pdf`) — A plain page that Puppeteer opens to capture the PDF. Receives draft + presentation settings via base64-encoded query params.
- **PDF export** — `POST /api/export-pdf` → Puppeteer/Cloudflare Browser Run → streamed PDF response.
- **AI PDF import** — `POST /api/import-pdf` → extracts text → Gemini → structured draft JSON.
- **AI writing** — `POST /api/improve-content` → current field HTML + instructions → Gemini → sanitized HTML.
- **ATS job match** — `POST /api/insights/match-keywords` → job description → Gemini keyword list → client matches against current draft.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

[MIT](LICENSE)
