export function renderCurrentDateLabel(value: string) {
  return value === "current" ? "Current" : value;
}

export function renderDateRange(
  startDate?: string,
  endDate?: string,
  fallback = "",
) {
  if (startDate || endDate) {
    const start = startDate || "";
    const end = renderCurrentDateLabel(endDate || "");
    const separator = start && end ? " - " : "";
    return `${start}${separator}${end}`.trim();
  }

  return fallback;
}