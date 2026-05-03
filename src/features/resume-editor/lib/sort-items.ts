import { parseMonthYear } from "@/features/resume-editor/lib/month-year";

export function sortResumeItems<T extends Record<string, unknown>>(
  items: T[],
  startFieldName: string = "startDate",
  endFieldName: string = "endDate",
): T[] {
  return [...items].sort((a, b) => {
    const aEnd = a[endFieldName] as string | undefined;
    const bEnd = b[endFieldName] as string | undefined;
    const aStart = a[startFieldName] as string | undefined;
    const bStart = b[startFieldName] as string | undefined;

    // 1. Current status first
    const aIsCurrent = aEnd === "current";
    const bIsCurrent = bEnd === "current";

    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;

    // 2. Both are current or both are not current
    // If both are current, sort by start date (descending)
    if (aIsCurrent && bIsCurrent) {
      const aStartValue = parseMonthYear(aStart)?.getTime() ?? 0;
      const bStartValue = parseMonthYear(bStart)?.getTime() ?? 0;
      return bStartValue - aStartValue;
    }

    // 3. Both have end dates, sort by end date (descending)
    const aEndValue = parseMonthYear(aEnd)?.getTime() ?? 0;
    const bEndValue = parseMonthYear(bEnd)?.getTime() ?? 0;

    if (aEndValue !== bEndValue) {
      return bEndValue - aEndValue;
    }

    // 4. End dates are equal, sort by start date (descending)
    const aStartValueInner = parseMonthYear(aStart)?.getTime() ?? 0;
    const bStartValueInner = parseMonthYear(bStart)?.getTime() ?? 0;
    return bStartValueInner - aStartValueInner;
  });
}
