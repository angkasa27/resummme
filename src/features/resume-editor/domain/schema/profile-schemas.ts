import { z } from "zod";

import {
  draftRichText,
  draftText,
  draftUrl,
  editorEmail,
  editorUrl,
  requiredEmail,
  requiredText,
  requiredUrl,
} from "@/features/resume-editor/domain/schema/shared";

export const extraLinkSchema = z
  .object({
    id: requiredText("Link ID"),
    url: requiredUrl("Link URL"),
  })
  .strict();

export const extraLinkFormSchema = z
  .object({
    id: requiredText("Link ID"),
    url: editorUrl("Link URL"),
  })
  .strict();

export const profileSchema = z.object({
  fullName: requiredText("Full name"),
  location: requiredText("Location"),
  phone: requiredText("Phone number"),
  email: requiredEmail("Email address"),
  photo: z.literal("").or(requiredUrl("Photo URL")),
  extraLinks: z.array(extraLinkSchema),
});

export const profileFormSchema = z.object({
  fullName: draftText(),
  location: draftText(),
  phone: draftText(),
  email: editorEmail("Email address"),
  photo: editorUrl("Photo URL"),
  extraLinks: z.array(extraLinkFormSchema),
});

const extraLinkDraftSchema = z
  .object({
    id: requiredText("Link ID"),
    url: draftUrl(),
  })
  .strict();

export const profileDraftSchema = z.object({
  fullName: draftText(),
  location: draftText(),
  phone: draftText(),
  email: draftText(),
  summary: draftRichText(),
  photo: draftUrl(),
  extraLinks: z.array(extraLinkDraftSchema),
});

export type ExtraLink = z.infer<typeof extraLinkSchema>;
export type Profile = z.infer<typeof profileSchema>;
