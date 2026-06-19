import { format, isValid, parse, startOfMonth } from "date-fns";

const MONTH_YEAR_FORMAT = "MMM yyyy";

export function parseMonthYear(value?: string | null) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  const parsedDate = parse(value, MONTH_YEAR_FORMAT, new Date());

  if (!isValid(parsedDate)) {
    return undefined;
  }

  return startOfMonth(parsedDate);
}

export function formatMonthYear(value: Date) {
  return format(startOfMonth(value), MONTH_YEAR_FORMAT);
}
