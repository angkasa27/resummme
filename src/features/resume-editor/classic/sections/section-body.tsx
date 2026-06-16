"use client";

import { isCollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { CollectionSectionBody } from "@/features/resume-editor/classic/sections/collection-section-body";
import { ProfileFields } from "@/features/resume-editor/shared/forms/profile-fields";
import { useProfileForm } from "@/features/resume-editor/shared/forms/use-profile-form";
import { SummaryFields } from "@/features/resume-editor/shared/forms/summary-fields";
import { useSummaryForm } from "@/features/resume-editor/shared/forms/use-summary-form";
import { useAutoSave } from "@/features/resume-editor/forms/use-auto-save";
import type {
  ResumeEditorPanelKey,
  ResumeSectionKey,
} from "@/features/resume-editor/state/resume-editor-store";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type SectionBodyProps = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  onSaveProfile: (profile: ResumeDraft["profile"]) => void;
  onSaveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K],
  ) => void;
  /** Disambiguates input ids between the desktop accordion and mobile surfaces
   * (both can mount a body at once behind responsive CSS). */
  idPrefix?: string;
  /** Hides the active collection section (ignored for Profile/Summary, which
   * are pinned and not removable). */
  onRemoveSection?: () => void;
};

/**
 * Renders the active section's headerless auto-save form body. The surrounding
 * accordion row (desktop) or full-screen header (mobile) supplies the title.
 */
export function SectionBody({
  draft,
  activeSection,
  onSaveProfile,
  onSaveSection,
  idPrefix = "section",
  onRemoveSection,
}: SectionBodyProps) {
  if (activeSection === "profile") {
    return (
      <ProfileBody
        draft={draft}
        onSave={onSaveProfile}
        idPrefix={`${idPrefix}-profile`}
      />
    );
  }

  if (activeSection === "summary") {
    return (
      <SummaryBody
        draft={draft}
        onSave={(value) => onSaveSection("summary", value)}
      />
    );
  }

  if (isCollectionSectionKey(activeSection)) {
    return (
      <CollectionSectionBody
        draft={draft}
        sectionKey={activeSection}
        onSave={(value) => onSaveSection(activeSection, value)}
        onRemoveSection={onRemoveSection}
      />
    );
  }

  return null;
}

function ProfileBody({
  draft,
  onSave,
  idPrefix,
}: {
  draft: ResumeDraft;
  onSave: (profile: ResumeDraft["profile"]) => void;
  idPrefix: string;
}) {
  const ctx = useProfileForm(draft);
  useAutoSave(ctx.form, onSave);
  return <ProfileFields ctx={ctx} idPrefix={idPrefix} />;
}

function SummaryBody({
  draft,
  onSave,
}: {
  draft: ResumeDraft;
  onSave: (summary: ResumeDraft["sections"]["summary"]) => void;
}) {
  const ctx = useSummaryForm(draft);
  useAutoSave(ctx.form, (values) =>
    onSave({ ...ctx.sectionValue, content: values.content }),
  );
  return <SummaryFields ctx={ctx} />;
}
