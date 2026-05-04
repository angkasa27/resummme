import { cn } from "@/lib/utils";
import {
  shouldOpenHrefInNewTab,
} from "@/lib/resume/sanitize-rich-text";

import type { PreviewContactItem } from "../types";
import type { PreviewRenderContext } from "../types";

export function PreviewContactLine({
  context,
  centered = false,
}: {
  context: PreviewRenderContext;
  centered?: boolean;
}) {
  const { contactItems, presentation } = context;
  const { mutedTextColor, contactFontSizePx, bodyLineHeight } = presentation;

  return (
    <p
      className={cn(
        "wrap-break-word",
        centered ? "mx-auto mt-2 max-w-full text-center" : "mt-2 max-w-152",
      )}
      style={{
        fontSize: `${contactFontSizePx}px`,
        lineHeight: String(Math.max(1.45, bodyLineHeight - 0.1)),
        color: mutedTextColor,
      }}
    >
      {contactItems.map((item, index) => (
        <PreviewContactItemText
          key={`${item.kind}-${item.value}-${index}`}
          item={item}
          index={index}
          mutedTextColor={mutedTextColor}
        />
      ))}
    </p>
  );
}

function PreviewContactItemText({
  item,
  index,
  mutedTextColor,
}: {
  item: PreviewContactItem;
  index: number;
  mutedTextColor: string;
}) {
  const label =
    item.kind === "link"
      ? `Link: ${item.value}`
      : index === 0
        ? `Location: ${item.value}`
        : index === 1
          ? `Phone: ${item.value}`
          : `Email: ${item.value}`;

  if (item.kind === "link") {
    return (
      <span>
        {index > 0 ? " • " : null}
        <a
          href={item.value}
          aria-label={label}
          target={shouldOpenHrefInNewTab(item.value) ? "_blank" : undefined}
          rel={
            shouldOpenHrefInNewTab(item.value)
              ? "noopener noreferrer"
              : undefined
          }
          className="underline"
          style={{ color: mutedTextColor }}
        >
          {item.value}
        </a>
      </span>
    );
  }

  return (
    <span aria-label={label}>
      {index > 0 ? " • " : null}
      <span aria-hidden="true">{item.value}</span>
    </span>
  );
}
