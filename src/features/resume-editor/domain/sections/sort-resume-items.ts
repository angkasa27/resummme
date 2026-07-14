import { parseMonthYear } from "@/features/resume-editor/domain/month-year";

function dateValue(value: string | undefined): number {
  return parseMonthYear(value)?.getTime() ?? 0;
}

/** -1/1 when exactly one side is "current" (current sorts first), null when
 *  both sides agree (both current or both not) — defer to the next rule. */
function compareByCurrentStatus(
  aEnd: string | undefined,
  bEnd: string | undefined,
): number | null {
  const aIsCurrent = aEnd === "current";
  const bIsCurrent = bEnd === "current";

  if (aIsCurrent && !bIsCurrent) return -1;
  if (!aIsCurrent && bIsCurrent) return 1;
  return null;
}

function compareResumeItems<T extends Record<string, unknown>>(
  a: T,
  b: T,
  startFieldName: string,
  endFieldName: string,
): number {
  const aEnd = a[endFieldName] as string | undefined;
  const bEnd = b[endFieldName] as string | undefined;
  const aStart = a[startFieldName] as string | undefined;
  const bStart = b[startFieldName] as string | undefined;

  const byCurrentStatus = compareByCurrentStatus(aEnd, bEnd);
  if (byCurrentStatus !== null) return byCurrentStatus;

  // Both current: sort by start date (descending).
  if (aEnd === "current" && bEnd === "current") {
    return dateValue(bStart) - dateValue(aStart);
  }

  // Neither current: sort by end date (descending), then start (descending).
  const byEndDate = dateValue(bEnd) - dateValue(aEnd);
  if (byEndDate !== 0) return byEndDate;
  return dateValue(bStart) - dateValue(aStart);
}

export function sortResumeItems<T extends Record<string, unknown>>(
  items: T[],
  startFieldName: string = "startDate",
  endFieldName: string = "endDate",
): T[] {
  return [...items].sort((a, b) =>
    compareResumeItems(a, b, startFieldName, endFieldName),
  );
}
