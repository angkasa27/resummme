import { z } from "zod";

import {
  requiredText,
  textField,
} from "@/features/resume-editor/domain/schema/shared";

// Lenient persisted schema (see section-schemas.ts): email and link URLs are
// stored as plain strings so a mid-typed value is never rejected. The strict
// email/URL format checks are advisory and live in the form resolver
// (forms/schemas/profile-form-schema.ts).
const extraLinkSchema = z
  .object({
    id: requiredText("Link ID"),
    url: textField(),
  })
  .strict();

export const profileSchema = z.object({
  fullName: textField(),
  location: textField(),
  phone: textField(),
  email: textField(),
  photo: textField(),
  extraLinks: z.array(extraLinkSchema),
});

export type Profile = z.infer<typeof profileSchema>;
