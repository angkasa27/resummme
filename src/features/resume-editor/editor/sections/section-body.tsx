"use client";

import { isCollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { CollectionSectionBody } from "@/features/resume-editor/editor/sections/collection-section-body";
import { ProfileFields } from "@/features/resume-editor/forms/profile-fields";
import { useProfileForm } from "@/features/resume-editor/forms/use-profile-form";
import { SummaryFields } from "@/features/resume-editor/forms/summary-fields";
import { useSummaryForm } from "@/features/resume-editor/forms/use-summary-form";
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
  /** Disambiguates input ids between the desktop and mobile surfaces. */
  idPrefix?: string;
};

/**
 * Renders the active section's headerless auto-save form body. The surrounding
 * drill-in header supplies the title.
 */
export function SectionBody({
  draft,
  activeSection,
  onSaveProfile,
  onSaveSection,
  idPrefix = "section",
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
