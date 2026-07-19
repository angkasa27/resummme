"use client";

import { useState } from "react";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DialogHeaderRow,
  DialogHeaderSection,
} from "@/features/resume-editor/editor/shared/dialog-header";
import { RichTextEditor } from "@/features/resume-editor/forms/rich-text/rich-text-editor";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { FieldLabelText } from "@/features/resume-editor/forms/fields/field-label-text";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRotatingMessage } from "@/features/resume-editor/editor/shared/use-rotating-message";

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

function ImproveWithAiDialog({
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
          className="flex max-h-[92dvh] min-h-0 flex-col gap-4 rounded-t-xl p-4 pt-3"
        >
          <div className="mx-auto h-1 w-10 shrink-0 rounded-full bg-border" />
          <DialogHeaderSection
            icon={<SparklesIcon className="size-4 text-primary" />}
            title="Improve with AI"
            description="Select quick actions or describe what to change."
            onClose={() => onOpenChange(false)}
          />
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
        <DialogHeaderRow
          className="shrink-0"
          icon={<SparklesIcon className="size-4 text-primary" />}
          title="Improve with AI"
          description="Select quick actions or describe what to change. The language of your content will be preserved."
          onClose={() => onOpenChange(false)}
        />
        {body}
      </DialogContent>
    </Dialog>
  );
}

async function requestContentImprovement(input: {
  html: string;
  chips: string[];
  customInstruction: string;
}): Promise<string> {
  const response = await fetch("/api/improve-content", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
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

  return payload.improved;
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


  async function handleImprove() {
    setPhase({ kind: "loading" });

    try {
      const improved = await requestContentImprovement({
        html: currentHtml,
        chips: [...selectedChips],
        customInstruction,
      });
      setPhase({ kind: "result", improved });
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

  const canSubmit =
    selectedChips.size > 0 || customInstruction.trim().length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <FieldSet>
        <FieldLegend>Quick actions</FieldLegend>
        {/* A real toggle group: these are multi-select and were previously bare
            <button>s with no aria-pressed, so selection was invisible to AT. */}
        <ToggleGroup
          multiple
          aria-label="Quick actions"
          value={[...selectedChips]}
          onValueChange={(next) =>
            setSelectedChips(new Set(next as QuickActionLabel[]))
          }
          className="flex flex-wrap gap-2"
        >
          {QUICK_ACTIONS.map(({ label }) => (
            <ToggleGroupItem
              key={label}
              value={label}
              variant="ai"
              size="sm"
            >
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FieldSet>

      <Field className="min-h-0 flex-1">
        <FieldLabel htmlFor="improve-instructions">
          <FieldLabelText label="Additional instructions" optional />
        </FieldLabel>
        <FieldContent className="min-h-0 flex-1">
          <Textarea
            id="improve-instructions"
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
            placeholder={`e.g. "Add experience in React Native"\n"Emphasize the team leadership aspect"\n"Remove the comma after the first line"`}
            rows={4}
            className="resize-none"
          />
        </FieldContent>
      </Field>

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
        <p className="text-xs text-muted-foreground">
          This takes a few seconds.
        </p>
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
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-muted-foreground">Before</p>
          <div
            className="prose prose-sm max-w-none rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground line-through decoration-muted-foreground/40 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{ __html: beforeHtml }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-violet-500">After</p>
          <div
            className="prose prose-sm max-w-none rounded-md border border-violet-500/20 bg-violet-500/5 px-3 py-2 text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{ __html: afterHtml }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 shrink-0 pt-1">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
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
  placeholder?: string;
  onChange: (value: string) => void;
};

export function RichTextEditorWithImprove({
  value,
  ariaLabel,
  invalid = false,
  placeholder,
  onChange,
}: RichTextEditorWithImproveProps) {
  const [improveOpen, setImproveOpen] = useState(false);

  return (
    <>
      <RichTextEditor
        value={value}
        ariaLabel={ariaLabel}
        invalid={invalid}
        placeholder={placeholder}
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
