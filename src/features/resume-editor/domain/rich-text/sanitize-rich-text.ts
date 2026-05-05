const BLOCKED_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "template",
  "svg",
  "math",
]);

const ALLOWED_TAGS = new Set([
  "p",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "u",
  "a",
  "br",
]);

const SAFE_URL_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"] as const;

function decodeHtmlAttribute(value: string) {
  return value
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getAttributeValue(attributes: string, name: string) {
  const match = attributes.match(
    new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s"'>]+))`, "i")
  );

  if (!match) {
    return null;
  }

  return decodeHtmlAttribute(match[2] ?? match[3] ?? match[4] ?? "");
}

export function sanitizeRichTextHref(href: string | null | undefined) {
  if (!href) {
    return null;
  }

  try {
    const parsedUrl = new URL(href, "https://resume-editor.local");
    const isRelative = !/^[a-z][a-z0-9+.-]*:/i.test(href);

    if (
      isRelative ||
      SAFE_URL_PROTOCOLS.includes(
        parsedUrl.protocol as (typeof SAFE_URL_PROTOCOLS)[number]
      )
    ) {
      return href;
    }
  } catch {
    return null;
  }

  return null;
}

function getSanitizedHref(attributes: string) {
  return sanitizeRichTextHref(getAttributeValue(attributes, "href"));
}

export function shouldOpenHrefInNewTab(href: string) {
  return /^https?:/i.test(href);
}

export function sanitizeRichTextHtml(value: string) {
  const strippedBlockedTags = value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<(script|style|iframe|object|embed|template|svg|math)\b[^>]*>[\s\S]*?<\/\1>/gi,
      ""
    );

  return strippedBlockedTags.replace(
    /<\/?([a-z0-9-]+)([^>]*)>/gi,
    (match, rawTagName: string, rawAttributes: string) => {
      const tagName = rawTagName.toLowerCase();
      const isClosingTag = match.startsWith("</");

      if (BLOCKED_TAGS.has(tagName)) {
        return "";
      }

      if (!ALLOWED_TAGS.has(tagName)) {
        return "";
      }

      if (isClosingTag) {
        return `</${tagName}>`;
      }

      if (tagName === "br") {
        return "<br>";
      }

      if (tagName !== "a") {
        return `<${tagName}>`;
      }

      const sanitizedHref = getSanitizedHref(rawAttributes);
      const target = getAttributeValue(rawAttributes, "target");
      const nextAttributes: string[] = [];

      if (sanitizedHref) {
        nextAttributes.push(`href="${escapeHtmlAttribute(sanitizedHref)}"`);
      }

      if (target?.toLowerCase() === "_blank") {
        nextAttributes.push('target="_blank"');
        nextAttributes.push('rel="noopener noreferrer"');
      }

      return nextAttributes.length > 0
        ? `<a ${nextAttributes.join(" ")}>`
        : "<a>";
    }
  );
}
