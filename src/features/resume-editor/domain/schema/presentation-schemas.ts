import { z } from "zod";

import {
  normalizePdfPresentation,
  pdfFontScaleIds,
  pdfLineHeightIds,
  pdfPageMargins,
  pdfPaperSizes,
  pdfSpacingIds,
  pdfTemplateIds,
  resumeFontIds,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";

export const pdfPresentationSchema = z.preprocess(
  normalizePdfPresentation,
  z.object({
    templateId: z.enum(pdfTemplateIds),
    fontFamilyId: z.enum(resumeFontIds),
    fontScale: z.enum(pdfFontScaleIds),
    spacing: z.enum(pdfSpacingIds),
    lineHeight: z.enum(pdfLineHeightIds),
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    paperSize: z.enum(pdfPaperSizes),
    pageMargin: z.enum(pdfPageMargins),
  }),
);
