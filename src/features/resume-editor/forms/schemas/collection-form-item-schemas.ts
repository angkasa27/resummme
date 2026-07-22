import {
  certificationItemSchema,
  projectItemSchema,
  publicationItemSchema,
} from "@/features/resume-editor/domain/schema";
import { urlField } from "@/features/resume-editor/domain/schema/shared";

/**
 * Form-only item schemas: the persisted schemas (domain/schema) store URLs as
 * plain strings so nothing is ever blocked, but the editor still guides the
 * user with a "must be a valid URL" error. These re-apply the strict URL check
 * on the free-typed link fields, for the resolver's `errors` only — persistence
 * does not consult them.
 */
export const projectFormItemSchema = projectItemSchema.extend({
  projectLink: urlField("Project link"),
});

export const publicationFormItemSchema = publicationItemSchema.extend({
  publicationUrl: urlField("Publication URL"),
});

export const certificationFormItemSchema = certificationItemSchema.extend({
  certificationLink: urlField("Certification link"),
});
