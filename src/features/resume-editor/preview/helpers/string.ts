export function joinParts(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" · ");
}

export function compactJoin(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function commaJoin(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(", ");
}