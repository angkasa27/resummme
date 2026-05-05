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

export function requiredUrl(label: string) {
  return z.string().trim().url(`${label} must be a valid URL.`);
}

export function optionalUrl(label: string) {
  return z.literal("").or(requiredUrl(label));
}

export function editorEmail(label: string) {
  return z.string().trim().refine(
    (value) => value === "" || z.email().safeParse(value).success,
    {
      message: `${label} must be a valid email address.`,
    },
  );
}

export function editorUrl(label: string) {
  return z.string().trim().refine(
    (value) => value === "" || z.url().safeParse(value).success,
    {
      message: `${label} must be a valid URL.`,
    },
  );
}

export function requiredEmail(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .email(`${label} must be a valid email address.`);
}

export function richTextTextContent(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function requiredRichText(label: string) {
  return z
    .string()
    .trim()
    .transform((value) => sanitizeRichTextHtml(value))
    .refine((value) => richTextTextContent(value).length > 0, {
      message: `${label} is required.`,
    });
}

export function requiredMonthYear(label: string) {
  return z
    .string()
    .trim()
    .regex(monthYearPattern, `${label} must use the format MMM YYYY.`);
}

export function editorMonthYear(label: string) {
  return z.string().trim().refine(
    (value) => value === "" || monthYearPattern.test(value),
    {
      message: `${label} must use the format MMM YYYY.`,
    },
  );
}

export function draftText() {
  return z.string().trim();
}

export function draftRichText() {
  return z.string().trim().transform((value) => sanitizeRichTextHtml(value));
}

export function draftMonthYear() {
  return z.literal("").or(z.string().trim().regex(monthYearPattern));
}

export function draftCurrentOrMonthYear() {
  return z.union([
    z.literal(""),
    z.string().trim().regex(monthYearPattern),
    currentValueSchema,
  ]);
}

export function draftUrl() {
  return z.string().trim();
}
