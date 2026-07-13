"use client";

import { useMemo } from "react";

import { computeAtsScore } from "@/features/resume-editor/domain/insights/ats-score";
import type { JobMatchResult } from "@/features/resume-editor/domain/insights/match-keywords";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

export function useAtsScore(draft: ResumeDraft, jobMatch?: JobMatchResult) {
  return useMemo(() => computeAtsScore(draft, jobMatch), [draft, jobMatch]);
}
