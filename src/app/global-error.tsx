"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

import "./globals.css";

// Fallback for errors thrown in the root layout/template, which the segment
// `error.tsx` cannot catch. It replaces the root layout, so it must render its
// own <html>/<body> and import global styles. Metadata exports are unsupported
// here (see the React <title> below).
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full">
        <title>Something went wrong | Resummme</title>
        <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Something went wrong
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              A critical error occurred. Please try again, or reload the page.
            </p>
            {error.digest ? (
              <p className="font-mono text-xs text-muted-foreground/70">
                Error ID: {error.digest}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
