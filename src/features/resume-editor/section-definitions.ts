import type {
  AwardItem,
  CertificationItem,
  EducationItem,
  LanguageItem,
  OrganizationItem,
  ProjectItem,
  PublicationItem,
  ReferenceItem,
  ResumeDraft,
  SkillCategoryItem,
  WorkExperienceItem,
} from "@/lib/resume/schema";

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

type ItemFieldConfig =
  | {
      kind: "text" | "email" | "url" | "monthYear";
      name: string;
      label: string;
      placeholder?: string;
      optional?: boolean;
    }
  | {
      kind: "textarea" | "richText";
      name: string;
      label: string;
      placeholder?: string;
    }
  | {
      kind: "stringArray";
      name: string;
      label: string;
      placeholder?: string;
    }
  | {
      kind: "dateRange";
      startName: string;
      endName: string;
      label: string;
    }
  | {
      kind: "proficiency";
      name: string;
      label: string;
    };

type CollectionSectionConfig<TItem> = {
  key: CollectionSectionKey;
  title: string;
  description: string;
  addLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  createItem: () => TItem;
  fields: ItemFieldConfig[];
};

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const sectionLabels: Record<Exclude<EditorPanelKey, "profile">, string> = {
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
    emptyTitle: "No work experience yet",
    emptyDescription: "Add at least one role to show your recent experience.",
    createItem: () => ({
      id: createId("work-experience"),
      companyName: "",
      position: "",
      location: "",
      startDate: "Jan 2024",
      endDate: "current",
      description: "<p></p>",
    }),
    fields: [
      { kind: "text", name: "companyName", label: "Company name" },
      { kind: "text", name: "position", label: "Position" },
      { kind: "text", name: "location", label: "Location" },
      { kind: "dateRange", startName: "startDate", endName: "endDate", label: "Date range" },
      { kind: "richText", name: "description", label: "Description" },
    ],
  },
  skills: {
    key: "skills",
    title: "Skills",
    description: "Group skills into categories for a cleaner recruiter view.",
    addLabel: "Add skill category",
    emptyTitle: "No skill categories yet",
    emptyDescription: "Add categories such as Frontend, Backend, or Tools.",
    createItem: () => ({
      id: createId("skill-category"),
      categoryName: "",
      skills: [],
    }),
    fields: [
      { kind: "text", name: "categoryName", label: "Category name" },
      { kind: "stringArray", name: "skills", label: "Skills", placeholder: "React, Next.js, TypeScript" },
    ],
  },
  projects: {
    key: "projects",
    title: "Projects",
    description: "Highlight selected projects with links and concise outcomes.",
    addLabel: "Add project",
    emptyTitle: "No projects yet",
    emptyDescription: "Add flagship or relevant projects to support your experience.",
    createItem: () => ({
      id: createId("project"),
      projectName: "",
      projectLink: "",
      startDate: "Jan 2024",
      endDate: "current",
      description: "<p></p>",
    }),
    fields: [
      { kind: "text", name: "projectName", label: "Project name" },
      { kind: "url", name: "projectLink", label: "Project link", optional: true },
      { kind: "dateRange", startName: "startDate", endName: "endDate", label: "Date range" },
      { kind: "richText", name: "description", label: "Description" },
    ],
  },
  education: {
    key: "education",
    title: "Education",
    description: "Degrees, institutions, and academic context.",
    addLabel: "Add education",
    emptyTitle: "No education entries yet",
    emptyDescription: "Add your school, degree, and relevant context.",
    createItem: () => ({
      id: createId("education"),
      name: "",
      location: "",
      startDate: "Jan 2020",
      endDate: "Jan 2024",
      degree: "",
      gpa: "",
      description: "<p></p>",
    }),
    fields: [
      { kind: "text", name: "name", label: "Institution name" },
      { kind: "text", name: "location", label: "Location" },
      { kind: "dateRange", startName: "startDate", endName: "endDate", label: "Date range" },
      { kind: "text", name: "degree", label: "Degree / major" },
      { kind: "text", name: "gpa", label: "GPA", optional: true },
      { kind: "richText", name: "description", label: "Description" },
    ],
  },
  publications: {
    key: "publications",
    title: "Publications",
    description: "Talks, papers, blogs, or research outputs worth featuring.",
    addLabel: "Add publication",
    emptyTitle: "No publications yet",
    emptyDescription: "Add published work when it strengthens your profile.",
    createItem: () => ({
      id: createId("publication"),
      title: "",
      publisher: "",
      publicationUrl: "",
      publicationDate: "Jan 2024",
      description: "<p></p>",
    }),
    fields: [
      { kind: "text", name: "title", label: "Title" },
      { kind: "text", name: "publisher", label: "Publisher" },
      { kind: "url", name: "publicationUrl", label: "Publication URL", optional: true },
      { kind: "monthYear", name: "publicationDate", label: "Publication date" },
      { kind: "richText", name: "description", label: "Description" },
    ],
  },
  certifications: {
    key: "certifications",
    title: "Certifications",
    description: "Professional certifications with issuing organization and references.",
    addLabel: "Add certification",
    emptyTitle: "No certifications yet",
    emptyDescription: "Add certifications only when they help the target role.",
    createItem: () => ({
      id: createId("certification"),
      certificationName: "",
      issuingOrganization: "",
      issuedDate: "Jan 2024",
      certificationLink: "",
      credentialId: "",
    }),
    fields: [
      { kind: "text", name: "certificationName", label: "Certification name" },
      { kind: "text", name: "issuingOrganization", label: "Issuing organization" },
      { kind: "monthYear", name: "issuedDate", label: "Issued date" },
      { kind: "url", name: "certificationLink", label: "Certification link", optional: true },
      { kind: "text", name: "credentialId", label: "Credential ID", optional: true },
    ],
  },
  awards: {
    key: "awards",
    title: "Awards",
    description: "Recognition, prizes, and awards with short context.",
    addLabel: "Add award",
    emptyTitle: "No awards yet",
    emptyDescription: "Add awards only if they materially strengthen the CV.",
    createItem: () => ({
      id: createId("award"),
      title: "",
      issuer: "",
      issuedDate: "Jan 2024",
      description: "<p></p>",
    }),
    fields: [
      { kind: "text", name: "title", label: "Title" },
      { kind: "text", name: "issuer", label: "Issuer" },
      { kind: "monthYear", name: "issuedDate", label: "Issued date" },
      { kind: "richText", name: "description", label: "Description" },
    ],
  },
  languages: {
    key: "languages",
    title: "Languages",
    description: "List languages with a clear proficiency level.",
    addLabel: "Add language",
    emptyTitle: "No languages yet",
    emptyDescription: "Add spoken or written languages relevant to the role.",
    createItem: () => ({
      id: createId("language"),
      language: "",
      proficiency: "Professional working proficiency",
    }),
    fields: [
      { kind: "text", name: "language", label: "Language" },
      { kind: "proficiency", name: "proficiency", label: "Proficiency" },
    ],
  },
  references: {
    key: "references",
    title: "References",
    description: "Contactable references for roles that still require them.",
    addLabel: "Add reference",
    emptyTitle: "No references yet",
    emptyDescription: "Add references only when you want them printed on the CV.",
    createItem: () => ({
      id: createId("reference"),
      name: "",
      background: "",
      contactDetails: "",
    }),
    fields: [
      { kind: "text", name: "name", label: "Name" },
      { kind: "textarea", name: "background", label: "Background", placeholder: "Engineering Manager at..." },
      { kind: "textarea", name: "contactDetails", label: "Contact details", placeholder: "email@example.com | +62..." },
    ],
  },
  organizationVolunteering: {
    key: "organizationVolunteering",
    title: "Organizational & Volunteering",
    description: "Community, leadership, or volunteering work outside paid roles.",
    addLabel: "Add organization experience",
    emptyTitle: "No organizational entries yet",
    emptyDescription: "Add organizational or volunteering work when it supports your story.",
    createItem: () => ({
      id: createId("organization"),
      organizationName: "",
      position: "",
      location: "",
      startDate: "Jan 2024",
      endDate: "current",
      description: "<p></p>",
    }),
    fields: [
      { kind: "text", name: "organizationName", label: "Organization name" },
      { kind: "text", name: "position", label: "Position" },
      { kind: "text", name: "location", label: "Location" },
      { kind: "dateRange", startName: "startDate", endName: "endDate", label: "Date range" },
      { kind: "richText", name: "description", label: "Description" },
    ],
  },
};

export const languageProficiencyOptions = [
  "Elementary proficiency",
  "Limited working proficiency",
  "Professional working proficiency",
  "Full professional proficiency",
  "Native or bilingual proficiency",
];

export function getOrderedVisibleSectionKeys(sections: ResumeDraft["sections"]) {
  return collectionSectionKeys
    .filter((sectionKey) => sections[sectionKey].visible)
    .sort((left, right) => sections[left].order - sections[right].order);
}
