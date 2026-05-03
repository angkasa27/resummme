import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { sectionLabels } from "@/features/resume-editor/config/section-metadata";
import type {
  ResumeEditorPendingIntent,
  ResumeEditorPanelKey,
} from "@/features/resume-editor/store/editor-store";

type DirtyExitDialogProps = {
  open: boolean;
  pendingIntent: ResumeEditorPendingIntent | null;
  onDiscardChanges: () => void;
  onStayEditing: () => void;
};

function getSectionLabel(sectionKey: ResumeEditorPanelKey) {
  return sectionKey === "profile" ? "Profile" : sectionLabels[sectionKey];
}

function getDialogDescription(pendingIntent: ResumeEditorPendingIntent | null) {
  if (!pendingIntent) {
    return "Leave this section without saving your latest edits?";
  }

  if (pendingIntent.type === "list") {
    return "Leave this section without saving your latest edits?";
  }

  if (pendingIntent.type === "import") {
    return "Importing a new draft will replace the current editor state. Leave this section without saving your latest edits?";
  }

  return `Open ${getSectionLabel(
    pendingIntent.sectionKey
  )} and leave this section without saving your latest edits?`;
}

export function DirtyExitDialog({
  open,
  pendingIntent,
  onDiscardChanges,
  onStayEditing,
}: DirtyExitDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onStayEditing();
        }
      }}
    >
      <AlertDialogContent size="sm" className="rounded-[14px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
          <AlertDialogDescription>
            {getDialogDescription(pendingIntent)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onStayEditing}>Stay Editing</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDiscardChanges}>
            Discard Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
