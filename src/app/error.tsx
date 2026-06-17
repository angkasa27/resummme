"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

// Route-level error boundary. Wraps the segment below it and renders this
// fallback when a render throws. `unstable_retry` re-fetches and re-renders the
// boundary's children (preferred over `reset` since Next.js 16.2).
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Report to an error tracking service here if/when one is wired up.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <TriangleAlert className="size-6 text-destructive" />
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Something went wrong
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          An unexpected error occurred while loading this page. You can try
          again, or head back to the home page.
        </p>
        {error.digest ? (
          <p className="font-mono text-xs text-muted-foreground/70">
            Error ID: {error.digest}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button type="button" onClick={() => unstable_retry()}>
          <RotateCcw data-icon="inline-start" />
          Try again
        </Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Go home
        </Link>
      </div>
    </div>
  );
}
