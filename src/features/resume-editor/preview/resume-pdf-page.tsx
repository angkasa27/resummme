"use client";

import { useEffect, useState } from "react";

import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import { RESUME_PDF_SESSION_STORAGE_KEY } from "@/features/resume-editor/server/resume-pdf-session";
import { importResumeDraft } from "@/lib/resume/storage";
import type { ResumeDraft } from "@/lib/resume/schema";

export function ResumePdfPage() {
  const [draft, setDraft] = useState<ResumeDraft | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const serializedDraft = window.sessionStorage.getItem(
        RESUME_PDF_SESSION_STORAGE_KEY
      );

      if (!serializedDraft) {
        setError("No draft was provided for PDF export.");
        return;
      }

      setDraft(importResumeDraft(serializedDraft));
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Unable to load the draft for PDF export."
      );
    }
  }, []);

  if (error) {
    return (
      <main
        data-pdf-ready="error"
        className="flex min-h-screen items-center justify-center bg-white p-6"
      >
        <p className="max-w-xl text-center text-sm text-destructive">
          {error}
        </p>
      </main>
    );
  }

  if (!draft) {
    return (
      <main
        data-pdf-ready="loading"
        className="flex min-h-screen items-center justify-center bg-white p-6"
      >
        <p className="text-sm text-muted-foreground">Preparing PDF…</p>
      </main>
    );
  }

  return (
    <main
      data-pdf-ready="true"
      className="flex min-h-screen justify-center bg-white p-0"
    >
      <ResumeDocument draft={draft} mode="pdf" />
    </main>
  );
}
