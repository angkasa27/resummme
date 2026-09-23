import Link from "next/link";

import { brand } from "@/lib/brand";


export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <Link
          href="/"
          className="font-bold italic pr-1 bg-linear-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent"
        >
          {brand.name}
        </Link>
        <nav className="flex items-center gap-5">
          <Link href="/templates" className="hover:text-foreground">
            Templates
          </Link>
          <Link href="/editor" className="hover:text-foreground">
            Editor
          </Link>
          <a
            href={brand.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
        <span>© {new Date().getFullYear()} {brand.name}</span>
      </div>
    </footer>
  );
}
