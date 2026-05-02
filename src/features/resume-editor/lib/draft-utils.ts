import type { ResumeDraft } from "@/lib/resume/schema";

type ResumeSectionKey = keyof ResumeDraft["sections"];

export function cloneDraft<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function getOrderedSectionEntries(sections: ResumeDraft["sections"]) {
  return Object.entries(sections).sort(
    (left, right) => left[1].order - right[1].order
  ) as Array<[ResumeSectionKey, ResumeDraft["sections"][ResumeSectionKey]]>;
}

function normalizeSectionOrder(
  sections: ResumeDraft["sections"],
  orderedEntries: Array<[ResumeSectionKey, ResumeDraft["sections"][ResumeSectionKey]]>
) {
  const nextSections = cloneDraft(sections);
  const mutableSections = nextSections as Record<
    ResumeSectionKey,
    ResumeDraft["sections"][ResumeSectionKey]
  >;

  orderedEntries.forEach(([sectionKey, sectionValue], index) => {
    mutableSections[sectionKey] = {
      ...sectionValue,
      order: index,
    } as ResumeDraft["sections"][ResumeSectionKey];
  });

  return nextSections;
}

export function reorderSections(
  sections: ResumeDraft["sections"],
  targetKey: ResumeSectionKey,
  nextSectionValue: ResumeDraft["sections"][ResumeSectionKey]
) {
  const orderedEntries = getOrderedSectionEntries(sections);
  const boundedIndex = Math.max(
    0,
    Math.min(nextSectionValue.order, orderedEntries.length - 1)
  );
  const nextEntries = orderedEntries.filter(([sectionKey]) => sectionKey !== targetKey);
  nextEntries.splice(boundedIndex, 0, [targetKey, nextSectionValue]);

  return normalizeSectionOrder(sections, nextEntries);
}

export function moveSection(
  sections: ResumeDraft["sections"],
  targetKey: ResumeSectionKey,
  direction: -1 | 1
) {
  const orderedEntries = getOrderedSectionEntries(sections);
  const currentIndex = orderedEntries.findIndex(([sectionKey]) => sectionKey === targetKey);

  if (currentIndex < 0) {
    return sections;
  }

  const nextIndex = Math.max(
    0,
    Math.min(currentIndex + direction, orderedEntries.length - 1)
  );

  if (currentIndex === nextIndex) {
    return sections;
  }

  const nextEntries = [...orderedEntries];
  const [movedEntry] = nextEntries.splice(currentIndex, 1);
  nextEntries.splice(nextIndex, 0, movedEntry);

  return normalizeSectionOrder(sections, nextEntries);
}

export function nextOrderValue(
  currentOrder: number,
  direction: -1 | 1,
  maxOrder: number
) {
  return Math.max(0, Math.min(currentOrder + direction, maxOrder));
}
