import { createDefaultPdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

function createTimestamp() {
  return new Date().toISOString();
}

function createDefaultWorkExperienceItem() {
  return {
    id: "default-work-experience-1",
    companyName: "Nusantara Commerce",
    position: "Lead Frontend Engineer",
    location: "Jakarta, Indonesia",
    startDate: "Mar 2022",
    endDate: "current",
    description:
      "<ul><li>Led the migration of the customer storefront from legacy React pages to Next.js App Router, improving Core Web Vitals and reducing average page load time by 38%.</li><li>Partnered with product and design teams to launch a reusable component library used by 6 squads, cutting feature delivery time by 25%.</li><li>Mentored 4 engineers through architecture reviews, testing standards, and rollout plans for high-traffic releases.</li></ul>",
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
      "Vitest",
      "Playwright",
    ],
  };
}

function createDefaultProjectItem() {
  return {
    id: "default-project-1",
    projectName: "Seller Analytics Dashboard",
    projectLink:
      "https://portfolio.example.dev/projects/seller-analytics-dashboard",
    startDate: "Jan 2024",
    endDate: "Oct 2024",
    description:
      "<ul><li>Built a role-based analytics dashboard for marketplace sellers with interactive charts, exports, and saved filters.</li><li>Implemented data fetching and cache strategies that reduced dashboard query time from 5.2s to 1.9s on high-volume accounts.</li><li>Delivered an accessible UI and keyboard-first navigation, passing internal accessibility QA for core flows.</li></ul>",
  };
}

function createDefaultEducationItem() {
  return {
    id: "default-education-1",
    name: "Institut Teknologi Bandung",
    location: "Bandung, Indonesia",
    startDate: "Aug 2015",
    endDate: "May 2019",
    degree: "B.S. in Informatics",
    gpa: "3.78 / 4.00",
    description:
      "<ul><li>Focused on software engineering, human-computer interaction, and distributed systems.</li><li>Capstone project: designed a web-based scheduling platform used by 3 departments during pilot adoption.</li></ul>",
  };
}

function createDefaultPublicationItem() {
  return {
    id: "default-publication-1",
    title: "Practical Frontend Performance for Indonesian E-Commerce",
    publisher: "Tech in Asia Community",
    publicationUrl:
      "https://medium.com/@dimasangkasa/frontend-performance-ecommerce",
    publicationDate: "Sep 2024",
    description:
      "<ul><li>Wrote a practical guide on bundle optimization, image strategy, and rendering patterns based on production incidents and measurable outcomes.</li></ul>",
  };
}

function createDefaultCertificationItem() {
  return {
    id: "default-certification-1",
    certificationName: "AWS Certified Developer - Associate",
    issuingOrganization: "Amazon Web Services",
    issuedDate: "Jul 2024",
    certificationLink:
      "https://www.credly.com/badges/12345678-90ab-cdef-1234-567890abcdef",
    credentialId: "AWS-DEV-2024-5521",
  };
}

function createDefaultAwardItem() {
  return {
    id: "default-award-1",
    title: "Product Impact Award",
    issuer: "Nusantara Commerce",
    issuedDate: "Dec 2024",
    description:
      "<ul><li>Recognized for leading checkout performance improvements that increased conversion by 6.4% during the year-end campaign period.</li></ul>",
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
    background: "Engineering Director, Nusantara Commerce",
    contactDetails: "anindya.putri@nusantaracommerce.co.id · +62 812-4455-6677",
  };
}

function createDefaultOrganizationItem() {
  return {
    id: "default-organization-1",
    organizationName: "Indonesia React Community",
    position: "Volunteer Mentor",
    location: "Jakarta, Indonesia",
    startDate: "Feb 2021",
    endDate: "current",
    description:
      "<ul><li>Mentor junior developers through monthly frontend clinics covering React fundamentals, testing, and portfolio reviews.</li><li>Co-organized 8 meetups with hands-on workshops attended by more than 400 participants.</li></ul>",
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
      email: "dimas.angkasa@proton.me",
      photo: "https://picsum.photos/200",
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
          "<p>Frontend engineer with 6+ years of experience building performant and accessible web products in e-commerce and SaaS environments. Strong track record leading migrations to modern React and Next.js architectures, improving developer velocity, and shipping user-facing features with measurable business impact.</p>",
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
