import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Root not-found UI. Renders for `notFound()` calls and any unmatched URL
// across the app, composed inside the root layout (Server Component).
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="size-6 text-muted-foreground" />
        </div>
        <p className="font-heading text-5xl font-bold tracking-tight">404</p>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>
      </div>
      <Link href="/" className={cn(buttonVariants())}>
        Go home
      </Link>
    </div>
  );
}
