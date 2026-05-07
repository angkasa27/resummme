"use client";

import { useRef, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { ImageIcon, PlusIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { Field, FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { createLocalId } from "@/features/resume-editor/domain/create-local-id";
import { profileSchema } from "@/features/resume-editor/domain/schema";
import { createFormSchemaResolver } from "@/features/resume-editor/forms/schemas/create-form-schema-resolver";
import { useAutoSave } from "@/features/resume-editor/forms/use-auto-save";
import { useSyncedFormValues } from "@/features/resume-editor/forms/use-synced-form-values";
import { CanvasFormShell } from "@/features/resume-editor/canvas/forms/canvas-form-shell";
import {
  ProfilePhotoError,
  readProfilePhotoAsDataUrl,
} from "@/lib/image-to-data-url";
import type {
  Profile,
  ResumeDraft,
} from "@/features/resume-editor/domain/schema";

type CanvasProfileFormProps = {
  draft: ResumeDraft;
  onSave: (profile: Profile) => void;
  onCancel: () => void;
  onClose: () => void;
};

export function CanvasProfileForm({
  draft,
  onSave,
  onCancel,
  onClose,
}: CanvasProfileFormProps) {
  const form = useForm<Profile>({
    resolver: createFormSchemaResolver<Profile>(profileSchema),
    defaultValues: draft.profile,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { control, register, formState, getFieldState, setValue } = form;
  const photoInputRef = useRef<HTMLInputElement | null>(null);

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

  useSyncedFormValues(form, draft.profile);
  useAutoSave(form, onSave);
  const [pendingDeleteLinkIndex, setPendingDeleteLinkIndex] = useState<number | null>(null);

  const photoUrl = useWatch({ control, name: "photo" });

  return (
    <CanvasFormShell title="Profile" onCancel={onCancel} onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-[88px_1fr]">
        {/* Avatar widget */}
        <Field
          data-invalid={getFieldState("photo", formState).invalid || undefined}
        >
          <FieldContent>
            <div className="flex flex-col items-start gap-2">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="relative size-22 overflow-hidden rounded-md bg-muted ring-1 ring-border outline-none transition hover:ring-foreground/40 focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={
                  photoUrl ? "Change profile photo" : "Upload profile photo"
                }
              >
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoUrl}
                    alt={draft.profile.fullName || "Profile photo"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <ImageIcon className="size-6" />
                  </div>
                )}
              </button>
              <input
                ref={photoInputRef}
                id="canvas-profile-photo"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="sr-only"
                onChange={(event) => {
                  void handlePhotoFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              <div className="flex w-22 flex-col gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 w-full text-[11px]"
                  onClick={() => photoInputRef.current?.click()}
                >
                  <UploadIcon data-icon="inline-start" />
                  {photoUrl ? "Change" : "Upload"}
                </Button>
                {photoUrl ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-full text-[11px] text-muted-foreground"
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
              <FieldError errors={[getFieldState("photo", formState).error]} />
            </div>
          </FieldContent>
        </Field>

        {/* Identity fields */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            className="sm:col-span-2"
            data-invalid={
              getFieldState("fullName", formState).invalid || undefined
            }
          >
            <FieldContent>
              <Input
                id="canvas-profile-name"
                autoComplete="name"
                placeholder="Full name"
                className="text-base font-semibold"
                aria-label="Full name"
                aria-invalid={
                  getFieldState("fullName", formState).invalid || undefined
                }
                {...register("fullName")}
              />
              <FieldError
                errors={[getFieldState("fullName", formState).error]}
              />
            </FieldContent>
          </Field>

          <Field
            data-invalid={
              getFieldState("location", formState).invalid || undefined
            }
          >
            <FieldContent>
              <Input
                id="canvas-profile-location"
                autoComplete="address-level2"
                placeholder="Location"
                aria-label="Location"
                aria-invalid={
                  getFieldState("location", formState).invalid || undefined
                }
                {...register("location")}
              />
              <FieldError
                errors={[getFieldState("location", formState).error]}
              />
            </FieldContent>
          </Field>

          <Field
            data-invalid={
              getFieldState("phone", formState).invalid || undefined
            }
          >
            <FieldContent>
              <Input
                id="canvas-profile-phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                spellCheck={false}
                placeholder="Phone number"
                aria-label="Phone number"
                aria-invalid={
                  getFieldState("phone", formState).invalid || undefined
                }
                {...register("phone")}
              />
              <FieldError errors={[getFieldState("phone", formState).error]} />
            </FieldContent>
          </Field>

          <Field
            className="sm:col-span-2"
            data-invalid={
              getFieldState("email", formState).invalid || undefined
            }
          >
            <FieldContent>
              <Input
                id="canvas-profile-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                placeholder="Email address"
                aria-label="Email address"
                aria-invalid={
                  getFieldState("email", formState).invalid || undefined
                }
                {...register("email")}
              />
              <FieldError errors={[getFieldState("email", formState).error]} />
            </FieldContent>
          </Field>
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Links · {extraLinks.fields.length}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              extraLinks.append({
                id: createLocalId("extra-link"),
                url: "https://",
              })
            }
          >
            <PlusIcon data-icon="inline-start" />
            Add link
          </Button>
        </div>

        {extraLinks.fields.length === 0 ? null : (
          <div className="flex flex-col gap-1.5">
            {extraLinks.fields.map((field, index) => {
              const urlFieldName = `extraLinks.${index}.url` as const;
              const inputId = `canvas-profile-link-${field.id}`;
              const fieldState = getFieldState(urlFieldName, formState);

              return (
                <div key={field.fieldKey} className="flex items-center gap-1.5">
                  <Field
                    className="flex-1"
                    data-invalid={fieldState.invalid || undefined}
                  >
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
                            aria-label={`Link ${index + 1}`}
                            aria-invalid={fieldState.invalid || undefined}
                            onChange={nextField.onChange}
                          />
                        )}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    aria-label={`Remove link ${index + 1}`}
                    onClick={() => setPendingDeleteLinkIndex(index)}
                  >
                    <Trash2Icon className="text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <ConfirmDeleteDialog
        open={pendingDeleteLinkIndex !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteLinkIndex(null);
        }}
        onConfirm={() => {
          if (pendingDeleteLinkIndex !== null)
            extraLinks.remove(pendingDeleteLinkIndex);
        }}
        title="Remove link?"
        description="This link will be removed from your profile."
      />
    </CanvasFormShell>
  );
}
