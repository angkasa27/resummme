export function normalizeCollectionItem<T extends Record<string, unknown>>(
  item: T,
  template: T,
): T {
  const nextItem = { ...template, ...item } as Record<string, unknown>;

  Object.keys(nextItem).forEach((key) => {
    const templateValue = template[key];
    const currentValue = nextItem[key];

    if (typeof templateValue === "string" && typeof currentValue !== "string") {
      nextItem[key] = "";
    }

    if (Array.isArray(templateValue) && !Array.isArray(currentValue)) {
      nextItem[key] = [];
    }
  });

  return nextItem as T;
}
