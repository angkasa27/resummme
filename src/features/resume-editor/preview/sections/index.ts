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
} as const;
