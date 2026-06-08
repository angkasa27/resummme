import type { ReactNode } from "react";

import { isCollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { CollectionSectionPanel } from "@/features/resume-editor/legacy/sections/collection-section-panel";
import { ProfilePanel } from "@/features/resume-editor/legacy/sections/profile-panel";
import { SummaryPanel } from "@/features/resume-editor/legacy/sections/summary-panel";
import type {
  ResumeEditorPanelKey,
  ResumeSectionKey,
} from "@/features/resume-editor/state/resume-editor-store";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type ActiveSectionEditorProps = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  onSaveProfile: (profile: ResumeDraft["profile"]) => void;
  onSaveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K]
  ) => void;
  /** Leading slot forwarded to the active panel's header (e.g. sidebar trigger). */
  leading?: ReactNode;
};

export function ActiveSectionEditor({
  draft,
  activeSection,
  onSaveProfile,
  onSaveSection,
  leading,
}: ActiveSectionEditorProps) {
  if (activeSection === "profile") {
    return <ProfilePanel draft={draft} onSave={onSaveProfile} leading={leading} />;
  }

  if (activeSection === "summary") {
    return (
      <SummaryPanel
        draft={draft}
        onSave={(sectionValue) => onSaveSection("summary", sectionValue)}
        leading={leading}
      />
    );
  }

  if (isCollectionSectionKey(activeSection)) {
    return (
      <CollectionSectionPanel
        draft={draft}
        sectionKey={activeSection}
        onSave={(sectionValue) => onSaveSection(activeSection, sectionValue)}
        leading={leading}
      />
    );
  }

  return null;
}
