"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  SparklesIcon,
  UnderlineIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  heightClassName?: string;
  invalid?: boolean;
  ariaLabel?: string;
  /** Hint shown while the editor is empty. Carries the field's guidance, since
   * rich-text fields render no visible label. */
  placeholder?: string;
  onImproveWithAi?: () => void;
};

type TiptapEditor = NonNullable<ReturnType<typeof useEditor>>;

const FORMAT_TOGGLES = [
  ["bold", (editor: TiptapEditor) => editor.chain().focus().toggleBold().run()],
  [
    "italic",
    (editor: TiptapEditor) => editor.chain().focus().toggleItalic().run(),
  ],
  [
    "underline",
    (editor: TiptapEditor) => editor.chain().focus().toggleUnderline().run(),
  ],
  [
    "bulletList",
    (editor: TiptapEditor) => editor.chain().focus().toggleBulletList().run(),
  ],
  [
    "orderedList",
    (editor: TiptapEditor) => editor.chain().focus().toggleOrderedList().run(),
  ],
] as const;

function getActiveFormats(editor: TiptapEditor): string[] {
  return FORMAT_TOGGLES.filter(([key]) => editor.isActive(key)).map(
    ([key]) => key,
  );
}

function applyFormatToggle(editor: TiptapEditor, nextValue: string[]) {
  const nextSet = new Set(nextValue);
  for (const [formatKey, toggle] of FORMAT_TOGGLES) {
    const isActive = editor.isActive(formatKey);
    const shouldBeActive = nextSet.has(formatKey);
    if (isActive !== shouldBeActive) {
      toggle(editor);
    }
  }
}

export function RichTextEditor({
  value,
  onChange,
  className,
  heightClassName = "h-48",
  invalid = false,
  ariaLabel,
  placeholder,
  onImproveWithAi,
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
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none rounded-b-md bg-background px-3 py-3 outline-none text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
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

  const activeEditor = editor;
  const plainText = activeEditor.state.doc.textContent;
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const charCount = plainText.length;

  return (
    <div
      aria-invalid={invalid || undefined}
      className={cn(
        "overflow-hidden rounded-md border border-input bg-background",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2 border-b px-2 py-2">
        <ToggleGroup
          multiple
          variant="outline"
          value={getActiveFormats(activeEditor)}
          onValueChange={(nextValue) =>
            applyFormatToggle(activeEditor, nextValue as string[])
          }
        >
          <ToggleGroupItem value="bold" aria-label="Bold" title="Bold">
            <BoldIcon className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic" title="Italic">
            <ItalicIcon className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="underline"
            aria-label="Underline"
            title="Underline"
          >
            <UnderlineIcon className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="bulletList"
            aria-label="Bullet list"
            title="Bullet list"
          >
            <ListIcon className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="orderedList"
            aria-label="Ordered list"
            title="Ordered list"
          >
            <ListOrderedIcon className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        {onImproveWithAi ? (
          <Button
            type="button"
            variant="ai"
            size="icon-sm"
            title="Improve with AI"
            aria-label="Improve with AI"
            onClick={onImproveWithAi}
          >
            <SparklesIcon />
          </Button>
        ) : null}
        <span className="ml-auto text-xs tabular-nums text-muted-foreground select-none">
          {wordCount}w · {charCount}c
        </span>
      </div>
      <div className={cn("bg-background", heightClassName)}>
        <EditorContent
          editor={activeEditor}
          className="h-full overflow-auto [&_div]:h-full"
        />
      </div>
    </div>
  );
}
