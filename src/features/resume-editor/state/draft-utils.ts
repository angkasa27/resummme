import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type ResumeSectionKey = keyof ResumeDraft["sections"];

export function getOrderedSectionEntries(sections: ResumeDraft["sections"]) {
  return Object.entries(sections).sort(
    (left, right) => left[1].order - right[1].order
  ) as Array<[ResumeSectionKey, ResumeDraft["sections"][ResumeSectionKey]]>;
}

function normalizeSectionOrder(
  sections: ResumeDraft["sections"],
  orderedEntries: Array<[ResumeSectionKey, ResumeDraft["sections"][ResumeSectionKey]]>
) {
  const nextSections = { ...sections };
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

/** Move `targetKey` to the slot `anchorKey` occupies — sibling intent, never a
 * raw index, so hidden sections can't break it. Drag and up/down both reduce to it. */
export function moveSectionToAnchor(
  sections: ResumeDraft["sections"],
  targetKey: ResumeSectionKey,
  anchorKey: ResumeSectionKey
) {
  if (targetKey === anchorKey) {
    return sections;
  }

  const orderedEntries = getOrderedSectionEntries(sections);
  const fromIndex = orderedEntries.findIndex(([sectionKey]) => sectionKey === targetKey);
  const anchorIndex = orderedEntries.findIndex(([sectionKey]) => sectionKey === anchorKey);

  if (fromIndex < 0 || anchorIndex < 0) {
    return sections;
  }

  const nextEntries = [...orderedEntries];
  const [movedEntry] = nextEntries.splice(fromIndex, 1);

  // Re-find the anchor after removal, then insert after it when moving down, before when up.
  const anchorAfterRemoval = nextEntries.findIndex(
    ([sectionKey]) => sectionKey === anchorKey
  );
  const insertIndex =
    fromIndex < anchorIndex ? anchorAfterRemoval + 1 : anchorAfterRemoval;

  nextEntries.splice(insertIndex, 0, movedEntry);

  return normalizeSectionOrder(sections, nextEntries);
}

export function setSectionVisibilityWithOrder(
  sections: ResumeDraft["sections"],
  targetKey: ResumeSectionKey,
  visible: boolean
) {
  const orderedEntries = getOrderedSectionEntries(sections);
  const targetEntry = orderedEntries.find(([sectionKey]) => sectionKey === targetKey);

  if (!targetEntry) {
    return sections;
  }

  const nextTargetEntry: typeof targetEntry = [
    targetEntry[0],
    {
      ...targetEntry[1],
      visible,
    } as ResumeDraft["sections"][ResumeSectionKey],
  ];
  const remainingEntries = orderedEntries.filter(
    ([sectionKey]) => sectionKey !== targetKey
  );
  const includedEntries = remainingEntries.filter(
    ([, sectionValue]) => sectionValue.visible
  );
  const availableEntries = remainingEntries.filter(
    ([, sectionValue]) => !sectionValue.visible
  );

  // Park at the visible/hidden boundary so hidden sections stay a contiguous tail band.
  const nextEntries = [...includedEntries, nextTargetEntry, ...availableEntries];

  return normalizeSectionOrder(sections, nextEntries);
}
