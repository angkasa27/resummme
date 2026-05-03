"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { PlusIcon, Trash2Icon } from "lucide-react";
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
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSectionFormState } from "@/features/resume-editor/hooks/use-section-form-state";
import { createLocalId } from "@/features/resume-editor/lib/create-local-id";
import { createSchemaResolver } from "@/features/resume-editor/lib/form-resolver";
import { EditorCard } from "@/features/resume-editor/sections/editor-card";
import { FieldLabelText } from "@/features/resume-editor/sections/field-label-text";
import { profileSchema } from "@/lib/resume/schema";
import type { Profile, ResumeDraft } from "@/lib/resume/schema";

type ProfilePanelProps = {
  draft: ResumeDraft;
  onBack: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  onSave: (profile: Profile) => void;
};

export function ProfilePanel({
  draft,
  onBack,
  onDirtyChange,
  onSave,
}: ProfilePanelProps) {
  const profileForm = useForm<Profile>({
    resolver: createSchemaResolver<Profile>(profileSchema),
    defaultValues: draft.profile,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { control, handleSubmit, register, reset, formState, getFieldState } =
    profileForm;
  const extraLinks = useFieldArray({
    control,
    name: "extraLinks",
  });

  useSectionFormState({
    formIsDirty: formState.isDirty,
    onDirtyChange,
    reset,
    values: draft.profile,
  });

  return (
    <EditorCard
      onBack={onBack}
      title="Profile"
      meta={<Badge variant="secondary">Header</Badge>}
      onSave={handleSubmit((values) => {
        onSave(values);
        reset(values);
        toast.success("Profile saved.");
      })}
    >
      <FieldGroup>
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
              placeholder="Dimas Angkasa Nurindra"
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
              placeholder="mas.angkasa27@gmail.com"
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
            <FieldLabelText label="Photo URL" optional />
          </FieldLabel>
          <FieldContent>
            <Input
              id="profile-photo"
              type="url"
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
          data-invalid={
            getFieldState("summary", formState).invalid || undefined
          }
        >
          <FieldLabel htmlFor="profile-summary">
            <FieldLabelText label="Short description" />
          </FieldLabel>
          <FieldContent>
            <Textarea
              id="profile-summary"
              rows={3}
              placeholder="Frontend engineer building enterprise web products and internal platforms."
              aria-invalid={
                getFieldState("summary", formState).invalid || undefined
              }
              {...register("summary")}
            />
            <FieldError errors={[getFieldState("summary", formState).error]} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-3 mt-3">
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

              return (
                <div key={field.id} className="flex items-start gap-2">
                  <Field
                    className="flex-1"
                    data-invalid={
                      getFieldState(urlFieldName, formState).invalid ||
                      undefined
                    }
                  >
                    <FieldLabel
                      htmlFor={`profile-link-url-${field.id}`}
                      className="sr-only"
                    >
                      <FieldLabelText label={`Link ${index + 1}`} />
                    </FieldLabel>
                    <FieldContent>
                      <Controller
                        control={control}
                        name={urlFieldName}
                        render={({ field: nextField }) => (
                          <InputGroup className="rounded-[10px]">
                            <InputGroupInput
                              id={`profile-link-url-${field.id}`}
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
