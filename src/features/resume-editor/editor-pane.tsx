"use client";

import { DownloadIcon, PrinterIcon, UploadIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  collectionSectionKeys,
  sectionLabels,
} from "@/features/resume-editor/config/section-metadata";
import { CollectionSectionPanel } from "@/features/resume-editor/sections/collection-section-panel";
import { ProfilePanel } from "@/features/resume-editor/sections/profile-panel";
import { SummaryPanel } from "@/features/resume-editor/sections/summary-panel";
import type { ResumeDraft } from "@/lib/resume/schema";
import type {
  ResumeEditorPanelKey,
  ResumeSectionKey,
} from "@/features/resume-editor/store/editor-store";

type EditorPaneProps = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  dirtySections: ResumeEditorPanelKey[];
  pendingSection: ResumeEditorPanelKey | null;
  warningOpen: boolean;
  onOpenImportPicker: () => void;
  onExport: () => void;
  onPrint: () => void;
  onRequestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  onSetSectionDirty: (sectionKey: ResumeEditorPanelKey, isDirty: boolean) => void;
  onDiscardPendingSectionChanges: () => void;
  onCancelPendingSectionChange: () => void;
  onSaveProfile: (profile: ResumeDraft["profile"]) => void;
  onSaveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K]
  ) => void;
};

export function EditorPane({
  draft,
  activeSection,
  dirtySections,
  pendingSection,
  warningOpen,
  onOpenImportPicker,
  onExport,
  onPrint,
  onRequestSectionChange,
  onSetSectionDirty,
  onDiscardPendingSectionChanges,
  onCancelPendingSectionChange,
  onSaveProfile,
  onSaveSection,
}: EditorPaneProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>CV Editor</CardTitle>
          <CardDescription>
            Edit one panel at a time. The preview updates only after you save.
          </CardDescription>
          <CardAction className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onOpenImportPicker}>
              <UploadIcon data-icon="inline-start" />
              Import JSON
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onExport}>
              <DownloadIcon data-icon="inline-start" />
              Export JSON
            </Button>
            <Button type="button" size="sm" onClick={onPrint}>
              <PrinterIcon data-icon="inline-start" />
              Print / Save PDF
            </Button>
          </CardAction>
        </CardHeader>
      </Card>

      {warningOpen && pendingSection ? (
        <Alert>
          <AlertTitle>Unsaved changes</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>
              Save or discard the current panel before moving to{" "}
              {pendingSection === "profile" ? "Profile" : sectionLabels[pendingSection]}.
            </span>
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
      ) : null}

      <ScrollArea className="h-[calc(100vh-12rem)] rounded-xl border">
        <div className="flex flex-col gap-4 p-4">
          <ProfilePanel
            draft={draft}
            isActive={activeSection === "profile"}
            isDirty={dirtySections.includes("profile")}
            onRequestOpen={() => onRequestSectionChange("profile")}
            onDirtyChange={(nextDirty) => onSetSectionDirty("profile", nextDirty)}
            onSave={onSaveProfile}
          />
          <SummaryPanel
            draft={draft}
            isActive={activeSection === "summary"}
            isDirty={dirtySections.includes("summary")}
            onRequestOpen={() => onRequestSectionChange("summary")}
            onDirtyChange={(nextDirty) => onSetSectionDirty("summary", nextDirty)}
            onSave={(sectionValue) => onSaveSection("summary", sectionValue)}
          />
          {collectionSectionKeys.map((sectionKey) => (
            <CollectionSectionPanel
              key={sectionKey}
              draft={draft}
              sectionKey={sectionKey}
              isActive={activeSection === sectionKey}
              isDirty={dirtySections.includes(sectionKey)}
              onRequestOpen={() => onRequestSectionChange(sectionKey)}
              onDirtyChange={(nextDirty) => onSetSectionDirty(sectionKey, nextDirty)}
              onSave={(sectionValue) => onSaveSection(sectionKey, sectionValue)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
