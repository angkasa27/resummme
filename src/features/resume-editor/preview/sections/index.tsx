import type { ReactNode } from "react";

import type {
  CollectionSectionKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type {
  AnyPreviewRenderableSection,
  PreviewRenderableSection,
} from "@/features/resume-editor/preview/types";

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
import type { SectionDescriptor, SectionItem } from "./types";

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

export type { SectionDescriptor, SectionItem };

export function getDescriptor<K extends CollectionSectionKey>(
  key: K,
): SectionDescriptor<K> {
  return sectionDescriptors[key] as unknown as SectionDescriptor<K>;
}

export function renderSectionBody<K extends CollectionSectionKey>(
  section: PreviewRenderableSection<K>,
): ReactNode {
  const descriptor = getDescriptor(section.key);
  return (
    <div className="item-list">
      {section.items.map((item) => (
        <descriptor.ItemView
          key={(item as { id: string }).id}
          item={item as SectionItem<K>}
        />
      ))}
    </div>
  );
}

export function renderSection(
  section: AnyPreviewRenderableSection,
): ReactNode {
  return (
    <section className="section" data-section={section.key}>
      <h2 className="section-heading" data-testid="resume-preview-section-heading">
        {section.heading}
      </h2>
      {renderSectionBody(section)}
    </section>
  );
}
