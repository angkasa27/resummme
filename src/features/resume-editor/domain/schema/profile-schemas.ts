import { z } from "zod";

import {
  emailField,
  requiredText,
  textField,
  urlField,
} from "@/features/resume-editor/domain/schema/shared";

const extraLinkSchema = z
  .object({
    id: requiredText("Link ID"),
    url: urlField("Link URL"),
  })
  .strict();

export const profileSchema = z.object({
  fullName: textField(),
  location: textField(),
  phone: textField(),
  email: emailField("Email address"),
  photo: urlField("Photo URL"),
  extraLinks: z.array(extraLinkSchema),
});

export type Profile = z.infer<typeof profileSchema>;
