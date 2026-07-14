"use client";

import { useState } from "react";
import { TelescopeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogHeaderRow,
  DialogHeaderSection,
} from "@/features/resume-editor/ui/dialog-header";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";

type JdAnalyzeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialJobDescription?: string;
  onSubmit: (jobDescription: string) => void | Promise<void>;
};

export function JdAnalyzeDialog({
  open,
  onOpenChange,
  initialJobDescription = "",
  onSubmit,
}: JdAnalyzeDialogProps) {
  const isMobile = useIsMobile();

  // Remount the body when the dialog opens so the textarea resets to the
  // latest persisted JD without needing an effect-driven sync.
  const body = open ? (
    <JdAnalyzeBody
      key={initialJobDescription}
      initialJobDescription={initialJobDescription}
      onSubmit={async (jd) => {
        onOpenChange(false);
        await onSubmit(jd);
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
          <DialogHeaderSection
            icon={<TelescopeIcon className="size-4 text-primary" />}
            title="Analyze a job description"
            description="Paste the listing to surface keyword gaps."
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
        className="flex max-h-[85dvh] min-h-0 flex-col gap-4 sm:max-w-xl"
      >
        <DialogHeaderRow
          icon={<TelescopeIcon className="size-4 text-primary" />}
          title="Analyze a job description"
          description="Paste the listing. We'll extract the keywords an ATS looks for and compare them to your resume."
          onClose={() => onOpenChange(false)}
        />
        {body}
      </DialogContent>
    </Dialog>
  );
}

type JdAnalyzeBodyProps = {
  initialJobDescription: string;
  onSubmit: (jobDescription: string) => void | Promise<void>;
  onCancel: () => void;
};

function JdAnalyzeBody({
  initialJobDescription,
  onSubmit,
  onCancel,
}: JdAnalyzeBodyProps) {
  const [draft, setDraft] = useState(initialJobDescription);
  const trimmed = draft.trim();
  const charLimit = 12_000;
  const overLimit = trimmed.length > charLimit;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <Textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Paste the full job description here…"
        rows={12}
        // Disable the textarea's intrinsic auto-grow (`field-sizing-content`)
        // so a long JD scrolls inside the dialog instead of pushing it past
        // the viewport.
        className="min-h-0 flex-1 resize-none overflow-y-auto text-sm field-sizing-fixed"
        autoFocus
      />
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          {trimmed.length.toLocaleString()} / {charLimit.toLocaleString()}{" "}
          characters
        </span>
        {overLimit ? (
          <span className="text-destructive">Too long — trim the listing.</span>
        ) : null}
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="ai"
          size="sm"
          disabled={trimmed.length === 0 || overLimit}
          onClick={() => onSubmit(trimmed)}
        >
          <TelescopeIcon data-icon="inline-start" />
          Analyze
        </Button>
      </div>
    </div>
  );
}
