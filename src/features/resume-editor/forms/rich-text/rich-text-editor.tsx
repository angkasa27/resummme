"use client";

import { useEffect, useId, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import {
  BoldIcon,
  ItalicIcon,
  Link2OffIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  SparklesIcon,
  UnderlineIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  sanitizeRichTextHref,
  shouldOpenHrefInNewTab,
} from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";
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

function isSelectionInsideEditor(
  domSelection: Selection | null,
  editorDom: Node,
): domSelection is Selection & { anchorNode: Node; focusNode: Node } {
  return !!(
    domSelection?.anchorNode &&
    domSelection.focusNode &&
    editorDom.contains(domSelection.anchorNode) &&
    editorDom.contains(domSelection.focusNode)
  );
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
  const linkInputId = useId();
  const [isLinkEditorOpen, setIsLinkEditorOpen] = useState(false);
  const [linkDraft, setLinkDraft] = useState("https://");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSelection, setLinkSelection] = useState<{
    from: number;
    to: number;
  } | null>(null);
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

  const activeEditor = editor;
  const plainText = activeEditor.state.doc.textContent;
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const charCount = plainText.length;

  function openLinkEditor() {
    setLinkError(null);
    setIsLinkEditorOpen(true);
  }

  function getCurrentLinkSelection() {
    const domSelection = window.getSelection();

    if (isSelectionInsideEditor(domSelection, activeEditor.view.dom)) {
      try {
        const anchor = activeEditor.view.posAtDOM(
          domSelection.anchorNode,
          domSelection.anchorOffset,
        );
        const focus = activeEditor.view.posAtDOM(
          domSelection.focusNode,
          domSelection.focusOffset,
        );

        return {
          from: Math.min(anchor, focus),
          to: Math.max(anchor, focus),
        };
      } catch {
        // Fall back to the editor state selection if DOM positions cannot be resolved.
      }
    }

    return {
      from: activeEditor.state.selection.from,
      to: activeEditor.state.selection.to,
    };
  }

  function prepareLinkEditor() {
    const previousUrl = activeEditor.getAttributes("link").href as
      | string
      | undefined;
    const selection = getCurrentLinkSelection();

    setLinkSelection({
      from: selection.from,
      to: selection.to,
    });
    setLinkDraft(previousUrl ?? "https://");
  }

  function applyLink() {
    const sanitizedHref = sanitizeRichTextHref(linkDraft.trim());

    if (!sanitizedHref) {
      setLinkError("Enter a valid link.");
      return;
    }

    const chain = activeEditor.chain().focus();

    if (linkSelection) {
      chain.setTextSelection(linkSelection);
    }

    const attributes: { href: string; target?: string; rel?: string } = {
      href: sanitizedHref,
    };

    if (shouldOpenHrefInNewTab(sanitizedHref)) {
      attributes.target = "_blank";
      attributes.rel = "noopener noreferrer";
    }

    chain.extendMarkRange("link").setLink(attributes).run();
    setIsLinkEditorOpen(false);
    setLinkError(null);
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-input bg-background",
        invalid && "border-destructive ring-3 ring-destructive/20",
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
        <Separator orientation="vertical" />
        <Popover open={isLinkEditorOpen} onOpenChange={setIsLinkEditorOpen}>
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                title="Edit link"
              />
            }
            onMouseDown={(event) => {
              event.preventDefault();
              prepareLinkEditor();
            }}
            onClick={openLinkEditor}
          >
            <LinkIcon />
          </PopoverTrigger>
          <PopoverContent role="dialog" aria-label="Link editor" align="start">
            <PopoverHeader>
              <PopoverTitle>Edit link</PopoverTitle>
              <PopoverDescription>
                Add or update the selected link without leaving the editor.
              </PopoverDescription>
            </PopoverHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor={linkInputId}>Link URL</Label>
              <Input
                id={linkInputId}
                type="url"
                autoComplete="url"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={true}
                aria-invalid={linkError ? true : undefined}
                value={linkDraft}
                onChange={(event) => {
                  setLinkDraft(event.target.value);
                  if (linkError) {
                    setLinkError(null);
                  }
                }}
              />
              {linkError ? (
                <p className="text-sm text-destructive" role="alert">
                  {linkError}
                </p>
              ) : null}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsLinkEditorOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={applyLink}>
                Apply link
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          title="Remove link"
          aria-label="Remove link"
          onClick={() => activeEditor.chain().focus().unsetLink().run()}
        >
          <Link2OffIcon />
        </Button>
        {onImproveWithAi ? (
          <>
            <Separator orientation="vertical" />
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
          </>
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
