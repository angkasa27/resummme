import { cn } from "@/lib/utils";
import { shouldOpenHrefInNewTab } from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";

import type { PreviewContactItem, PreviewRenderContext } from "../types";

export function PreviewContactLine({
  context,
  className,
}: {
  context: PreviewRenderContext;
  className?: string;
}) {
  const { contactItems } = context;

  return (
    <p className={cn("contact-line wrap-break-word", className)}>
      {contactItems.map((item, index) => (
        <PreviewContactItemText
          key={`${item.kind}-${item.value}-${index}`}
          item={item}
          index={index}
        />
      ))}
    </p>
  );
}

function PreviewContactItemText({
  item,
  index,
}: {
  item: PreviewContactItem;
  index: number;
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
