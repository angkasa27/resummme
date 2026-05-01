import type { ResumeDraft } from "@/lib/resume/schema";

function createTimestamp() {
  return new Date().toISOString();
}

export function createDefaultResumeDraft(): ResumeDraft {
  return {
    schemaVersion: 1,
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
          label: "LinkedIn",
          url: "https://www.linkedin.com/in/dimasangkasa",
        },
        {
          id: "profile-link-github",
          label: "GitHub",
          url: "https://github.com/angkasa27",
        },
        {
          id: "profile-link-portfolio",
          label: "Portfolio",
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
        items: [],
      },
      skills: {
        visible: true,
        order: 2,
        items: [],
      },
      projects: {
        visible: true,
        order: 3,
        items: [],
      },
      education: {
        visible: true,
        order: 4,
        items: [],
      },
      publications: {
        visible: false,
        order: 5,
        items: [],
      },
      certifications: {
        visible: false,
        order: 6,
        items: [],
      },
      awards: {
        visible: false,
        order: 7,
        items: [],
      },
      languages: {
        visible: false,
        order: 8,
        items: [],
      },
      references: {
        visible: false,
        order: 9,
        items: [],
      },
      organizationVolunteering: {
        visible: false,
        order: 10,
        items: [],
      },
    },
  };
}
