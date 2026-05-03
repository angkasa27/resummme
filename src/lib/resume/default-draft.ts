import type { ResumeDraft } from "@/lib/resume/schema";

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
    profile: {
      fullName: "Dimas Angkasa Nurindra",
      location: "Jakarta, Indonesia",
      phone: "+6282230442367",
      email: "mas.angkasa27@gmail.com",
      summary:
        "<p>Software engineer with experience building frontend-heavy web applications and internal tools for product teams.</p>",
      photo: "",
      extraLinks: [
        {
          id: "profile-link-linkedin",
          url: "https://www.linkedin.com/in/dimasangkasa",
        },
        {
          id: "profile-link-github",
          url: "https://github.com/angkasa27",
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
          "<p>Software engineer with 6+ years of experience specializing in frontend development for enterprise web applications.</p>",
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
