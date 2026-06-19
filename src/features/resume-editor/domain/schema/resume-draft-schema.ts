import { z } from "zod";

import { createDefaultPdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { pdfPresentationSchema } from "@/features/resume-editor/domain/schema/presentation-schemas";
import { profileSchema } from "@/features/resume-editor/domain/schema/profile-schemas";
import { sectionsSchema } from "@/features/resume-editor/domain/schema/section-schemas";

const resumeDraftSchema = z.object({
  schemaVersion: z.literal(2),
  templateId: z.literal("recruiter-first-clean"),
  updatedAt: z.string().min(1),
  pdfPresentation: pdfPresentationSchema
    .optional()
    .default(createDefaultPdfPresentation()),
  profile: profileSchema,
  sections: sectionsSchema,
});

export type ResumeDraft = z.infer<typeof resumeDraftSchema>;

export function parseResumeDraft(input: unknown): ResumeDraft {
  return resumeDraftSchema.parse(input);
}
