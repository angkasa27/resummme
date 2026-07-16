import { cn } from "@/lib/utils";
import { shouldOpenHrefInNewTab } from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";

import type { PreviewContactItem, PreviewRenderContext } from "../types";

/**
 * Contact details render as one list, profile links as a second
 * `.contact-links` list. Items are inline with "•" separators drawn in CSS
 * (resume-document.module.css), so layouts can restyle them as stacked
 * lists by overriding `.contact-item` display and its separator.
 */
export function PreviewContactLine({
  context,
  className,
}: {
  context: PreviewRenderContext;
  className?: string;
}) {
  const { contactItems } = context;
  const details = contactItems.filter((item) => item.kind !== "link");
  const links = contactItems.filter((item) => item.kind === "link");

  return (
    <div className="contact-block">
      {details.length > 0 ? (
        <ul className={cn("contact-line wrap-break-word", className)}>
          {details.map((item, index) => (
            <li key={`${item.kind}-${item.value}-${index}`} className="contact-item">
              <PreviewContactItemText item={item} index={index} />
            </li>
          ))}
        </ul>
      ) : null}
      {links.length > 0 ? (
        <ul
          className={cn(
            "contact-line contact-links wrap-break-word",
            className,
          )}
        >
          {links.map((item, index) => (
            <li key={`${item.kind}-${item.value}-${index}`} className="contact-item">
              <PreviewContactItemText item={item} index={index} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
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
      <a
        href={item.value}
        aria-label={label}
        target={shouldOpenHrefInNewTab(item.value) ? "_blank" : undefined}
        rel={
          shouldOpenHrefInNewTab(item.value) ? "noopener noreferrer" : undefined
        }
      >
        {item.value}
      </a>
    );
  }

  return (
    <span aria-label={label}>
      <span aria-hidden="true">{item.value}</span>
    </span>
  );
}
