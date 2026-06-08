import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

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

/**
 * Move `targetKey` to the ordered slot currently occupied by `anchorKey`.
 *
 * `order` is a single global index space spanning summary plus every collection
 * section, visible or hidden. Callers express intent by *which sibling to land
 * next to* — never a raw index — so the result is correct no matter which
 * sections are hidden, and there is no second index space to keep in sync. Both
 * the drag-and-drop sidebar (anchor = the section dropped onto) and the canvas
 * up/down buttons (anchor = the adjacent visible sibling) reduce to this.
 */
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

  // Re-find the anchor after removal, then insert on the side that matches the
  // travel direction: dragging down lands after the anchor, dragging up lands
  // before it — standard list-reorder behavior.
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

  // Park the toggled section at the visible/hidden boundary: it becomes the
  // last visible section when shown, or the first hidden section when hidden.
  // This keeps hidden sections clustered at the tail, so visible sections stay
  // a contiguous band.
  const nextEntries = [...includedEntries, nextTargetEntry, ...availableEntries];

  return normalizeSectionOrder(sections, nextEntries);
}
