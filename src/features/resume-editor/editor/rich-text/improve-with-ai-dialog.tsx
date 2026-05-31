"use client";

import { useState } from "react";
import { Loader2Icon, SparklesIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/features/resume-editor/editor/rich-text/rich-text-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRotatingMessage } from "@/features/resume-editor/canvas/controls/use-rotating-message";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  { label: "Add a metric" },
  { label: "Stronger verb" },
  { label: "More concise" },
  { label: "Sound more senior" },
  { label: "Fix grammar" },
] as const;

type QuickActionLabel = (typeof QUICK_ACTIONS)[number]["label"];

const PROGRESS_MESSAGES = [
  "Reading your content…",
  "Applying improvements…",
  "Polishing the language…",
  "Almost done…",
] as const;

type Phase =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "result"; improved: string };

type ImproveWithAiDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentHtml: string;
  onAccept: (improved: string) => void;
};

export function ImproveWithAiDialog({
  open,
  onOpenChange,
  currentHtml,
  onAccept,
}: ImproveWithAiDialogProps) {
  const isMobile = useIsMobile();

  // Mount body only when open so state resets on each open.
  const body = open ? (
    <ImproveWithAiBody
      currentHtml={currentHtml}
      onAccept={(improved) => {
        onAccept(improved);
        onOpenChange(false);
      }}
      onCancel={() => onOpenChange(false)}
    />
  ) : null;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="flex max-h-[92dvh] min-h-0 flex-col gap-3 rounded-t-xl p-4 pt-3"
        >
          <div className="mx-auto h-1 w-10 shrink-0 rounded-full bg-border" />
          <ImproveWithAiHeader onClose={() => onOpenChange(false)} />
          {body}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[85dvh] min-h-0 flex-col gap-4 sm:max-w-lg"
      >
        <DialogHeader className="flex-row items-start justify-between gap-3 shrink-0">
          <div className="flex flex-col gap-1">
            <DialogTitle className="flex items-center gap-2">
              <SparklesIcon className="size-4 text-primary" />
              Improve with AI
            </DialogTitle>
            <DialogDescription>
              Select quick actions or describe what to change. The language of
              your content will be preserved.
            </DialogDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <XIcon />
          </Button>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  );
}

function ImproveWithAiHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="flex items-center gap-2 text-base font-medium">
          <SparklesIcon className="size-4 text-primary" />
          Improve with AI
        </h2>
        <p className="text-xs text-muted-foreground">
          Select quick actions or describe what to change.
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Close"
        onClick={onClose}
      >
        <XIcon />
      </Button>
    </div>
  );
}

type ImproveWithAiBodyProps = {
  currentHtml: string;
  onAccept: (improved: string) => void;
  onCancel: () => void;
};

function ImproveWithAiBody({
  currentHtml,
  onAccept,
  onCancel,
}: ImproveWithAiBodyProps) {
  const [selectedChips, setSelectedChips] = useState<Set<QuickActionLabel>>(
    new Set(),
  );
  const [customInstruction, setCustomInstruction] = useState("");
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });

  function toggleChip(label: QuickActionLabel) {
    setSelectedChips((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  async function handleImprove() {
    setPhase({ kind: "loading" });

    try {
      const response = await fetch("/api/improve-content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          html: currentHtml,
          chips: [...selectedChips],
          customInstruction,
        }),
      });

      const payload = (await response.json()) as {
        improved?: string;
        message?: string;
      };

      if (!response.ok || !payload.improved) {
        throw new Error(
          payload.message ?? "Could not improve the content. Please try again.",
        );
      }

      setPhase({ kind: "result", improved: payload.improved });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not improve the content. Please try again.";
      toast.error(message);
      setPhase({ kind: "idle" });
    }
  }

  if (phase.kind === "loading") {
    return <LoadingPhase />;
  }

  if (phase.kind === "result") {
    return (
      <ResultPhase
        beforeHtml={currentHtml}
        afterHtml={phase.improved}
        onAccept={() => onAccept(phase.improved)}
        onTryAgain={() => setPhase({ kind: "idle" })}
        onCancel={onCancel}
      />
    );
  }

  const canSubmit = selectedChips.size > 0 || customInstruction.trim().length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Quick actions
        </p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_ACTIONS.map(({ label }) => {
            const selected = selectedChips.has(label);
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleChip(label)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                  selected
                    ? "border-violet-500 bg-gradient-to-br from-violet-500 to-indigo-600 text-white"
                    : "border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Additional instructions{" "}
          <span className="normal-case font-normal">(optional)</span>
        </label>
        <Textarea
          value={customInstruction}
          onChange={(e) => setCustomInstruction(e.target.value)}
          placeholder={`e.g. "Add experience in React Native"\n"Emphasize the team leadership aspect"\n"Remove the comma after the first line"`}
          rows={4}
          className="resize-none text-sm"
        />
      </div>

      <div className="flex justify-end gap-2 shrink-0">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="ai"
          size="sm"
          disabled={!canSubmit}
          onClick={handleImprove}
        >
          <SparklesIcon data-icon="inline-start" />
          Improve
        </Button>
      </div>
    </div>
  );
}

function LoadingPhase() {
  const message = useRotatingMessage(PROGRESS_MESSAGES, 2500);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
      <div className="relative grid size-12 place-items-center rounded-full bg-violet-500/10 text-violet-500">
        <SparklesIcon className="size-5" />
        <Loader2Icon className="absolute inset-0 size-12 animate-spin text-violet-400/50" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{message}</p>
        <p className="text-xs text-muted-foreground">This takes a few seconds.</p>
      </div>
    </div>
  );
}

type ResultPhaseProps = {
  beforeHtml: string;
  afterHtml: string;
  onAccept: () => void;
  onTryAgain: () => void;
  onCancel: () => void;
};

function ResultPhase({
  beforeHtml,
  afterHtml,
  onAccept,
  onTryAgain,
  onCancel,
}: ResultPhaseProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Before
          </p>
          <div
            className="prose prose-sm max-w-none rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground line-through decoration-muted-foreground/40 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{ __html: beforeHtml }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-500">
            After
          </p>
          <div
            className="prose prose-sm max-w-none rounded-md border border-violet-500/20 bg-violet-500/5 px-3 py-2 text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{ __html: afterHtml }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 shrink-0 pt-1">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onTryAgain}>
          Try again
        </Button>
        <Button type="button" variant="ai" size="sm" onClick={onAccept}>
          Use this
        </Button>
      </div>
    </div>
  );
}

// ─── Convenience wrapper ──────────────────────────────────────────────────────
// Bundles RichTextEditor + ImproveWithAiDialog into a single drop-in component
// so any form that has a richText field can opt-in to AI improvement without
// duplicating the open-state boilerplate.

type RichTextEditorWithImproveProps = {
  value: string;
  ariaLabel?: string;
  invalid?: boolean;
  onChange: (value: string) => void;
};

export function RichTextEditorWithImprove({
  value,
  ariaLabel,
  invalid = false,
  onChange,
}: RichTextEditorWithImproveProps) {
  const [improveOpen, setImproveOpen] = useState(false);

  return (
    <>
      <RichTextEditor
        value={value}
        ariaLabel={ariaLabel}
        invalid={invalid}
        onChange={onChange}
        onImproveWithAi={() => setImproveOpen(true)}
      />
      <ImproveWithAiDialog
        open={improveOpen}
        onOpenChange={setImproveOpen}
        currentHtml={value}
        onAccept={onChange}
      />
    </>
  );
}
