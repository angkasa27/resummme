"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  CheckIcon,
  Loader,
  Redo2Icon,
  TriangleAlert,
  Undo2Icon,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { SaveStatus } from "@/features/resume-editor/domain/draft/draft-storage";

const GITHUB_URL = "https://github.com/angkasa27/resume-editor";

export type EditorView = "canvas" | "classic";

type EditorTopBarProps = {
  activeView: EditorView;
  /** Optimistically reflect a tab click before the route navigation lands. */
  onSelectView?: (view: EditorView) => void;
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  /**
   * Right-aligned action slot. Defaults to the GitHub link. The SaaS fork
   * replaces this with its own actions (account menu, upgrade, etc.) without
   * touching the editor.
   */
  actions?: ReactNode;
  /**
   * Targets for the Canvas/Classic tabs. Default to the bare routes; the SaaS
   * fork passes id-bearing hrefs (e.g. `/editor/canvas?id=…`) so switching mode
   * preserves the cloud resume — without editing this component.
   */
  canvasHref?: string;
  classicHref?: string;
};

export function EditorTopBar({
  activeView,
  onSelectView,
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  actions,
  canvasHref = "/editor/canvas",
  classicHref = "/editor/classic",
}: EditorTopBarProps) {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b bg-background px-3 sm:gap-3 sm:px-4 print:hidden">
      <Link href="/">
        <h1 className="font-bold italic pr-1 bg-clip-text text-transparent bg-linear-to-r from-violet-500 to-indigo-600">
          Resummme
        </h1>
      </Link>

      <Tabs
        value={activeView}
        onValueChange={(value) => onSelectView?.(value as EditorView)}
        className="h-8"
      >
        <TabsList
          className="rounded-md border"
          pillClassName="rounded bg-primary/12"
        >
          <TabsTrigger
            value="canvas"
            nativeButton={activeView === "canvas"}
            render={
              activeView === "canvas" ? undefined : <Link href={canvasHref} />
            }
            className={cn(
              "px-2 py-0 leading-none! text-xs!",
              activeView === "canvas" &&
                "data-active:text-primary hover:text-primary cursor-default",
            )}
          >
            Canvas
          </TabsTrigger>
          <TabsTrigger
            value="classic"
            nativeButton={activeView === "classic"}
            render={
              activeView === "classic" ? undefined : <Link href={classicHref} />
            }
            className={cn(
              "px-2 py-0 leading-none! text-xs!",
              activeView === "classic" &&
                "data-active:text-primary hover:text-primary cursor-default",
            )}
          >
            Classic
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <SaveStatusIndicator status={saveStatus} />

      <div className="flex-1" />

      <ButtonGroup>
        <Button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo"
          variant="outline"
          size={isMobile ? "icon-sm" : "sm"}
        >
          <Undo2Icon className="size-4" />
          <span className="hidden md:flex">Undo</span>
        </Button>
        <Button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          aria-label="Redo"
          variant="outline"
          size={isMobile ? "icon-sm" : "sm"}
        >
          <Redo2Icon className="size-4" />
          <span className="hidden md:flex">Redo</span>
        </Button>
      </ButtonGroup>

      {actions ?? <EditorGithubAction />}
    </header>
  );
}

function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  // Synchronous (local) storage never leaves "idle" — nothing to show.
  if (status === "idle") return null;

  const config = {
    saving: {
      icon: <Loader className="size-3.5 animate-spin" />,
      label: "Saving…",
      className: "text-muted-foreground",
    },
    saved: {
      icon: <CheckIcon className="size-3.5" />,
      label: "Saved",
      className: "text-muted-foreground",
    },
    error: {
      icon: <TriangleAlert className="size-3.5" />,
      label: "Save failed",
      className: "text-destructive",
    },
  }[status];

  return (
    <span
      className={cn("flex items-center gap-1 text-xs", config.className)}
      role="status"
      aria-live="polite"
    >
      {config.icon}
      <span className="hidden sm:inline">{config.label}</span>
    </span>
  );
}

export function EditorGithubAction() {
  const isMobile = useIsMobile();

  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open project on GitHub"
      className={cn(
        buttonVariants({
          variant: "outline",
          size: isMobile ? "icon-sm" : "sm",
        }),
        "ml-auto bg-foreground text-background hover:bg-foreground/80! hover:text-background!",
      )}
    >
      <GithubMarkIcon data-icon="inline-start" />
      <span className="hidden md:flex">GitHub</span>
    </a>
  );
}

function GithubMarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
