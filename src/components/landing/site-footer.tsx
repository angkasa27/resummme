import Link from "next/link";

const GITHUB_URL = "https://github.com/angkasa27/resume-editor";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <div>
          <span className="font-bold italic bg-linear-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent">
            Resummme
          </span>
        </div>
        <nav className="flex items-center gap-5">
          <Link href="/editor" className="hover:text-foreground">
            Editor
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
        <span>© {new Date().getFullYear()} Resummme</span>
      </div>
    </footer>
  );
}
