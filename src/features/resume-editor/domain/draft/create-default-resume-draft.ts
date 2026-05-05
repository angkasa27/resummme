import { createDefaultPdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

function createTimestamp() {
  return new Date().toISOString();
}

function createEmptyWorkExperienceItem() {
  return {
    id: "default-work-experience-1",
    companyName: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

function createEmptySkillCategoryItem() {
  return {
    id: "default-skill-category-1",
    categoryName: "",
    skills: [],
  };
}

function createEmptyProjectItem() {
  return {
    id: "default-project-1",
    projectName: "",
    projectLink: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

function createEmptyEducationItem() {
  return {
    id: "default-education-1",
    name: "",
    location: "",
    startDate: "",
    endDate: "",
    degree: "",
    gpa: "",
    description: "",
  };
}

function createEmptyPublicationItem() {
  return {
    id: "default-publication-1",
    title: "",
    publisher: "",
    publicationUrl: "",
    publicationDate: "",
    description: "",
  };
}

function createEmptyCertificationItem() {
  return {
    id: "default-certification-1",
    certificationName: "",
    issuingOrganization: "",
    issuedDate: "",
    certificationLink: "",
    credentialId: "",
  };
}

function createEmptyAwardItem() {
  return {
    id: "default-award-1",
    title: "",
    issuer: "",
    issuedDate: "",
    description: "",
  };
}

function createEmptyLanguageItem() {
  return {
    id: "default-language-1",
    language: "",
    proficiency: "",
  };
}

function createEmptyReferenceItem() {
  return {
    id: "default-reference-1",
    name: "",
    background: "",
    contactDetails: "",
  };
}

function createEmptyOrganizationItem() {
  return {
    id: "default-organization-1",
    organizationName: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

export function createDefaultResumeDraft(): ResumeDraft {
  return {
    schemaVersion: 2,
    templateId: "recruiter-first-clean",
    updatedAt: createTimestamp(),
    pdfPresentation: createDefaultPdfPresentation(),
    profile: {
      fullName: "Fulan bin Fulan",
      location: "Jakarta, Indonesia",
      phone: "+6280011112222",
      email: "email.me@here.is",
      summary: "Start editing your resume!",
      photo: "",
      extraLinks: [
        {
          id: "profile-link-linkedin",
          url: "https://www.linkedin.com/in/your-profile",
        },
        {
          id: "profile-link-github",
          url: "https://github.com/your-username",
        },
        {
          id: "profile-link-portfolio",
          url: "https://your-domain.com",
        },
      ],
    },
    sections: {
      summary: {
        visible: true,
        order: 0,
        content: "Start editing your resume!",
      },
      workExperience: {
        visible: true,
        order: 1,
        items: [createEmptyWorkExperienceItem()],
      },
      skills: {
        visible: true,
        order: 2,
        items: [createEmptySkillCategoryItem()],
      },
      projects: {
        visible: true,
        order: 3,
        items: [createEmptyProjectItem()],
      },
      education: {
        visible: true,
        order: 4,
        items: [createEmptyEducationItem()],
      },
      publications: {
        visible: false,
        order: 5,
        items: [createEmptyPublicationItem()],
      },
      certifications: {
        visible: false,
        order: 6,
        items: [createEmptyCertificationItem()],
      },
      awards: {
        visible: false,
        order: 7,
        items: [createEmptyAwardItem()],
      },
      languages: {
        visible: false,
        order: 8,
        items: [createEmptyLanguageItem()],
      },
      references: {
        visible: false,
        order: 9,
        items: [createEmptyReferenceItem()],
      },
      organizationVolunteering: {
        visible: false,
        order: 10,
        items: [createEmptyOrganizationItem()],
      },
    },
  };
}
