import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

export const editablePanelKeys = [
  "profile",
  "summary",
  "workExperience",
  "skills",
  "projects",
  "education",
  "publications",
  "certifications",
  "awards",
  "languages",
  "references",
  "organizationVolunteering",
] as const;

export type EditorPanelKey = (typeof editablePanelKeys)[number];
export const resumeSectionKeys = editablePanelKeys.filter(
  (panelKey) => panelKey !== "profile"
) as Exclude<EditorPanelKey, "profile">[];
export type ResumeSectionPanelKey = (typeof resumeSectionKeys)[number];

export const collectionSectionKeys = [
  "workExperience",
  "skills",
  "projects",
  "education",
  "publications",
  "certifications",
  "awards",
  "languages",
  "references",
  "organizationVolunteering",
] as const;

export type CollectionSectionKey = (typeof collectionSectionKeys)[number];

export const sectionLabels: Record<
  Exclude<EditorPanelKey, "profile">,
  string
> = {
  summary: "Summary",
  workExperience: "Work Experience",
  skills: "Skills",
  projects: "Projects",
  education: "Education",
  publications: "Publications",
  certifications: "Certifications",
  awards: "Awards",
  languages: "Languages",
  references: "References",
  organizationVolunteering: "Organizational & Volunteering",
};

export const languageProficiencyOptions = [
  "Elementary proficiency",
  "Limited working proficiency",
  "Professional working proficiency",
  "Full professional proficiency",
  "Native or bilingual proficiency",
];

export function isCollectionSectionKey(
  sectionKey: ResumeSectionPanelKey
): sectionKey is CollectionSectionKey {
  return collectionSectionKeys.includes(sectionKey as CollectionSectionKey);
}

export function getOrderedSectionKeys(sections: ResumeDraft["sections"]) {
  return [...resumeSectionKeys]
    .sort((left, right) => sections[left].order - sections[right].order);
}

export function getOrderedVisibleSectionKeys(sections: ResumeDraft["sections"]) {
  return getOrderedSectionKeys(sections).filter((sectionKey) => sections[sectionKey].visible);
}
