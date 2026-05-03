"use client";

import { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { PlusIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";

import { createLocalId } from "@/features/resume-editor/lib/create-local-id";
import { createSchemaResolver } from "@/features/resume-editor/lib/form-resolver";
import { profileFormSchema } from "@/features/resume-editor/lib/section-schemas";
import { RichTextEditor } from "@/features/resume-editor/rich-text/rich-text-editor";
import { EditorCard } from "@/features/resume-editor/sections/editor-card";
import { FieldLabelText } from "@/features/resume-editor/sections/field-label-text";
import type { Profile, ResumeDraft } from "@/lib/resume/schema";

type ProfilePanelProps = {
  draft: ResumeDraft;
  onBack: () => void;
  onSave: (profile: Profile) => void;
};

export function ProfilePanel({ draft, onBack, onSave }: ProfilePanelProps) {
  const profileForm = useForm<Profile>({
    resolver: createSchemaResolver<Profile>(profileFormSchema),
    defaultValues: draft.profile,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { control, register, formState, getFieldState } = profileForm;
  const extraLinks = useFieldArray({
    control,
    name: "extraLinks",
    keyName: "fieldKey",
  });

  const formValues = useWatch({ control });

  useEffect(() => {
    const currentValues = profileForm.getValues();
    const isDifferent =
      JSON.stringify(currentValues) !== JSON.stringify(draft.profile);

    if (!isDifferent) {
      if (formState.isDirty) {
        profileForm.reset(draft.profile, { keepValues: true });
      }
      return;
    }

    if (!formState.isDirty) {
      profileForm.reset(draft.profile);
    }
  }, [draft.profile, profileForm, formState.isDirty]);

  useEffect(() => {
    if (!formState.isDirty) return;

    const timeoutId = setTimeout(() => {
      onSave(profileForm.getValues());
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formValues, formState.isDirty, profileForm, onSave]);

  return (
    <EditorCard
      onBack={onBack}
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
            <FieldLabelText label="Photo URL" />
          </FieldLabel>
          <FieldContent>
            <Input
              id="profile-photo"
              type="url"
              autoComplete="url"
              inputMode="url"
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="https://example.com/profile-photo.jpg"
              aria-invalid={
                getFieldState("photo", formState).invalid || undefined
              }
              {...register("photo")}
            />
            <FieldError errors={[getFieldState("photo", formState).error]} />
          </FieldContent>
        </Field>

        <Field
          className="md:col-span-2"
          data-invalid={
            getFieldState("summary", formState).invalid || undefined
          }
        >
          <FieldLabel>
            <FieldLabelText label="Short description" />
          </FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="summary"
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  ariaLabel="Short description"
                  invalid={getFieldState("summary", formState).invalid}
                  onChange={(value) =>
                    profileForm.setValue("summary", value, {
                      shouldDirty: true,
                      shouldValidate: formState.isSubmitted,
                    })
                  }
                />
              )}
            />
            <FieldError errors={[getFieldState("summary", formState).error]} />
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
                <div key={field.fieldKey} className="flex items-start gap-2">
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
                          <InputGroup className="rounded-md">
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
                              aria-invalid={
                                getFieldState(urlFieldName, formState)
                                  .invalid || undefined
                              }
                              onChange={nextField.onChange}
                            />
                          </InputGroup>
                        )}
                      />
                      <FieldError
                        errors={[getFieldState(urlFieldName, formState).error]}
                      />
                    </FieldContent>
                  </Field>
                  <div className="pt-0.5">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      className="mt-px"
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
          variant="outline"
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
