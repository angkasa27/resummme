import { ResumeEditorCanvas } from "@/features/resume-editor/canvas/resume-editor-canvas";
import { ResumeEditorShell } from "@/features/resume-editor/classic/shell/resume-editor-shell";

export type EditorMode = "canvas" | "classic";

export type EditorHostProps = {
  mode: EditorMode;
  searchParams: Record<string, string | string[] | undefined>;
};

/**
 * Swap point for how the editor route resolves its draft source.
 *
 * This OSS default renders the local (localStorage) editor and ignores
 * `searchParams`. The SaaS branch **replaces this file** with a cloud-aware host
 * (session → DB-backed storage when signed in, local otherwise) — so the editor
 * core (`features/resume-editor`) and the route pages (`app/editor/*`) stay
 * identical across branches. `searchParams` is part of the contract so the cloud
 * host can read `?id=<resumeId>` without changing the routes.
 */
export async function EditorHost({ mode }: EditorHostProps) {
  return mode === "canvas" ? <ResumeEditorCanvas /> : <ResumeEditorShell />;
}
