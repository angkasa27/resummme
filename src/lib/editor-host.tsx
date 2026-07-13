import { ResumeEditor } from "@/features/resume-editor/editor/resume-editor";

export type EditorHostProps = {
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
export async function EditorHost({ searchParams }: EditorHostProps) {
  // The OSS host renders the local editor and deliberately ignores
  // `searchParams`; it is destructured so the swap contract (which the SaaS
  // host reads for `?id=<resumeId>`) stays part of this function's signature.
  void searchParams;
  return <ResumeEditor />;
}
