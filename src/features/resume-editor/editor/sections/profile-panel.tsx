"use client";

import { useRef } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { ImageIcon, PlusIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { createLocalId } from "@/features/resume-editor/domain/create-local-id";
import { profileSchema } from "@/features/resume-editor/domain/schema";
import { createFormSchemaResolver } from "@/features/resume-editor/forms/schemas/create-form-schema-resolver";
import { useAutoSave } from "@/features/resume-editor/forms/use-auto-save";
import { useSyncedFormValues } from "@/features/resume-editor/forms/use-synced-form-values";
import { EditorCard } from "@/features/resume-editor/editor/sections/editor-card";
import { FieldLabelText } from "@/features/resume-editor/editor/sections/field-label-text";
import {
  ProfilePhotoError,
  readProfilePhotoAsDataUrl,
} from "@/lib/image-to-data-url";
import type {
  Profile,
  ResumeDraft,
} from "@/features/resume-editor/domain/schema";

type ProfilePanelProps = {
  draft: ResumeDraft;
  onSave: (profile: Profile) => void;
};

export function ProfilePanel({ draft, onSave }: ProfilePanelProps) {
  const profileForm = useForm<Profile>({
    resolver: createFormSchemaResolver<Profile>(profileSchema),
    defaultValues: draft.profile,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { control, register, formState, getFieldState, setValue } = profileForm;
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const photoUrl = useWatch({ control, name: "photo" });

  async function handlePhotoFile(file: File | null | undefined) {
    if (!file) return;
    try {
      const dataUrl = await readProfilePhotoAsDataUrl(file);
      setValue("photo", dataUrl, { shouldDirty: true, shouldValidate: true });
    } catch (error) {
      toast.error(
        error instanceof ProfilePhotoError
          ? error.message
          : "Could not read that image.",
      );
    }
  }
  const extraLinks = useFieldArray({
    control,
    name: "extraLinks",
    keyName: "fieldKey",
  });

  useSyncedFormValues(profileForm, draft.profile);
  useAutoSave(profileForm, onSave);

  return (
    <EditorCard
      title="Profile"
      meta={<Badge variant="secondary">Header</Badge>}
    >
      <FieldGroup className="grid gap-3 md:grid-cols-2">
        <Field
          data-invalid={
            getFieldState("fullName", formState).invalid || undefined
          }
        >
          <FieldLabel htmlFor="profile-full-name">
            <FieldLabelText label="Full name" />
          </FieldLabel>
          <FieldContent>
            <Input
              id="profile-full-name"
              autoComplete="name"
              placeholder="Fulan bin Fulan"
              aria-invalid={
                getFieldState("fullName", formState).invalid || undefined
              }
              {...register("fullName")}
            />
            <FieldError errors={[getFieldState("fullName", formState).error]} />
          </FieldContent>
        </Field>

        <Field
          data-invalid={
            getFieldState("location", formState).invalid || undefined
          }
        >
          <FieldLabel htmlFor="profile-location">
            <FieldLabelText label="Location" />
          </FieldLabel>
          <FieldContent>
            <Input
              id="profile-location"
              autoComplete="address-level2"
              placeholder="Jakarta, Indonesia"
              aria-invalid={
                getFieldState("location", formState).invalid || undefined
              }
              {...register("location")}
            />
            <FieldError errors={[getFieldState("location", formState).error]} />
          </FieldContent>
        </Field>

        <Field
          data-invalid={getFieldState("phone", formState).invalid || undefined}
        >
          <FieldLabel htmlFor="profile-phone">
            <FieldLabelText label="Phone number" />
          </FieldLabel>
          <FieldContent>
            <Input
              id="profile-phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              spellCheck={false}
              placeholder="+62 822-3044-2367"
              aria-invalid={
                getFieldState("phone", formState).invalid || undefined
              }
              {...register("phone")}
            />
            <FieldError errors={[getFieldState("phone", formState).error]} />
          </FieldContent>
        </Field>

        <Field
          data-invalid={getFieldState("email", formState).invalid || undefined}
        >
          <FieldLabel htmlFor="profile-email">
            <FieldLabelText label="Email address" />
          </FieldLabel>
          <FieldContent>
            <Input
              id="profile-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              placeholder="email.me@here.is"
              aria-invalid={
                getFieldState("email", formState).invalid || undefined
              }
              {...register("email")}
            />
            <FieldError errors={[getFieldState("email", formState).error]} />
          </FieldContent>
        </Field>

        <Field
          data-invalid={getFieldState("photo", formState).invalid || undefined}
        >
          <FieldLabel htmlFor="profile-photo">
            <FieldLabelText label="Photo" />
          </FieldLabel>
          <FieldContent>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="relative size-24 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-border outline-none transition hover:ring-foreground/40 focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={
                  photoUrl ? "Change profile photo" : "Upload profile photo"
                }
              >
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoUrl}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <ImageIcon className="size-5" />
                  </div>
                )}
              </button>
              <input
                ref={photoInputRef}
                id="profile-photo"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="sr-only"
                onChange={(event) => {
                  void handlePhotoFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => photoInputRef.current?.click()}
                >
                  <UploadIcon data-icon="inline-start" />
                  {photoUrl ? "Change" : "Upload image"}
                </Button>
                {photoUrl ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setValue("photo", "", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
            </div>
            <FieldError errors={[getFieldState("photo", formState).error]} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="mt-4 flex flex-col gap-3 border-t pt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Links</span>
          <Badge variant="secondary">
            {extraLinks.fields.length} item
            {extraLinks.fields.length === 1 ? "" : "s"}
          </Badge>
        </div>

        {extraLinks.fields.length === 0 ? (
          <div className="py-2 text-sm text-muted-foreground">
            No links added.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {extraLinks.fields.map((field, index) => {
              const urlFieldName = `extraLinks.${index}.url` as const;
              const inputId = `profile-link-url-${field.id}`;

              return (
                <div key={field.fieldKey} className="flex items-center gap-2">
                  <Field
                    className="flex-1"
                    data-invalid={
                      getFieldState(urlFieldName, formState).invalid ||
                      undefined
                    }
                  >
                    <FieldLabel htmlFor={inputId} className="sr-only">
                      <FieldLabelText label={`Link ${index + 1}`} />
                    </FieldLabel>
                    <FieldContent>
                      <Controller
                        control={control}
                        name={urlFieldName}
                        render={({ field: nextField }) => (
                          <Input
                            id={inputId}
                            name={nextField.name}
                            type="url"
                            autoComplete="url"
                            inputMode="url"
                            spellCheck={false}
                            autoCapitalize="none"
                            autoCorrect="off"
                            value={nextField.value}
                            placeholder="https://www.linkedin.com/in/your-handle"
                            aria-invalid={
                              getFieldState(urlFieldName, formState).invalid ||
                              undefined
                            }
                            onChange={nextField.onChange}
                          />
                        )}
                      />
                      <FieldError
                        errors={[getFieldState(urlFieldName, formState).error]}
                      />
                    </FieldContent>
                  </Field>
                  <div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      aria-label={`Remove link ${index + 1}`}
                      title={`Remove link ${index + 1}`}
                      onClick={() => extraLinks.remove(index)}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button
          type="button"
          className="w-full"
          onClick={() =>
            extraLinks.append({
              id: createLocalId("extra-link"),
              url: "https://",
            })
          }
        >
          <PlusIcon data-icon="inline-start" />
          Add Link
        </Button>
      </div>
    </EditorCard>
  );
}
