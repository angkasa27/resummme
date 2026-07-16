/**
 * Shortens a profile URL for display. The full URL stays in the `href` and the
 * accessible name — only the visible text shrinks.
 *
 * Raw URLs are the worst thing on the page: `https://www.linkedin.com/in/x`
 * costs a whole line in a header and cannot wrap cleanly in a rail, where it
 * used to break mid-word. ATS parsers read the text, and `linkedin.com/in/x`
 * stays just as matchable as the full URL.
 */
export function formatContactLink(url: string): string {
  const withoutProtocol = url.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");
  const withoutWww = withoutProtocol.replace(/^www\./i, "");
  const withoutTrailingSlash = withoutWww.replace(/\/+$/, "");
  return withoutTrailingSlash || url;
}
