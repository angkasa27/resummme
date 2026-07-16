import { Link, Mail, MapPin, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { shouldOpenHrefInNewTab } from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";

import { formatContactLink } from "./format-contact-link";
import type { PreviewContactItem, PreviewRenderContext } from "../types";

/**
 * How a layout wears its contacts. `inline` flows them on one wrapping line
 * with separators; `stacked` gives each its own line, which is the only thing
 * that reads in a narrow rail. Icons are opt-in per layout: they fight the
 * typographic layouts (minimal, academic) whose whole identity is unadorned
 * text, and academic renders contacts in small-caps where a glyph looks alien.
 */
export type ContactVariant = "inline" | "stacked";

export type ContactPresentation = {
  variant: ContactVariant;
  icons: boolean;
};

export const DEFAULT_CONTACT_PRESENTATION: ContactPresentation = {
  variant: "inline",
  icons: true,
};

/**
 * Every link gets the same glyph. lucide dropped brand icons, and mapping
 * LinkedIn/GitHub onto arbitrary generic ones would say less than the shortened
 * text already does — `linkedin.com/in/x` names the brand by itself.
 */
const ICON_BY_KIND = {
  location: MapPin,
  phone: Phone,
  email: Mail,
  link: Link,
} as const;

const LABEL_BY_KIND: Record<PreviewContactItem["kind"], string> = {
  location: "Location",
  phone: "Phone",
  email: "Email",
  link: "Link",
};

export function PreviewContactLine({
  context,
  className,
  presentation = DEFAULT_CONTACT_PRESENTATION,
}: {
  context: PreviewRenderContext;
  className?: string;
  presentation?: ContactPresentation;
}) {
  const { contactItems } = context;
  const details = contactItems.filter((item) => item.kind !== "link");
  const links = contactItems.filter((item) => item.kind === "link");

  const listClass = cn(
    "contact-line",
    presentation.variant === "stacked" && "contact-line-stacked",
    presentation.icons && "contact-line-iconic",
    className,
  );

  return (
    <div className="contact-block">
      {details.length > 0 ? (
        <ul className={listClass}>
          {details.map((item, index) => (
            <li key={`${item.kind}-${item.value}-${index}`} className="contact-item">
              <PreviewContactItemText item={item} icons={presentation.icons} />
            </li>
          ))}
        </ul>
      ) : null}
      {links.length > 0 ? (
        <ul className={cn(listClass, "contact-links")}>
          {links.map((item, index) => (
            <li key={`${item.kind}-${item.value}-${index}`} className="contact-item">
              <PreviewContactItemText item={item} icons={presentation.icons} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function PreviewContactItemText({
  item,
  icons,
}: {
  item: PreviewContactItem;
  icons: boolean;
}) {
  // The accessible name keeps the full URL; only the visible text shortens.
  const label = `${LABEL_BY_KIND[item.kind]}: ${item.value}`;
  const Icon = ICON_BY_KIND[item.kind];
  const icon = icons ? (
    <Icon className="contact-icon" aria-hidden={true} />
  ) : null;

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
        {icon}
        <span>{formatContactLink(item.value)}</span>
      </a>
    );
  }

  return (
    <span aria-label={label}>
      {icon}
      <span aria-hidden="true">{item.value}</span>
    </span>
  );
}
