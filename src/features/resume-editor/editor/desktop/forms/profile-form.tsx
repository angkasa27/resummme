"use client";

import { useEffect, useId } from "react";

import { FormShell } from "@/features/resume-editor/editor/desktop/forms/form-shell";
import { SectionIcon } from "@/features/resume-editor/ui/section-icons";
import { ProfileFields } from "@/features/resume-editor/forms/profile-fields";
import { useProfileForm } from "@/features/resume-editor/forms/use-profile-form";
import type {
  Profile,
  ResumeDraft,
} from "@/features/resume-editor/domain/schema";

type DesktopProfileFormProps = {
  draft: ResumeDraft;
  onSave: (profile: Profile) => void;
  onCancel: () => void;
  onClose: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

export function DesktopProfileForm({
  draft,
  onSave,
  onCancel,
  onClose,
  onDirtyChange,
}: DesktopProfileFormProps) {
  const ctx = useProfileForm(draft);
  const { form } = ctx;
  const { formState } = form;
  const formId = useId();

  useEffect(() => {
    onDirtyChange?.(formState.isDirty);
  }, [formState.isDirty, onDirtyChange]);

  function handleSave(values: Profile) {
    onSave(values);
    onClose();
  }

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(handleSave)}
      className="flex h-full min-h-0 flex-col"
    >
      <FormShell
        title="Profile"
        icon={<SectionIcon sectionKey="profile" />}
        onCancel={onCancel}
        formId={formId}
        isDirty={formState.isDirty}
        isSaving={formState.isSubmitting}
      >
        <ProfileFields ctx={ctx} idPrefix="canvas-profile" />
      </FormShell>
    </form>
  );
}
