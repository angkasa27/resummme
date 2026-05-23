import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";

import { awardsDescriptor } from "./awards";
import { certificationsDescriptor } from "./certifications";
import { educationDescriptor } from "./education";
import { languagesDescriptor } from "./languages";
import { organizationVolunteeringDescriptor } from "./organization-volunteering";
import { projectsDescriptor } from "./projects";
import { publicationsDescriptor } from "./publications";
import { referencesDescriptor } from "./references";
import { skillsDescriptor } from "./skills";
import { workExperienceDescriptor } from "./work-experience";
import type { SectionDescriptor } from "./types";

export const sectionDescriptors = {
  workExperience: workExperienceDescriptor,
  skills: skillsDescriptor,
  projects: projectsDescriptor,
  education: educationDescriptor,
  publications: publicationsDescriptor,
  certifications: certificationsDescriptor,
  awards: awardsDescriptor,
  languages: languagesDescriptor,
  references: referencesDescriptor,
  organizationVolunteering: organizationVolunteeringDescriptor,
} as const satisfies {
  [K in CollectionSectionKey]: SectionDescriptor<K>;
};

export type { SectionDescriptor };

export function getDescriptor<K extends CollectionSectionKey>(
  key: K,
): SectionDescriptor<K> {
  return sectionDescriptors[key] as unknown as SectionDescriptor<K>;
}
