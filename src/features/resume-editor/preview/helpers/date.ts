export function renderCurrentDateLabel(value: string) {
  return value === "current" ? "Current" : value;
}

export function renderDateRange(
  startDate?: string,
  endDate?: string,
  fallback = "",
) {
  if (startDate || endDate) {
    return `${startDate || ""}${startDate || endDate ? " - " : ""}${renderCurrentDateLabel(endDate || "")}`.trim();
  }

  return fallback;
}