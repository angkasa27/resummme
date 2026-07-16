import { z } from "zod";

import {
  normalizePdfPresentation,
  pdfFontScaleIds,
  pdfLineHeightIds,
  pdfPageMargins,
  pdfPaperSizes,
  pdfPhotoShapeIds,
  pdfSpacingIds,
  pdfLayoutIds,
  resumeFontIds,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { hexColorPattern } from "@/features/resume-editor/domain/presentation/color-utils";

export const pdfPresentationSchema = z.preprocess(
  normalizePdfPresentation,
  z.object({
    layoutId: z.enum(pdfLayoutIds),
    fontFamilyId: z.enum(resumeFontIds),
    fontScale: z.enum(pdfFontScaleIds),
    spacing: z.enum(pdfSpacingIds),
    lineHeight: z.enum(pdfLineHeightIds),
    accent: z.string().regex(hexColorPattern),
    secondary: z.string().regex(hexColorPattern).optional(),
    paperSize: z.enum(pdfPaperSizes),
    pageMargin: z.enum(pdfPageMargins),
    photoShape: z.enum(pdfPhotoShapeIds).optional(),
  }),
);
