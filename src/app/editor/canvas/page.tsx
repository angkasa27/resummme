import { EditorHost } from "@/lib/editor-host";

export default async function CanvasEditorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <EditorHost mode="canvas" searchParams={await searchParams} />;
}
