"use client";

import { useState } from "react";
import { Controller, type FieldError as RhfFieldError } from "react-hook-form";
import {
  ImageUpIcon,
  Link,
  Mail,
  MapPin,
  PencilIcon,
  Phone,
  PlusIcon,
  Trash2Icon,
  UserRoundIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  DESTRUCTIVE_ICON_CLASS,
  FOCUS_RING_CLASS,
} from "@/features/resume-editor/forms/fields/field-control";
import { FieldLabelText } from "@/features/resume-editor/forms/fields/field-label-text";
import { PhotoCropDialog } from "@/features/resume-editor/forms/photo-crop-dialog";
import type { ProfileFormContext } from "@/features/resume-editor/forms/use-profile-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type ProfileFieldsProps = {
  ctx: ProfileFormContext;
  /** Prefix for input ids so two mounts never collide. */
  idPrefix: string;
};

export function ProfileFields({ ctx, idPrefix }: ProfileFieldsProps) {
  const { form, extraLinks, photo, links } = ctx;
  const { register, formState, getFieldState } = form;

  const invalid = (name: Parameters<typeof getFieldState>[0]) =>
    getFieldState(name, formState).invalid || undefined;
  const error = (name: Parameters<typeof getFieldState>[0]) =>
    getFieldState(name, formState).error;

  return (
    <div className="@container/fields">
      <FieldGroup layout="grid">
        <PhotoField
          photo={photo}
          id={`${idPrefix}-photo`}
          error={error("photo")}
          className="col-span-full"
        />

        <Field data-invalid={invalid("fullName")}>
          <FieldLabel htmlFor={`${idPrefix}-full-name`} className="sr-only">
            <FieldLabelText label="Full name" />
          </FieldLabel>
          <FieldContent>
            <Input
              id={`${idPrefix}-full-name`}
              autoComplete="name"
              placeholder="Full name"
              aria-invalid={invalid("fullName")}
              {...register("fullName")}
            />
            <FieldError errors={[error("fullName")]} />
          </FieldContent>
        </Field>

        <Field data-invalid={invalid("location")}>
          <FieldLabel htmlFor={`${idPrefix}-location`} className="sr-only">
            <FieldLabelText label="Location" />
          </FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupAddon>
                <MapPin />
              </InputGroupAddon>
              <InputGroupInput
                id={`${idPrefix}-location`}
                autoComplete="address-level2"
                placeholder="City, country"
                aria-invalid={invalid("location")}
                {...register("location")}
              />
            </InputGroup>

            <FieldError errors={[error("location")]} />
          </FieldContent>
        </Field>

        <Field data-invalid={invalid("phone")}>
          <FieldLabel htmlFor={`${idPrefix}-phone`} className="sr-only">
            <FieldLabelText label="Phone number" />
          </FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupAddon>
                <Phone />
              </InputGroupAddon>
              <InputGroupInput
                id={`${idPrefix}-phone`}
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                spellCheck={false}
                placeholder="+62 822-3044-2367"
                aria-invalid={invalid("phone")}
                {...register("phone")}
              />
            </InputGroup>
            <FieldError errors={[error("phone")]} />
          </FieldContent>
        </Field>

        <Field data-invalid={invalid("email")}>
          <FieldLabel htmlFor={`${idPrefix}-email`} className="sr-only">
            <FieldLabelText label="Email address" />
          </FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>
              <InputGroupInput
                id={`${idPrefix}-email`}
                type="email"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                placeholder="email.me@here.is"
                aria-invalid={invalid("email")}
                {...register("email")}
              />
            </InputGroup>
            <FieldError errors={[error("email")]} />
          </FieldContent>
        </Field>
      </FieldGroup>

      {/* Divider rule between groups: 16px above and below, the between-groups
          step. A flex gap can't space a visible rule, so it's margin+padding. */}
      <FieldSet className="mt-4 border-t pt-4">
        <FieldLegend>
          Links
          <Badge variant="secondary">
            {extraLinks.fields.length} item
            {extraLinks.fields.length === 1 ? "" : "s"}
          </Badge>
        </FieldLegend>

        {extraLinks.fields.length === 0 ? (
          <div className="text-sm text-muted-foreground">No links added.</div>
        ) : (
          // A row list, not a form — 8px. The labels here are sr-only, so
          // there's no floated label needing the 16px clearance.
          <div className="flex flex-col gap-2">
            {extraLinks.fields.map((field, index) => {
              const urlFieldName = `extraLinks.${index}.url` as const;
              const inputId = `${idPrefix}-link-url-${field.id}`;

              return (
                <div key={field.fieldKey} className="flex items-center gap-2">
                  <Field
                    className="flex-1"
                    data-invalid={invalid(urlFieldName)}
                  >
                    <FieldLabel htmlFor={inputId} className="sr-only">
                      <FieldLabelText label={`Link ${index + 1}`} />
                    </FieldLabel>
                    <FieldContent>
                      <Controller
                        control={form.control}
                        name={urlFieldName}
                        render={({ field: nextField }) => (
                          <InputGroup>
                            <InputGroupAddon>
                              <Link />
                            </InputGroupAddon>
                            <InputGroupInput
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
                              aria-invalid={invalid(urlFieldName)}
                              onChange={nextField.onChange}
                            />
                          </InputGroup>
                        )}
                      />
                      <FieldError errors={[error(urlFieldName)]} />
                    </FieldContent>
                  </Field>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove link ${index + 1}`}
                    title={`Remove link ${index + 1}`}
                    onClick={() => links.requestDelete(index)}
                    className={DESTRUCTIVE_ICON_CLASS}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <Button type="button" className="w-full" onClick={links.add}>
          <PlusIcon data-icon="inline-start" />
          Add Link
        </Button>
      </FieldSet>

      <ConfirmDeleteDialog
        open={links.pendingDeleteIndex !== null}
        onOpenChange={(open) => {
          if (!open) links.cancelDelete();
        }}
        onConfirm={links.confirmDelete}
        title="Remove link?"
        description="This link will be removed from your profile."
      />

      <PhotoCropDialog
        open={photo.crop.open}
        imageUrl={photo.crop.imageUrl}
        image={photo.crop.image}
        onApply={photo.applyCrop}
        onCancel={photo.cancelCrop}
      />
    </div>
  );
}

function PhotoAvatarButton({
  id,
  hasPhoto,
  url,
  onClick,
}: {
  id: string;
  hasPhoto: boolean;
  url: string | undefined;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      aria-label={hasPhoto ? "Change profile photo" : "Upload profile photo"}
      className={cn(
        "group relative size-20 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border outline-none transition",
        FOCUS_RING_CLASS,
      )}
    >
      {hasPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt="Profile preview"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-muted-foreground">
          <UserRoundIcon className="size-7" />
        </span>
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-foreground/45 text-background opacity-0 transition-opacity group-hover:opacity-100">
        {hasPhoto ? (
          <PencilIcon className="size-5" />
        ) : (
          <ImageUpIcon className="size-5" />
        )}
      </span>
    </button>
  );
}

function PhotoField({
  photo,
  id,
  error,
  className,
}: {
  photo: ProfileFormContext["photo"];
  id: string;
  error: RhfFieldError | undefined;
  className?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const hasPhoto = Boolean(photo.url);

  return (
    <Field className={className} data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id} className="sr-only">
        <FieldLabelText label="Profile photo" />
      </FieldLabel>
      <FieldContent>
        <div
          data-dragging={dragging || undefined}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files?.[0];
            if (file) void photo.handleFile(file);
          }}
          className={cn(
            "flex flex-col items-center gap-3 rounded-lg border border-dashed border-input p-4 text-center transition-colors",
            "@field-2col/fields:flex-row @field-2col/fields:items-center @field-2col/fields:gap-4 @field-2col/fields:p-3 @field-2col/fields:text-left",
            "data-[dragging]:border-ring data-[dragging]:bg-muted/50",
          )}
        >
          <PhotoAvatarButton
            id={id}
            hasPhoto={hasPhoto}
            url={photo.url}
            onClick={photo.openPicker}
          />

          <div className="flex w-full min-w-0 flex-col items-center gap-2 @field-2col/fields:w-auto @field-2col/fields:flex-1 @field-2col/fields:items-start">
            <div className="flex flex-wrap justify-center gap-2 @field-2col/fields:justify-start">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={photo.openPicker}
              >
                <ImageUpIcon data-icon="inline-start" />
                {hasPhoto ? "Change photo" : "Upload photo"}
              </Button>
              {hasPhoto ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={photo.remove}
                  className={DESTRUCTIVE_ICON_CLASS}
                >
                  <Trash2Icon data-icon="inline-start" />
                  Remove
                </Button>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">
              Drag &amp; drop or click to upload. PNG, JPG, or WEBP up to
              8&nbsp;MB — crop and zoom after choosing.
            </p>
          </div>
        </div>
        <FieldError errors={[error]} />
      </FieldContent>
    </Field>
  );
}
