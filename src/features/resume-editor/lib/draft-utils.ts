import type { ResumeDraft } from "@/lib/resume/schema";

type ResumeSectionKey = keyof ResumeDraft["sections"];

export function cloneDraft<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function reorderSections(
  sections: ResumeDraft["sections"],
  targetKey: ResumeSectionKey,
  nextSectionValue: ResumeDraft["sections"][ResumeSectionKey]
) {
  const orderedEntries = Object.entries(sections).sort(
    (left, right) => left[1].order - right[1].order
  ) as Array<[ResumeSectionKey, ResumeDraft["sections"][ResumeSectionKey]]>;
  const boundedIndex = Math.max(
    0,
    Math.min(nextSectionValue.order, orderedEntries.length - 1)
  );
  const nextEntries = orderedEntries.filter(([sectionKey]) => sectionKey !== targetKey);
  nextEntries.splice(boundedIndex, 0, [targetKey, nextSectionValue]);

  const nextSections = cloneDraft(sections);
  const mutableSections = nextSections as Record<
    ResumeSectionKey,
    ResumeDraft["sections"][ResumeSectionKey]
  >;

  nextEntries.forEach(([sectionKey, sectionValue], index) => {
    mutableSections[sectionKey] = {
      ...sectionValue,
      order: index,
    } as ResumeDraft["sections"][ResumeSectionKey];
  });

  return nextSections;
}

export function nextOrderValue(
  currentOrder: number,
  direction: -1 | 1,
  maxOrder: number
) {
  return Math.max(0, Math.min(currentOrder + direction, maxOrder));
}
