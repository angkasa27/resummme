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
};

export function ActiveSectionEditor({
  draft,
  activeSection,
  onSaveProfile,
  onSaveSection,
}: ActiveSectionEditorProps) {
  if (activeSection === "profile") {
    return <ProfilePanel draft={draft} onSave={onSaveProfile} />;
  }

  if (activeSection === "summary") {
    return (
      <SummaryPanel
        draft={draft}
        onSave={(sectionValue) => onSaveSection("summary", sectionValue)}
      />
    );
  }

  if (isCollectionSectionKey(activeSection)) {
    return (
      <CollectionSectionPanel
        draft={draft}
        sectionKey={activeSection}
        onSave={(sectionValue) => onSaveSection(activeSection, sectionValue)}
      />
    );
  }

  return null;
}
