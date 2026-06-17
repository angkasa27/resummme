import { Loader } from "lucide-react";

// Streamed instant loading UI shown while a route segment renders. Mirrors the
// editor's in-app loading spinner so navigation feels consistent.
export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-1 items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm font-semibold tracking-tight">Loading</p>
      </div>
    </div>
  );
}
