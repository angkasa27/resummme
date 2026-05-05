import { z } from "zod";

import {
  normalizePdfPresentation,
  pdfAccentStrengths,
  pdfAccentTones,
  pdfLayoutIds,
  pdfLineHeightIds,
  pdfSpacingIds,
  pdfTypeScaleIds,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";

const pdfPresentationLayoutSchema = z.enum(pdfLayoutIds);
const pdfPresentationAccentToneSchema = z.enum(pdfAccentTones);
const pdfPresentationAccentStrengthSchema = z.enum(pdfAccentStrengths);

export const pdfPresentationOverridesSchema = z.object({
  typeScale: z.enum(pdfTypeScaleIds),
  lineHeight: z.enum(pdfLineHeightIds),
  spacing: z.enum(pdfSpacingIds),
  accentTone: pdfPresentationAccentToneSchema,
  accentStrength: pdfPresentationAccentStrengthSchema,
});

export const pdfPresentationSchema = z.preprocess(
  normalizePdfPresentation,
  z.object({
    layoutId: pdfPresentationLayoutSchema,
    overrides: pdfPresentationOverridesSchema,
  }),
);

export const pdfPresentationFormSchema = pdfPresentationSchema;
