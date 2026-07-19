"use client";

import { useState } from "react";
import { PencilIcon, TelescopeIcon, XIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JobMatchResult } from "@/features/resume-editor/domain/insights/match-keywords";

type JobDescriptionPanelProps = {
  jobMatch: JobMatchResult | null;
  onAnalyzeClick: () => void;
  onReset: () => void;
};

export function JobDescriptionPanel({
  jobMatch,
  onAnalyzeClick,
  onReset,
}: JobDescriptionPanelProps) {
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);


  if (!jobMatch) {
    return (
      <section className="flex flex-col gap-2 rounded-md border border-dashed bg-muted/30 p-3 text-center">
        <div className="mx-auto grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
          <TelescopeIcon className="size-4" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold">Tailor to a role</h3>
          <p className="text-xs text-muted-foreground">
            Paste a job description to see how well your resume covers it.
          </p>
        </div>
        <Button
          type="button"
          variant="ai"
          size="sm"
          className="w-full"
          onClick={onAnalyzeClick}
        >
          <TelescopeIcon data-icon="inline-start" />
          Analyze a job
        </Button>
      </section>
    );
  }

  const coveragePct = Math.round(jobMatch.coverage * 100);

  return (
    <section className="flex flex-col gap-2 rounded-md border bg-background p-3">
      <header className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold">Job match</h3>
        <span className="text-xs tabular-nums text-muted-foreground">
          {jobMatch.matched.length}/{jobMatch.keywords.length} keywords
          <span className="ml-1 font-semibold text-foreground">
            ({coveragePct}%)
          </span>
        </span>
      </header>

      {jobMatch.missing.length > 0 ? (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            Missing from your resume
          </span>
          <ul className="flex flex-wrap gap-1">
            {jobMatch.missing
              .slice()
              .sort((a, b) => b.weight - a.weight)
              .map((kw) => (
                <li key={`${kw.term}-${kw.category}`}>
                  <Badge variant="outline" className="text-xs">
                    {kw.term}
                  </Badge>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <p className="text-xs text-emerald-600 dark:text-emerald-400">
          Every JD keyword is present — nicely done.
        </p>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onAnalyzeClick}
        >
          <PencilIcon data-icon="inline-start" />
          Edit / re-analyze
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Clear job description"
          onClick={() => setIsResetConfirmOpen(true)}
        >
          <XIcon />
        </Button>
      </div>

      <AlertDialog
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear job match?</AlertDialogTitle>
            <AlertDialogDescription>
              The saved job description and its keyword analysis will be
              removed. You can analyze a new job description anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                onReset();
                setIsResetConfirmOpen(false);
              }}
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
