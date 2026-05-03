"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  minHeightClassName?: string;
  invalid?: boolean;
  ariaLabel?: string;
};

export function RichTextEditor({
  value,
  onChange,
  className,
  minHeightClassName = "min-h-32",
  invalid = false,
  ariaLabel,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          autolink: true,
        },
        underline: {},
      }),
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none rounded-b-md bg-background px-3 py-3 outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
        "aria-label": ariaLabel ?? "Rich text editor",
      },
    },
    onUpdate: ({ editor: nextEditor }) => {
      onChange(nextEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (editor.getHTML() === value) {
      return;
    }

    editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  function toggleLink() {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const nextUrl = window.prompt("Enter a URL", previousUrl ?? "https://");

    if (nextUrl === null) {
      return;
    }

    if (!nextUrl.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: nextUrl.trim() }).run();
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-input bg-background",
        invalid && "border-destructive ring-2 ring-destructive/20",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2 border-b bg-muted/50 px-2 py-2">
        <ToggleGroup
          multiple
          variant="outline"
          spacing={1}
          value={[
            editor.isActive("bold") ? "bold" : "",
            editor.isActive("italic") ? "italic" : "",
            editor.isActive("underline") ? "underline" : "",
            editor.isActive("bulletList") ? "bulletList" : "",
            editor.isActive("orderedList") ? "orderedList" : "",
          ].filter(Boolean)}
          onValueChange={(nextValue) => {
            const nextSet = new Set(nextValue as string[]);
            const formatters = [
              ["bold", () => editor.chain().focus().toggleBold().run()],
              ["italic", () => editor.chain().focus().toggleItalic().run()],
              ["underline", () => editor.chain().focus().toggleUnderline().run()],
              ["bulletList", () => editor.chain().focus().toggleBulletList().run()],
              ["orderedList", () => editor.chain().focus().toggleOrderedList().run()],
            ] as const;

            for (const [formatKey, toggle] of formatters) {
              const isActive = editor.isActive(formatKey === "bulletList" || formatKey === "orderedList" ? formatKey : formatKey);
              const shouldBeActive = nextSet.has(formatKey);

              if (isActive !== shouldBeActive) {
                toggle();
              }
            }
          }}
        >
          <ToggleGroupItem value="bold" aria-label="Bold">
            B
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            I
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            U
          </ToggleGroupItem>
          <ToggleGroupItem value="bulletList" aria-label="Bullet list">
            UL
          </ToggleGroupItem>
          <ToggleGroupItem value="orderedList" aria-label="Ordered list">
            OL
          </ToggleGroupItem>
        </ToggleGroup>
        <Separator orientation="vertical" className="h-6" />
        <Button type="button" variant="outline" size="sm" onClick={toggleLink}>
          Link
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          Unlink
        </Button>
      </div>
      <div className={cn("bg-background", minHeightClassName)}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
