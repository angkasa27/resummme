"use client";

import { useState } from "react";

import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

import { CategoryBreakdown } from "./category-breakdown";
import { JdAnalyzeDialog } from "./jd-analyze-dialog";
import { JdAnalyzeProgress } from "./jd-analyze-progress";
import { JobDescriptionPanel } from "./job-description-panel";
import { ScoreRing } from "./score-ring";
import { SuggestionList } from "./suggestion-list";
import { useAtsScore } from "./use-ats-score";
import { useJobMatch } from "./use-job-match";

type InsightsTabProps = {
  draft: ResumeDraft;
  onOpenSection?: (panel: EditorPanelKey) => void;
};

export function InsightsTab({ draft, onOpenSection }: InsightsTabProps) {
  const { jobMatch, jobDescription, submitState, analyze, reset } = useJobMatch(draft);
  const score = useAtsScore(draft, jobMatch ?? undefined);
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(false);

  const isAnalyzing = submitState.status === "loading";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-2 py-1">
        <ScoreRing score={score.score} />
      </div>

      <CategoryBreakdown breakdown={score.breakdown} />
      <SuggestionList suggestions={score.suggestions} onFix={onOpenSection} />
      <JobDescriptionPanel
        jobMatch={jobMatch}
        onAnalyzeClick={() => setIsAnalyzeOpen(true)}
        onReset={reset}
      />

      <JdAnalyzeDialog
        open={isAnalyzeOpen}
        onOpenChange={setIsAnalyzeOpen}
        initialJobDescription={jobDescription}
        onSubmit={analyze}
      />
      <JdAnalyzeProgress open={isAnalyzing} />
    </div>
  );
}
