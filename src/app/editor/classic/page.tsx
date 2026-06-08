import { EditorHost } from "@/lib/editor-host";

export default async function ClassicEditorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <EditorHost mode="classic" searchParams={await searchParams} />;
}
