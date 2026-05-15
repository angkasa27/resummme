import { z } from "zod";

const importedText = z.string().trim().optional().default("");
const importedStringArray = z.array(z.string().trim()).optional().default([]);

const importedDateRangeSchema = z.object({
  startDate: importedText,
  endDate: importedText,
});

export const importedResumeSchema = z
  .object({
    profile: z
      .object({
        fullName: importedText,
        location: importedText,
        phone: importedText,
        email: importedText,
        extraLinks: importedStringArray,
      })
      .optional()
      .default({
        fullName: "",
        location: "",
        phone: "",
        email: "",
        extraLinks: [],
      }),
    summary: importedStringArray,
    workExperience: z
      .array(
        z.object({
          companyName: importedText,
          position: importedText,
          location: importedText,
          startDate: importedText,
          endDate: importedText,
          highlights: importedStringArray,
        }),
      )
      .optional()
      .default([]),
    skills: z
      .array(
        z.object({
          categoryName: importedText,
          skills: importedStringArray,
        }),
      )
      .optional()
      .default([]),
    projects: z
      .array(
        z.object({
          projectName: importedText,
          projectLink: importedText,
          ...importedDateRangeSchema.shape,
          highlights: importedStringArray,
        }),
      )
      .optional()
      .default([]),
    education: z
      .array(
        z.object({
          name: importedText,
          location: importedText,
          ...importedDateRangeSchema.shape,
          degree: importedText,
          gpa: importedText,
          highlights: importedStringArray,
        }),
      )
      .optional()
      .default([]),
    publications: z
      .array(
        z.object({
          title: importedText,
          publisher: importedText,
          publicationUrl: importedText,
          publicationDate: importedText,
          highlights: importedStringArray,
        }),
      )
      .optional()
      .default([]),
    certifications: z
      .array(
        z.object({
          certificationName: importedText,
          issuingOrganization: importedText,
          issuedDate: importedText,
          certificationLink: importedText,
          credentialId: importedText,
        }),
      )
      .optional()
      .default([]),
    awards: z
      .array(
        z.object({
          title: importedText,
          issuer: importedText,
          issuedDate: importedText,
          highlights: importedStringArray,
        }),
      )
      .optional()
      .default([]),
    languages: z
      .array(
        z.object({
          language: importedText,
          proficiency: importedText,
        }),
      )
      .optional()
      .default([]),
    references: z
      .array(
        z.object({
          name: importedText,
          background: importedText,
          contactDetails: importedText,
        }),
      )
      .optional()
      .default([]),
    organizationVolunteering: z
      .array(
        z.object({
          organizationName: importedText,
          position: importedText,
          location: importedText,
          ...importedDateRangeSchema.shape,
          highlights: importedStringArray,
        }),
      )
      .optional()
      .default([]),
  })
  .strict();

export type ImportedResume = z.infer<typeof importedResumeSchema>;
