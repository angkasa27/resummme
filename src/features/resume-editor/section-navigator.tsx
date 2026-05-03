import {
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
  onRequestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  onMoveSection: (sectionKey: ResumeSectionPanelKey, direction: -1 | 1) => void;
  onSetSectionVisibility: (
    sectionKey: ResumeSectionPanelKey,
    visible: boolean,
  ) => void;
};

export function SectionNavigator({
  draft,
  onRequestSectionChange,
  onMoveSection,
  onSetSectionVisibility,
}: SectionNavigatorProps) {
  const orderedSectionKeys = getOrderedSectionKeys(draft.sections);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b px-4 py-3">
        <h2 className="text-base font-semibold">Sections</h2>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <ul className="flex flex-col gap-1">
          <li>
            <div
              data-section-row="profile"
              className="flex min-w-0 items-center gap-3 rounded-[12px] border px-3 py-2.5 transition-colors hover:bg-muted/55"
            >
              <div className="text-muted-foreground">
                {renderSectionIcon("profile")}
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate text-sm font-medium">Profile</span>
                <Badge variant="secondary">Fixed</Badge>
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Edit Profile"
                title="Edit Profile"
                onClick={() => onRequestSectionChange("profile")}
                className="text-primary"
              >
                <PencilIcon />
              </Button>
            </div>
          </li>

          {orderedSectionKeys.map((sectionKey, index) => {
            const section = draft.sections[sectionKey];
            const label = sectionLabels[sectionKey];
            const isFirst = index === 0;
            const isLast = index === orderedSectionKeys.length - 1;

            return (
              <li key={sectionKey}>
                <div
                  data-section-row={sectionKey}
                  className="flex min-w-0 items-center gap-3 rounded-[12px] border px-3 py-2.5 transition-colors hover:bg-muted/55"
                >
                  <div
                    className={cn(
                      "text-muted-foreground",
                      !section.visible && "opacity-60",
                    )}
                  >
                    {renderSectionIcon(sectionKey)}
                  </div>
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        !section.visible && "opacity-60",
                      )}
                    >
                      {label}
                    </span>
                    {!section.visible ? (
                      <Badge variant="secondary">Hidden</Badge>
                    ) : null}
                  </div>

                  <ButtonGroup
                    aria-label={`${label} actions`}
                    className="shrink-0"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={isFirst || !section.visible}
                      aria-label={`Move ${label} up`}
                      title={`Move ${label} up`}
                      onClick={() => onMoveSection(sectionKey, -1)}
                    >
                      <ArrowUpIcon />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={isLast || !section.visible}
                      aria-label={`Move ${label} down`}
                      title={`Move ${label} down`}
                      onClick={() => onMoveSection(sectionKey, 1)}
                    >
                      <ArrowDownIcon />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label={`Edit ${label}`}
                      title={`Edit ${label}`}
                      onClick={() => onRequestSectionChange(sectionKey)}
                      disabled={!section.visible}
                      className={cn(section.visible && "text-primary")}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      type="button"
                      variant={section.visible ? "destructive" : "default"}
                      size="icon-sm"
                      aria-label={`${section.visible ? "Hide" : "Show"} ${label}`}
                      title={`${section.visible ? "Hide" : "Show"} ${label}`}
                      onClick={() =>
                        onSetSectionVisibility(sectionKey, !section.visible)
                      }
                      className="border! border-l-0! border-border!"
                    >
                      {section.visible ? <EyeOffIcon /> : <EyeIcon />}
                    </Button>
                  </ButtonGroup>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
