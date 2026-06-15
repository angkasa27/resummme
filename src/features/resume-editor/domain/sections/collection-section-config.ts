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

export type ItemFieldConfig =
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
      optional?: boolean;
    }
  | {
      kind: "stringArray";
      name: string;
      label: string;
      placeholder?: string;
      optional?: boolean;
    }
  | {
      kind: "dateRange";
      startName: string;
      endName: string;
      label: string;
      startPlaceholder?: string;
      endPlaceholder?: string;
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
  itemTitle: string;
  emptyTitle: string;
  emptyDescription: string;
  createItem: () => TItem;
  fields: ItemFieldConfig[];
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
    fields: [
      {
        kind: "text",
        name: "companyName",
        label: "Company name",
        placeholder: "PT Example Indonesia",
      },
      {
        kind: "text",
        name: "position",
        label: "Position",
        placeholder: "Senior Frontend Engineer",
      },
      {
        kind: "text",
        name: "location",
        label: "Location",
        placeholder: "Jakarta, Indonesia",
      },
      {
        kind: "dateRange",
        startName: "startDate",
        endName: "endDate",
        label: "Date range",
        startPlaceholder: "Jan 2022",
        endPlaceholder: "Mar 2024",
      },
      {
        kind: "richText",
        name: "description",
        label: "Description",
        placeholder: "Summarize scope, ownership, and measurable impact.",
      },
    ],
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
    fields: [
      {
        kind: "text",
        name: "categoryName",
        label: "Category name",
        placeholder: "Frontend Engineering",
      },
      {
        kind: "stringArray",
        name: "skills",
        label: "Skills",
        placeholder: "React, Next.js, TypeScript",
      },
    ],
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
    fields: [
      {
        kind: "text",
        name: "projectName",
        label: "Project name",
        placeholder: "Internal Design System",
      },
      {
        kind: "url",
        name: "projectLink",
        label: "Project link",
        placeholder: "https://example.com/project",
        optional: true,
      },
      {
        kind: "dateRange",
        startName: "startDate",
        endName: "endDate",
        label: "Date range",
        startPlaceholder: "Feb 2024",
        endPlaceholder: "Current",
      },
      {
        kind: "richText",
        name: "description",
        label: "Description",
        placeholder: "Describe the problem, your role, and the outcome.",
      },
    ],
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
    fields: [
      {
        kind: "text",
        name: "name",
        label: "Institution name",
        placeholder: "Universitas Indonesia",
      },
      {
        kind: "text",
        name: "location",
        label: "Location",
        placeholder: "Depok, Indonesia",
      },
      {
        kind: "dateRange",
        startName: "startDate",
        endName: "endDate",
        label: "Date range",
        startPlaceholder: "Aug 2018",
        endPlaceholder: "Jun 2022",
      },
      {
        kind: "text",
        name: "degree",
        label: "Degree / major",
        placeholder: "B.Sc. in Computer Science",
      },
      {
        kind: "text",
        name: "gpa",
        label: "GPA",
        placeholder: "3.78 / 4.00",
        optional: true,
      },
      {
        kind: "richText",
        name: "description",
        label: "Description",
        placeholder: "Add honors, thesis topic, or relevant coursework.",
      },
    ],
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
    fields: [
      {
        kind: "text",
        name: "title",
        label: "Title",
        placeholder: "Designing Maintainable Frontend Platforms",
      },
      {
        kind: "text",
        name: "publisher",
        label: "Publisher",
        placeholder: "Medium, IEEE, or conference name",
      },
      {
        kind: "url",
        name: "publicationUrl",
        label: "Publication URL",
        placeholder: "https://example.com/publication",
        optional: true,
      },
      {
        kind: "monthYear",
        name: "publicationDate",
        label: "Publication date",
        placeholder: "Apr 2025",
      },
      {
        kind: "richText",
        name: "description",
        label: "Description",
        placeholder: "Explain the topic and why it matters.",
      },
    ],
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
    fields: [
      {
        kind: "text",
        name: "certificationName",
        label: "Certification name",
        placeholder: "AWS Certified Developer - Associate",
      },
      {
        kind: "text",
        name: "issuingOrganization",
        label: "Issuing organization",
        placeholder: "Amazon Web Services",
      },
      {
        kind: "monthYear",
        name: "issuedDate",
        label: "Issued date",
        placeholder: "Jan 2025",
      },
      {
        kind: "url",
        name: "certificationLink",
        label: "Certification link",
        placeholder: "https://example.com/certification",
        optional: true,
      },
      {
        kind: "text",
        name: "credentialId",
        label: "Credential ID",
        placeholder: "ABC-123-XYZ",
        optional: true,
      },
    ],
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
    fields: [
      {
        kind: "text",
        name: "title",
        label: "Title",
        placeholder: "Best Innovation Award",
      },
      {
        kind: "text",
        name: "issuer",
        label: "Issuer",
        placeholder: "Tech Conference Asia",
      },
      {
        kind: "monthYear",
        name: "issuedDate",
        label: "Issued date",
        placeholder: "Nov 2024",
      },
      {
        kind: "richText",
        name: "description",
        label: "Description",
        placeholder: "State the achievement and selection context.",
      },
    ],
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
    fields: [
      {
        kind: "text",
        name: "language",
        label: "Language",
        placeholder: "English",
      },
      { kind: "proficiency", name: "proficiency", label: "Proficiency" },
    ],
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
    fields: [
      { kind: "text", name: "name", label: "Name" },
      {
        kind: "textarea",
        name: "background",
        label: "Background",
        placeholder: "Engineering Manager at Example Corp",
      },
      {
        kind: "textarea",
        name: "contactDetails",
        label: "Contact details",
        placeholder: "name@example.com | +62 812-3456-7890",
      },
    ],
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
    fields: [
      {
        kind: "text",
        name: "organizationName",
        label: "Organization name",
        placeholder: "Frontend Jakarta Community",
      },
      {
        kind: "text",
        name: "position",
        label: "Position",
        placeholder: "Volunteer Mentor",
      },
      {
        kind: "text",
        name: "location",
        label: "Location",
        placeholder: "Jakarta, Indonesia",
      },
      {
        kind: "dateRange",
        startName: "startDate",
        endName: "endDate",
        label: "Date range",
        startPlaceholder: "Jan 2024",
        endPlaceholder: "Current",
      },
      {
        kind: "richText",
        name: "description",
        label: "Description",
        placeholder: "Describe the responsibility, audience, and contribution.",
      },
    ],
  },
};

export type CollectionSectionConfigMap = typeof collectionSectionConfigs;
