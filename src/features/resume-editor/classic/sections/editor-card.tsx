import type { ReactNode } from "react";

type EditorCardProps = {
  title: string;
  meta?: ReactNode;
  /** Leading slot in the header (e.g. the sidebar trigger). */
  leading?: ReactNode;
  children: ReactNode;
};

export function EditorCard({
  title,
  meta,
  leading,
  children,
}: EditorCardProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4 sm:px-6">
        {leading}
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <h2 className="min-w-0 truncate text-base font-semibold">{title}</h2>
          {meta}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 @container/form">
        {children}
      </div>
    </div>
  );
}
