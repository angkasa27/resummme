import { z } from "zod";

import {
  normalizePdfPresentation,
  pdfFontScaleIds,
  pdfLayoutIds,
  pdfLineHeightIds,
  pdfSpacingIds,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";

export const pdfPresentationSchema = z.preprocess(
  normalizePdfPresentation,
  z.object({
    layoutId: z.enum(pdfLayoutIds),
    fontScale: z.enum(pdfFontScaleIds),
    spacing: z.enum(pdfSpacingIds),
    lineHeight: z.enum(pdfLineHeightIds),
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  }),
);
