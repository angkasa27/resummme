import type {
  AwardItem,
  CertificationItem,
  EducationItem,
  LanguageItem,
  OrganizationItem,
  ProjectItem,
  PublicationItem,
  ReferenceItem,
  SkillCategoryItem,
  WorkExperienceItem,
} from "@/features/resume-editor/domain/schema";
import { createLocalId } from "@/features/resume-editor/domain/create-local-id";
import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";

type CollectionSectionConfig<TItem> = {
  key: CollectionSectionKey;
  title: string;
  description: string;
  addLabel: string;
  itemTitle: string;
  emptyTitle: string;
  emptyDescription: string;
  createItem: () => TItem;
  /** Set only on sections whose items carry a date range, for auto-sort and
   * the header's "sort" action — the field components themselves render the
   * range unconditionally via `MonthYearRangeField`. */
  dateRange?: { startName: string; endName: string };
};

export const collectionSectionConfigs: Record<
  CollectionSectionKey,
  CollectionSectionConfig<
    | WorkExperienceItem
    | SkillCategoryItem
    | ProjectItem
    | EducationItem
    | PublicationItem
    | CertificationItem
    | AwardItem
    | LanguageItem
    | ReferenceItem
    | OrganizationItem
  >
> = {
  workExperience: {
    key: "workExperience",
    title: "Work Experience",
    description: "Roles, date ranges, and impact bullets for each company.",
    addLabel: "Add experience",
    itemTitle: "Experience",
    emptyTitle: "No work experience yet",
    emptyDescription: "Add at least one role to show your recent experience.",
    createItem: () => ({
      id: createLocalId("work-experience"),
      companyName: "",
      position: "",
      location: "",
      startDate: "Jan 2024",
      endDate: "current",
      description: "<p></p>",
    }),
    dateRange: { startName: "startDate", endName: "endDate" },
  },
  skills: {
    key: "skills",
    title: "Skills",
    description: "Group skills into categories for a cleaner recruiter view.",
    addLabel: "Add skill category",
    itemTitle: "Skill category",
    emptyTitle: "No skill categories yet",
    emptyDescription: "Add categories such as Frontend, Backend, or Tools.",
    createItem: () => ({
      id: createLocalId("skill-category"),
      categoryName: "",
      skills: [],
    }),
  },
  projects: {
    key: "projects",
    title: "Projects",
    description: "Highlight selected projects with links and concise outcomes.",
    addLabel: "Add project",
    itemTitle: "Project",
    emptyTitle: "No projects yet",
    emptyDescription:
      "Add flagship or relevant projects to support your experience.",
    createItem: () => ({
      id: createLocalId("project"),
      projectName: "",
      projectLink: "",
      startDate: "Jan 2024",
      endDate: "current",
      description: "<p></p>",
    }),
    dateRange: { startName: "startDate", endName: "endDate" },
  },
  education: {
    key: "education",
    title: "Education",
    description: "Degrees, institutions, and academic context.",
    addLabel: "Add education",
    itemTitle: "Education",
    emptyTitle: "No education entries yet",
    emptyDescription: "Add your school, degree, and relevant context.",
    createItem: () => ({
      id: createLocalId("education"),
      name: "",
      location: "",
      startDate: "Jan 2020",
      endDate: "Jan 2024",
      degree: "",
      gpa: "",
      description: "<p></p>",
    }),
    dateRange: { startName: "startDate", endName: "endDate" },
  },
  publications: {
    key: "publications",
    title: "Publications",
    description: "Talks, papers, blogs, or research outputs worth featuring.",
    addLabel: "Add publication",
    itemTitle: "Publication",
    emptyTitle: "No publications yet",
    emptyDescription: "Add published work when it strengthens your profile.",
    createItem: () => ({
      id: createLocalId("publication"),
      title: "",
      publisher: "",
      publicationUrl: "",
      publicationDate: "Jan 2024",
      description: "<p></p>",
    }),
  },
  certifications: {
    key: "certifications",
    title: "Certifications",
    description:
      "Professional certifications with issuing organization and references.",
    addLabel: "Add certification",
    itemTitle: "Certification",
    emptyTitle: "No certifications yet",
    emptyDescription: "Add certifications only when they help the target role.",
    createItem: () => ({
      id: createLocalId("certification"),
      certificationName: "",
      issuingOrganization: "",
      issuedDate: "Jan 2024",
      certificationLink: "",
      credentialId: "",
    }),
  },
  awards: {
    key: "awards",
    title: "Awards",
    description: "Recognition, prizes, and awards with short context.",
    addLabel: "Add award",
    itemTitle: "Award",
    emptyTitle: "No awards yet",
    emptyDescription: "Add awards only if they materially strengthen the CV.",
    createItem: () => ({
      id: createLocalId("award"),
      title: "",
      issuer: "",
      issuedDate: "Jan 2024",
      description: "<p></p>",
    }),
  },
  languages: {
    key: "languages",
    title: "Languages",
    description: "List languages with a clear proficiency level.",
    addLabel: "Add language",
    itemTitle: "Language",
    emptyTitle: "No languages yet",
    emptyDescription: "Add spoken or written languages relevant to the role.",
    createItem: () => ({
      id: createLocalId("language"),
      language: "",
      proficiency: "Professional working proficiency",
    }),
  },
  references: {
    key: "references",
    title: "References",
    description: "Contactable references for roles that still require them.",
    addLabel: "Add reference",
    itemTitle: "Reference",
    emptyTitle: "No references yet",
    emptyDescription:
      "Add references only when you want them printed on the CV.",
    createItem: () => ({
      id: createLocalId("reference"),
      name: "",
      background: "",
      contactDetails: "",
    }),
  },
  organizationVolunteering: {
    key: "organizationVolunteering",
    title: "Organizational & Volunteering",
    description:
      "Community, leadership, or volunteering work outside paid roles.",
    addLabel: "Add organization experience",
    itemTitle: "Organization experience",
    emptyTitle: "No organizational entries yet",
    emptyDescription:
      "Add organizational or volunteering work when it supports your story.",
    createItem: () => ({
      id: createLocalId("organization"),
      organizationName: "",
      position: "",
      location: "",
      startDate: "Jan 2024",
      endDate: "current",
      description: "<p></p>",
    }),
    dateRange: { startName: "startDate", endName: "endDate" },
  },
};

export type CollectionSectionConfigMap = typeof collectionSectionConfigs;
