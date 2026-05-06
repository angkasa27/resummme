import { z } from "zod";

import { sanitizeRichTextHtml } from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";

export const monthYearPattern = /^[A-Za-z]{3,9}\s+\d{4}$/;
export const currentValueSchema = z.literal("current");

export function requiredText(label: string) {
  return z.string().trim().min(1, `${label} is required.`);
}

export function optionalText() {
  return z.string().trim().optional().or(z.literal(""));
}

function refineBlankableString(
  label: string,
  validator: z.ZodType<string>,
  message: string,
) {
  return z.string().trim().refine(
    (value) => value === "" || validator.safeParse(value).success,
    {
      message: `${label} ${message}`,
    },
  );
}

export function textField() {
  return z.string().trim();
}

export function richTextField() {
  return z.string().trim().transform((value) => sanitizeRichTextHtml(value));
}

export function emailField(label: string) {
  return refineBlankableString(
    label,
    z.email(),
    "must be a valid email address.",
  );
}

export function urlField(label: string) {
  return refineBlankableString(label, z.url(), "must be a valid URL.");
}

export function richTextTextContent(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function monthYearField(label: string) {
  return z
    .literal("")
    .or(z.string().trim().regex(monthYearPattern, `${label} must use the format MMM YYYY.`));
}

export function monthYearOrCurrentField(label: string) {
  return z.union([
    z.literal(""),
    z.string().trim().regex(monthYearPattern, `${label} must use the format MMM YYYY.`),
    currentValueSchema,
  ]);
}
