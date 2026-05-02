"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { LinkIcon, PlusIcon, SaveIcon, SquareXIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useSectionFormState } from "@/features/resume-editor/hooks/use-section-form-state";
import { createSchemaResolver } from "@/features/resume-editor/lib/form-resolver";
import { createLocalId } from "@/features/resume-editor/lib/create-local-id";
import { EditorCard } from "@/features/resume-editor/sections/editor-card";
import { renderSectionIcon } from "@/features/resume-editor/sections/section-icons";
import { profileSchema } from "@/lib/resume/schema";
import type { Profile, ResumeDraft } from "@/lib/resume/schema";

type ProfilePanelProps = {
  draft: ResumeDraft;
  isActive: boolean;
  isDirty: boolean;
  onRequestOpen: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  onSave: (profile: Profile) => void;
};

export function ProfilePanel({
  draft,
  isActive,
  isDirty,
  onRequestOpen,
  onDirtyChange,
  onSave,
}: ProfilePanelProps) {
  const profileForm = useForm<Profile>({
    resolver: createSchemaResolver<Profile>(profileSchema),
    defaultValues: draft.profile,
  });
  const { control, handleSubmit, register, reset, formState } = profileForm;
  const extraLinks = useFieldArray({
    control,
    name: "extraLinks",
  });

  useSectionFormState({
    isActive,
    formIsDirty: formState.isDirty,
    onDirtyChange,
    reset,
    values: draft.profile,
  });

  return (
    <EditorCard
      isActive={isActive}
      isDirty={isDirty}
      icon={renderSectionIcon("profile")}
      title="Profile"
      description="Header identity, contact line, and supporting links."
      onRequestOpen={onRequestOpen}
      footerActions={
        <>
          <Button type="button" variant="outline" onClick={() => reset(draft.profile)}>
            <SquareXIcon data-icon="inline-start" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit((values) => {
              onSave(values);
              reset(values);
              toast.success("Profile saved.");
            })}
          >
            <SaveIcon data-icon="inline-start" />
            Save Section
          </Button>
        </>
      }
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="profile-full-name">Full name</FieldLabel>
          <Input id="profile-full-name" {...register("fullName")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-location">Location</FieldLabel>
          <Input id="profile-location" {...register("location")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-phone">Phone number</FieldLabel>
          <Input id="profile-phone" {...register("phone")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-email">Email</FieldLabel>
          <Input id="profile-email" type="email" {...register("email")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-photo">Photo URL</FieldLabel>
          <Input id="profile-photo" type="url" {...register("photo")} />
          <FieldDescription>Optional. Leave empty to render no photo.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-summary">Short description</FieldLabel>
          <Textarea id="profile-summary" rows={3} {...register("summary")} />
        </Field>
      </FieldGroup>

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-medium">Extra links</div>
            <div className="text-sm text-muted-foreground">
              LinkedIn, GitHub, portfolio, and similar inline header links.
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              extraLinks.append({
                id: createLocalId("extra-link"),
                label: "",
                url: "https://",
              })
            }
          >
            <PlusIcon data-icon="inline-start" />
            Add link
          </Button>
        </div>

        {extraLinks.fields.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LinkIcon />
              </EmptyMedia>
              <EmptyTitle>No extra links yet</EmptyTitle>
              <EmptyDescription>
                Add links that should appear inline in the CV header.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-3">
            {extraLinks.fields.map((field, index) => (
              <Card key={field.id} size="sm">
                <CardHeader>
                  <CardTitle>Link {index + 1}</CardTitle>
                  <CardAction>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => extraLinks.remove(index)}
                    >
                      <Trash2Icon data-icon="inline-start" />
                      Remove
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor={`profile-link-label-${field.id}`}>
                        Label
                      </FieldLabel>
                      <Controller
                        control={control}
                        name={`extraLinks.${index}.label`}
                        render={({ field: nextField }) => (
                          <Input
                            id={`profile-link-label-${field.id}`}
                            value={nextField.value}
                            onChange={nextField.onChange}
                          />
                        )}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`profile-link-url-${field.id}`}>URL</FieldLabel>
                      <Controller
                        control={control}
                        name={`extraLinks.${index}.url`}
                        render={({ field: nextField }) => (
                          <InputGroup>
                            <InputGroupInput
                              id={`profile-link-url-${field.id}`}
                              value={nextField.value}
                              onChange={nextField.onChange}
                            />
                            <InputGroupAddon align="inline-end">
                              <LinkIcon />
                            </InputGroupAddon>
                          </InputGroup>
                        )}
                      />
                    </Field>
                  </FieldGroup>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </EditorCard>
  );
}
