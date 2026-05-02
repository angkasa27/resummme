import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { sectionLabels } from "@/features/resume-editor/config/section-metadata";
import type {
  ResumeEditorPanelKey,
  ResumeEditorViewMode,
} from "@/features/resume-editor/store/editor-store";

type EditorWarningProps = {
  pendingSection: ResumeEditorPanelKey | null;
  pendingViewMode: ResumeEditorViewMode | null;
  onDiscardPendingSectionChanges: () => void;
  onCancelPendingSectionChange: () => void;
};

export function EditorWarning({
  pendingSection,
  pendingViewMode,
  onDiscardPendingSectionChanges,
  onCancelPendingSectionChange,
}: EditorWarningProps) {
  if (!pendingSection && !pendingViewMode) {
    return null;
  }

  const message =
    pendingViewMode === "list"
      ? "Save or discard the current section before leaving the editor."
      : `Save or discard the current section before moving to ${
          pendingSection === "profile" ? "Profile" : sectionLabels[pendingSection!]
        }.`;

  return (
    <Alert className="rounded-2xl">
      <AlertTitle>Unsaved changes</AlertTitle>
      <AlertDescription className="flex flex-wrap items-center gap-3">
        <span>{message}</span>
        <Button type="button" size="sm" onClick={onDiscardPendingSectionChanges}>
          Discard and continue
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onCancelPendingSectionChange}
        >
          Stay here
        </Button>
      </AlertDescription>
    </Alert>
  );
}
