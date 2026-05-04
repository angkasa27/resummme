import {
  BriefcaseBusinessIcon,
  FileTextIcon,
  GlobeIcon,
  GraduationCapIcon,
  LanguagesIcon,
  LinkIcon,
  TrophyIcon,
  UserRoundIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react";

import type {
  CollectionSectionKey,
  EditorPanelKey,
} from "@/features/resume-editor/config/section-metadata";

const sectionIconMap: Record<EditorPanelKey, LucideIcon> = {
  profile: UserRoundIcon,
  summary: FileTextIcon,
  workExperience: BriefcaseBusinessIcon,
  skills: WrenchIcon,
  projects: GlobeIcon,
  education: GraduationCapIcon,
  publications: LinkIcon,
  certifications: TrophyIcon,
  awards: TrophyIcon,
  languages: LanguagesIcon,
  references: UserRoundIcon,
  organizationVolunteering: BriefcaseBusinessIcon,
};

export function SectionIcon({
  sectionKey,
}: {
  sectionKey: EditorPanelKey | CollectionSectionKey;
}) {
  const Icon = sectionIconMap[sectionKey];
  return <Icon data-icon="inline-start" />;
}
