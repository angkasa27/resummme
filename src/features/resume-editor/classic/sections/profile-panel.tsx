"use client";

import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { useAutoSave } from "@/features/resume-editor/forms/use-auto-save";
import { EditorCard } from "@/features/resume-editor/classic/sections/editor-card";
import { ProfileFields } from "@/features/resume-editor/shared/forms/profile-fields";
import { useProfileForm } from "@/features/resume-editor/shared/forms/use-profile-form";
import type {
  Profile,
  ResumeDraft,
} from "@/features/resume-editor/domain/schema";

type ProfilePanelProps = {
  draft: ResumeDraft;
  onSave: (profile: Profile) => void;
  leading?: ReactNode;
};

export function ProfilePanel({ draft, onSave, leading }: ProfilePanelProps) {
  const ctx = useProfileForm(draft);
  useAutoSave(ctx.form, onSave);

  return (
    <EditorCard
      title="Profile"
      leading={leading}
      meta={<Badge variant="secondary">Header</Badge>}
    >
      <ProfileFields ctx={ctx} idPrefix="profile" />
    </EditorCard>
  );
}
