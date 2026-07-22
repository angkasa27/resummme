import { z } from "zod";

import { profileSchema } from "@/features/resume-editor/domain/schema";
import {
  emailField,
  requiredText,
  urlField,
} from "@/features/resume-editor/domain/schema/shared";

const extraLinkFormSchema = z
  .object({
    id: requiredText("Link ID"),
    url: urlField("Link URL"),
  })
  .strict();

/**
 * Form-only profile schema: re-applies the strict email + link-URL format
 * checks on top of the lenient persisted `profileSchema`, so the editor shows
 * "invalid email/URL" errors without ever blocking the save.
 */
export const profileFormSchema = profileSchema.extend({
  email: emailField("Email address"),
  extraLinks: z.array(extraLinkFormSchema),
});
