import { isCollectionSectionKey } from "@/features/resume-editor/config/section-metadata";
import { CollectionSectionPanel } from "@/features/resume-editor/sections/collection-section-panel";
import { ProfilePanel } from "@/features/resume-editor/sections/profile-panel";
import { SummaryPanel } from "@/features/resume-editor/sections/summary-panel";
import type {
  ResumeEditorPanelKey,
  ResumeSectionKey,
} from "@/features/resume-editor/store/editor-store";
import type { ResumeDraft } from "@/lib/resume/schema";

type ActiveSectionEditorProps = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  dirtySections: ResumeEditorPanelKey[];
  onBack: () => void;
  onSetSectionDirty: (sectionKey: ResumeEditorPanelKey, isDirty: boolean) => void;
  onSaveProfile: (profile: ResumeDraft["profile"]) => void;
  onSaveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K]
  ) => void;
};

export function ActiveSectionEditor({
  draft,
  activeSection,
  dirtySections,
  onBack,
  onSetSectionDirty,
  onSaveProfile,
  onSaveSection,
}: ActiveSectionEditorProps) {
  if (activeSection === "profile") {
    return (
      <ProfilePanel
        draft={draft}
        isDirty={dirtySections.includes("profile")}
        onBack={onBack}
        onDirtyChange={(nextDirty) => onSetSectionDirty("profile", nextDirty)}
        onSave={onSaveProfile}
      />
    );
  }

  if (activeSection === "summary") {
    return (
      <SummaryPanel
        draft={draft}
        isDirty={dirtySections.includes("summary")}
        onBack={onBack}
        onDirtyChange={(nextDirty) => onSetSectionDirty("summary", nextDirty)}
        onSave={(sectionValue) => onSaveSection("summary", sectionValue)}
      />
    );
  }

  if (isCollectionSectionKey(activeSection)) {
    return (
      <CollectionSectionPanel
        draft={draft}
        sectionKey={activeSection}
        isDirty={dirtySections.includes(activeSection)}
        onBack={onBack}
        onDirtyChange={(nextDirty) => onSetSectionDirty(activeSection, nextDirty)}
        onSave={(sectionValue) => onSaveSection(activeSection, sectionValue)}
      />
    );
  }

  return null;
}
