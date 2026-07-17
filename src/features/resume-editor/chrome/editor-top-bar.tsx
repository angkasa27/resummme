"use client";

import Link from "next/link";
import {
  CheckIcon,
  DownloadIcon,
  Loader,
  Redo2Icon,
  TriangleAlert,
  Undo2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { SaveStatus } from "@/features/resume-editor/domain/draft/draft-storage";

type EditorTopBarProps = {
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  /** The primary output action — renders the Download PDF button. */
  onExportPdf: () => void;
  isExportingPdf: boolean;
};

export function EditorTopBar({
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onExportPdf,
  isExportingPdf,
}: EditorTopBarProps) {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b bg-background px-3 sm:gap-3 sm:px-4 print:hidden">
      <Link href="/">
        <h1 className="font-bold italic pr-1 bg-clip-text text-transparent bg-linear-to-r from-violet-500 to-indigo-600">
          Resummme
        </h1>
      </Link>

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

      <Button
        type="button"
        onClick={onExportPdf}
        disabled={isExportingPdf}
        aria-label="Download PDF"
        size={isMobile ? "icon-sm" : "sm"}
      >
        {isExportingPdf ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <DownloadIcon className="size-4" />
        )}
        <span className="hidden md:flex">
          {isExportingPdf ? "Generating PDF…" : "Download PDF"}
        </span>
      </Button>
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
