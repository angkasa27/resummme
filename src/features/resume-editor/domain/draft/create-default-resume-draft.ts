import { createDefaultPdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

function createTimestamp() {
  return new Date().toISOString();
}

function createDefaultWorkExperienceItem() {
  return {
    id: "default-work-experience-1",
    companyName: "Nusantara Digital Studio",
    position: "Senior Frontend Engineer",
    location: "Jakarta, Indonesia",
    startDate: "Feb 2022",
    endDate: "current",
    description:
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere consectetur est at lobortis, aenean eu leo quam, pellentesque ornare sem lacinia quam venenatis vestibulum.</p>",
  };
}

function createDefaultSkillCategoryItem() {
  return {
    id: "default-skill-category-1",
    categoryName: "Frontend Engineering",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Design Systems",
    ],
  };
}

function createDefaultProjectItem() {
  return {
    id: "default-project-1",
    projectName: "Editorial Workflow Platform",
    projectLink: "https://example.com/case-study/editorial-workflow-platform",
    startDate: "May 2023",
    endDate: "Dec 2023",
    description:
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum, posuere erat a ante venenatis dapibus.</p>",
  };
}

function createDefaultEducationItem() {
  return {
    id: "default-education-1",
    name: "Institut Teknologi Bandung",
    location: "Bandung, Indonesia",
    startDate: "Aug 2015",
    endDate: "May 2019",
    degree: "B.S. in Informatics Engineering",
    gpa: "3.78 / 4.00",
    description:
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>",
  };
}

function createDefaultPublicationItem() {
  return {
    id: "default-publication-1",
    title: "Designing Faster Editorial Workflows",
    publisher: "Product Engineering Notes",
    publicationUrl: "https://example.com/writing/editorial-workflows",
    publicationDate: "Aug 2023",
    description:
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.</p>",
  };
}

function createDefaultCertificationItem() {
  return {
    id: "default-certification-1",
    certificationName: "AWS Certified Developer - Associate",
    issuingOrganization: "Amazon Web Services",
    issuedDate: "Nov 2023",
    certificationLink:
      "https://example.com/certificates/aws-developer-associate",
    credentialId: "AWS-DEV-2023-1184",
  };
}

function createDefaultAwardItem() {
  return {
    id: "default-award-1",
    title: "Engineering Excellence Award",
    issuer: "Nusantara Digital Studio",
    issuedDate: "Dec 2023",
    description:
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas faucibus mollis interdum.</p>",
  };
}

function createDefaultLanguageItem() {
  return {
    id: "default-language-1",
    language: "English",
    proficiency: "Professional working proficiency",
  };
}

function createDefaultReferenceItem() {
  return {
    id: "default-reference-1",
    name: "Anindya Putri",
    background: "Engineering Manager, Nusantara Digital Studio",
    contactDetails: "anindya.putri@example.com · +62 812-4455-6677",
  };
}

function createDefaultOrganizationItem() {
  return {
    id: "default-organization-1",
    organizationName: "Jakarta JavaScript Community",
    position: "Volunteer Mentor",
    location: "Jakarta, Indonesia",
    startDate: "Jan 2021",
    endDate: "current",
    description:
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor, nullam id dolor id nibh ultricies vehicula ut id elit.</p>",
  };
}

export function createDefaultResumeDraft(): ResumeDraft {
  return {
    schemaVersion: 2,
    templateId: "recruiter-first-clean",
    updatedAt: createTimestamp(),
    pdfPresentation: createDefaultPdfPresentation(),
    profile: {
      fullName: "Dimas Angkasa",
      location: "Jakarta, Indonesia",
      phone: "+62 812-3344-5566",
      email: "example@mail.com",
      photo: "https://picsum.photos/200",
      extraLinks: [
        {
          id: "profile-link-linkedin",
          url: "https://www.linkedin.com/in",
        },
        {
          id: "profile-link-github",
          url: "https://github.com",
        },
        {
          id: "profile-link-portfolio",
          url: "https://asaa.dev",
        },
      ],
    },
    sections: {
      summary: {
        visible: true,
        order: 0,
        content:
          "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</p><p>Donec ullamcorper nulla non metus auctor fringilla. Aenean lacinia bibendum nulla sed consectetur, sed posuere consectetur est at lobortis.</p>",
      },
      workExperience: {
        visible: true,
        order: 1,
        items: [createDefaultWorkExperienceItem()],
      },
      skills: {
        visible: true,
        order: 2,
        items: [createDefaultSkillCategoryItem()],
      },
      projects: {
        visible: true,
        order: 3,
        items: [createDefaultProjectItem()],
      },
      education: {
        visible: true,
        order: 4,
        items: [createDefaultEducationItem()],
      },
      publications: {
        visible: false,
        order: 5,
        items: [createDefaultPublicationItem()],
      },
      certifications: {
        visible: false,
        order: 6,
        items: [createDefaultCertificationItem()],
      },
      awards: {
        visible: false,
        order: 7,
        items: [createDefaultAwardItem()],
      },
      languages: {
        visible: false,
        order: 8,
        items: [createDefaultLanguageItem()],
      },
      references: {
        visible: false,
        order: 9,
        items: [createDefaultReferenceItem()],
      },
      organizationVolunteering: {
        visible: false,
        order: 10,
        items: [createDefaultOrganizationItem()],
      },
    },
  };
}
