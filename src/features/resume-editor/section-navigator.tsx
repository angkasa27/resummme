import {
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getOrderedSectionKeys,
  sectionLabels,
  type ResumeSectionPanelKey,
} from "@/features/resume-editor/config/section-metadata";
import { renderSectionIcon } from "@/features/resume-editor/sections/section-icons";
import type { ResumeEditorPanelKey } from "@/features/resume-editor/store/editor-store";
import type { ResumeDraft } from "@/lib/resume/schema";
import { cn } from "@/lib/utils";

type SectionNavigatorProps = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  dirtySections: ResumeEditorPanelKey[];
  onRequestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  onMoveSection: (sectionKey: ResumeSectionPanelKey, direction: -1 | 1) => void;
  onSetSectionVisibility: (sectionKey: ResumeSectionPanelKey, visible: boolean) => void;
};

export function SectionNavigator({
  draft,
  activeSection,
  dirtySections,
  onRequestSectionChange,
  onMoveSection,
  onSetSectionVisibility,
}: SectionNavigatorProps) {
  const orderedSectionKeys = getOrderedSectionKeys(draft.sections);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b px-5 py-3">
        <h2 className="text-base font-semibold">Sections</h2>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
        <ul className="flex flex-col gap-1">
          <li>
            <div
              className={cn(
                "flex min-w-0 items-center gap-3 rounded-2xl border px-3 py-2",
                activeSection === "profile" && "border-primary/30 bg-primary/5"
              )}
            >
              <div className="text-muted-foreground">{renderSectionIcon("profile")}</div>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate text-sm font-medium">Profile</span>
                <Badge variant="secondary">Fixed</Badge>
                {dirtySections.includes("profile") ? <Badge>Unsaved</Badge> : null}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant={activeSection === "profile" ? "default" : "ghost"}
                  size="icon-sm"
                  aria-label="Edit Profile"
                  title="Edit Profile"
                  onClick={() => onRequestSectionChange("profile")}
                >
                  <PencilIcon />
                </Button>
              </div>
            </div>
          </li>

          {orderedSectionKeys.map((sectionKey, index) => {
            const section = draft.sections[sectionKey];
            const label = sectionLabels[sectionKey];
            const isActive = activeSection === sectionKey;
            const isDirty = dirtySections.includes(sectionKey);
            const isFirst = index === 0;
            const isLast = index === orderedSectionKeys.length - 1;

            return (
              <li key={sectionKey}>
                <div
                  className={cn(
                    "flex min-w-0 items-center gap-3 rounded-2xl border px-3 py-2",
                    isActive && "border-primary/30 bg-primary/5",
                    !section.visible && "opacity-60"
                  )}
                >
                  <div className="text-muted-foreground">{renderSectionIcon(sectionKey)}</div>
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="truncate text-sm font-medium">{label}</span>
                    {isDirty ? <Badge>Unsaved</Badge> : null}
                    {!section.visible ? <Badge variant="outline">Hidden</Badge> : null}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant={isActive ? "default" : "ghost"}
                      size="icon-sm"
                      aria-label={`Edit ${label}`}
                      title={`Edit ${label}`}
                      onClick={() => onRequestSectionChange(sectionKey)}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={isFirst}
                      aria-label={`Move ${label} up`}
                      title={`Move ${label} up`}
                      onClick={() => onMoveSection(sectionKey, -1)}
                    >
                      <ArrowUpIcon />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={isLast}
                      aria-label={`Move ${label} down`}
                      title={`Move ${label} down`}
                      onClick={() => onMoveSection(sectionKey, 1)}
                    >
                      <ArrowDownIcon />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`${section.visible ? "Hide" : "Show"} ${label}`}
                      title={`${section.visible ? "Hide" : "Show"} ${label}`}
                      onClick={() => onSetSectionVisibility(sectionKey, !section.visible)}
                    >
                      {section.visible ? <EyeOffIcon /> : <EyeIcon />}
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
