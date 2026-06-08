import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        <span className="bg-linear-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent italic">
          Resummme
        </span>
      </h1>
      <p className="max-w-md text-muted-foreground">
        A free, open-source resume editor. Write once, preview instantly, export
        to PDF — no account required.
      </p>
      <div className="flex gap-3">
        <Link
          href="/editor/canvas"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-foreground px-4 text-sm font-medium text-background hover:bg-foreground/90"
        >
          Open Editor
        </Link>
        <Link
          href="/editor/classic"
          className="inline-flex h-9 items-center justify-center rounded-lg border px-4 text-sm font-medium hover:bg-accent"
        >
          Classic Editor
        </Link>
      </div>
    </main>
  );
}
