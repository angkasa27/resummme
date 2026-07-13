import { EditorHost } from "@/lib/editor-host";

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <EditorHost searchParams={await searchParams} />;
}
