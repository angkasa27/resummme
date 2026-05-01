"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusinessIcon,
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
  GlobeIcon,
  GraduationCapIcon,
  LanguagesIcon,
  LinkIcon,
  PlusIcon,
  PrinterIcon,
  SaveIcon,
  SquareXIcon,
  Trash2Icon,
  TrophyIcon,
  UploadIcon,
  UserRoundIcon,
  WrenchIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Controller,
  type FieldValues,
  type Resolver,
  useFieldArray,
  useForm,
  useWatch,
  type UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";
import { useStore } from "zustand";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  collectionSectionConfigs,
  collectionSectionKeys,
  languageProficiencyOptions,
  type CollectionSectionKey,
  type EditorPanelKey,
  sectionLabels,
} from "@/features/resume-editor/section-definitions";
import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import { RichTextEditor } from "@/features/resume-editor/rich-text/rich-text-editor";
import {
  createResumeEditorStore,
  type ResumeSectionKey,
} from "@/features/resume-editor/store/editor-store";
import {
  awardsSectionSchema,
  certificationsSectionSchema,
  educationSectionSchema,
  languagesSectionSchema,
  organizationVolunteeringSectionSchema,
  profileSchema,
  projectsSectionSchema,
  publicationsSectionSchema,
  referencesSectionSchema,
  skillsSectionSchema,
  summarySectionSchema,
  workExperienceSectionSchema,
} from "@/lib/resume/schema";
import type {
  ExtraLink,
  Profile,
  ResumeDraft,
  SummarySection,
} from "@/lib/resume/schema";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import {
  exportResumeDraft,
  importResumeDraft,
  loadResumeDraft,
  saveResumeDraft,
} from "@/lib/resume/storage";
import { cn } from "@/lib/utils";

type ResumeEditorShellProps = {
  initialDraft?: ResumeDraft;
};

const sectionIconMap: Record<EditorPanelKey, typeof UserRoundIcon> = {
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

const sectionSchemaMap = {
  workExperience: workExperienceSectionSchema,
  skills: skillsSectionSchema,
  projects: projectsSectionSchema,
  education: educationSectionSchema,
  publications: publicationsSectionSchema,
  certifications: certificationsSectionSchema,
  awards: awardsSectionSchema,
  languages: languagesSectionSchema,
  references: referencesSectionSchema,
  organizationVolunteering: organizationVolunteeringSectionSchema,
} as const;

function createSchemaResolver<TFieldValues extends FieldValues>(schema: unknown) {
  return zodResolver(schema as never) as Resolver<TFieldValues>;
}

function cloneDraft<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function reorderSections(
  sections: ResumeDraft["sections"],
  targetKey: ResumeSectionKey,
  nextSectionValue: ResumeDraft["sections"][ResumeSectionKey]
) {
  const orderedEntries = Object.entries(sections).sort(
    (left, right) => left[1].order - right[1].order
  ) as Array<[ResumeSectionKey, ResumeDraft["sections"][ResumeSectionKey]]>;
  const boundedIndex = Math.max(
    0,
    Math.min(nextSectionValue.order, orderedEntries.length - 1)
  );
  const nextEntries = orderedEntries.filter(([sectionKey]) => sectionKey !== targetKey);
  nextEntries.splice(boundedIndex, 0, [targetKey, nextSectionValue]);

  const nextSections = cloneDraft(sections);
  const mutableSections = nextSections as Record<
    ResumeSectionKey,
    ResumeDraft["sections"][ResumeSectionKey]
  >;

  nextEntries.forEach(([sectionKey, sectionValue], index) => {
    mutableSections[sectionKey] = {
      ...sectionValue,
      order: index,
    } as ResumeDraft["sections"][ResumeSectionKey];
  });

  return nextSections;
}

function nextOrderValue(currentOrder: number, direction: -1 | 1, maxOrder: number) {
  return Math.max(0, Math.min(currentOrder + direction, maxOrder));
}

function createCollectionSectionIcon(sectionKey: CollectionSectionKey) {
  const Icon = sectionIconMap[sectionKey];
  return <Icon data-icon="inline-start" />;
}

export function ResumeEditorShell({ initialDraft }: ResumeEditorShellProps) {
  const [store] = useState(() => {
    const nextStore = createResumeEditorStore(
      initialDraft ?? createDefaultResumeDraft()
    );
    nextStore.setState({ activeSection: "profile" });
    return nextStore;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draft = useStore(store, (state) => state.draft);
  const activeSection = useStore(store, (state) => state.activeSection);
  const dirtySections = useStore(store, (state) => state.dirtySections);
  const pendingSection = useStore(store, (state) => state.pendingSection);
  const warningOpen = useStore(store, (state) => state.warningOpen);

  useEffect(() => {
    if (initialDraft) {
      return;
    }

    const storedDraft = loadResumeDraft();

    store.setState((state) => {
      if (exportResumeDraft(state.draft) === exportResumeDraft(storedDraft)) {
        return state;
      }

      return {
        ...state,
        draft: storedDraft,
        dirtySections: [],
        pendingSection: null,
        warningOpen: false,
      };
    });
  }, [initialDraft, store]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (store.getState().dirtySections.length === 0) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [store]);

  function ensureImportAllowed() {
    if (dirtySections.length === 0) {
      return true;
    }

    return window.confirm(
      "You have unsaved changes. Importing a resume will replace the current editor state."
    );
  }

  function handleExport() {
    const serializedDraft = exportResumeDraft(draft);
    const draftBlob = new Blob([serializedDraft], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(draftBlob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = "resume-draft.json";
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
    toast.success("Draft exported.");
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!ensureImportAllowed()) {
      event.target.value = "";
      return;
    }

    try {
      const fileContents = await selectedFile.text();
      const importedDraft = importResumeDraft(fileContents);
      store.getState().replaceDraft(importedDraft);
      toast.success("Draft imported.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to import that draft."
      );
    } finally {
      event.target.value = "";
    }
  }

  function handlePrint() {
    window.print();
  }

  function renderEditorPane() {
    return (
      <div className="flex h-full flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>CV Editor</CardTitle>
            <CardDescription>
              Edit one panel at a time. The preview updates only after you save.
            </CardDescription>
            <CardAction className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <UploadIcon data-icon="inline-start" />
                Import JSON
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleExport}>
                <DownloadIcon data-icon="inline-start" />
                Export JSON
              </Button>
              <Button type="button" size="sm" onClick={handlePrint}>
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
                {pendingSection === "profile"
                  ? "Profile"
                  : sectionLabels[pendingSection]}.
              </span>
              <Button
                type="button"
                size="sm"
                onClick={() => store.getState().discardPendingSectionChanges()}
              >
                Discard and continue
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => store.getState().cancelPendingSectionChange()}
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
              onRequestOpen={() => store.getState().requestSectionChange("profile")}
              onDirtyChange={(nextDirty) =>
                store.getState().setSectionDirty("profile", nextDirty)
              }
              onSave={(profileValue) => {
                store.getState().saveProfile(profileValue);
              }}
            />
            <SummaryPanel
              draft={draft}
              isActive={activeSection === "summary"}
              isDirty={dirtySections.includes("summary")}
              onRequestOpen={() => store.getState().requestSectionChange("summary")}
              onDirtyChange={(nextDirty) =>
                store.getState().setSectionDirty("summary", nextDirty)
              }
              onSave={(summaryValue) => {
                const nextSections = reorderSections(
                  draft.sections,
                  "summary",
                  summaryValue
                );
                const nextDraft = cloneDraft(draft);
                nextDraft.sections = nextSections;
                nextDraft.updatedAt = new Date().toISOString();
                saveResumeDraft(nextDraft);
                store.setState((state) => ({
                  draft: nextDraft,
                  dirtySections: state.dirtySections.filter((key) => key !== "summary"),
                }));
              }}
            />
            {collectionSectionKeys.map((sectionKey) => (
              <CollectionSectionPanel
                key={sectionKey}
                draft={draft}
                sectionKey={sectionKey}
                isActive={activeSection === sectionKey}
                isDirty={dirtySections.includes(sectionKey)}
                onRequestOpen={() => store.getState().requestSectionChange(sectionKey)}
                onDirtyChange={(nextDirty) =>
                  store.getState().setSectionDirty(sectionKey, nextDirty)
                }
                onSave={(nextSectionValue) => {
                  const nextSections = reorderSections(
                    draft.sections,
                    sectionKey,
                    nextSectionValue
                  );
                  const nextDraft = cloneDraft(draft);
                  nextDraft.sections = nextSections;
                  nextDraft.updatedAt = new Date().toISOString();
                  saveResumeDraft(nextDraft);
                  store.setState((state) => ({
                    draft: nextDraft,
                    dirtySections: state.dirtySections.filter((key) => key !== sectionKey),
                  }));
                }}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  function renderPreviewPane() {
    return (
      <ScrollArea className="h-[calc(100vh-12rem)] rounded-xl border bg-muted/20">
        <div className="p-6">
          <ResumeDocument draft={draft} />
        </div>
      </ScrollArea>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-6 print:bg-background print:p-0">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImport}
      />

      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:hidden">
        <Tabs defaultValue="edit">
          <TabsList className="w-full">
            <TabsTrigger value="edit">
              <FileTextIcon data-icon="inline-start" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview">
              <EyeIcon data-icon="inline-start" />
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" keepMounted>
            {renderEditorPane()}
          </TabsContent>
          <TabsContent value="preview" keepMounted>
            {renderPreviewPane()}
          </TabsContent>
        </Tabs>
      </div>

      <div className="mx-auto hidden max-w-[1600px] grid-cols-[minmax(420px,560px)_1fr] gap-6 lg:grid print:block">
        <div className="print:hidden">{renderEditorPane()}</div>
        <div>{renderPreviewPane()}</div>
      </div>
    </div>
  );
}

type ProfilePanelProps = {
  draft: ResumeDraft;
  isActive: boolean;
  isDirty: boolean;
  onRequestOpen: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  onSave: (profile: Profile) => void;
};

function ProfilePanel({
  draft,
  isActive,
  isDirty,
  onRequestOpen,
  onDirtyChange,
  onSave,
}: ProfilePanelProps) {
  const profileForm = useForm<Profile>({
    resolver: createSchemaResolver<Profile>(profileSchema),
    defaultValues: draft.profile,
  });
  const { control, handleSubmit, register, reset, formState } = profileForm;
  const lastDirtyRef = useRef(formState.isDirty);
  const extraLinks = useFieldArray({
    control,
    name: "extraLinks",
  });

  useEffect(() => {
    reset(draft.profile);
  }, [draft.profile, reset]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    if (lastDirtyRef.current === formState.isDirty) {
      return;
    }

    lastDirtyRef.current = formState.isDirty;
    onDirtyChange(formState.isDirty);
  }, [formState.isDirty, isActive, onDirtyChange]);

  return (
    <EditorCard
      isActive={isActive}
      isDirty={isDirty}
      icon={<UserRoundIcon data-icon="inline-start" />}
      title="Profile"
      description="Header identity, contact line, and supporting links."
      onRequestOpen={onRequestOpen}
      footerActions={
        <>
          <Button type="button" variant="outline" onClick={() => reset(draft.profile)}>
            <SquareXIcon data-icon="inline-start" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit((values) => {
              onSave(values);
              reset(values);
              toast.success("Profile saved.");
            })}
          >
            <SaveIcon data-icon="inline-start" />
            Save Section
          </Button>
        </>
      }
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="profile-full-name">Full name</FieldLabel>
          <Input id="profile-full-name" {...register("fullName")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-location">Location</FieldLabel>
          <Input id="profile-location" {...register("location")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-phone">Phone number</FieldLabel>
          <Input id="profile-phone" {...register("phone")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-email">Email</FieldLabel>
          <Input id="profile-email" type="email" {...register("email")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-photo">Photo URL</FieldLabel>
          <Input id="profile-photo" type="url" {...register("photo")} />
          <FieldDescription>Optional. Leave empty to render no photo.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-summary">Short description</FieldLabel>
          <Textarea id="profile-summary" rows={3} {...register("summary")} />
        </Field>
      </FieldGroup>

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-medium">Extra links</div>
            <div className="text-sm text-muted-foreground">
              LinkedIn, GitHub, portfolio, and similar inline header links.
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              extraLinks.append({
                id: `extra-link-${Date.now()}`,
                label: "",
                url: "https://",
              } satisfies ExtraLink)
            }
          >
            <PlusIcon data-icon="inline-start" />
            Add link
          </Button>
        </div>

        {extraLinks.fields.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LinkIcon />
              </EmptyMedia>
              <EmptyTitle>No extra links yet</EmptyTitle>
              <EmptyDescription>
                Add links that should appear inline in the CV header.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-3">
            {extraLinks.fields.map((field, index) => (
              <Card key={field.id} size="sm">
                <CardHeader>
                  <CardTitle>Link {index + 1}</CardTitle>
                  <CardAction>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => extraLinks.remove(index)}
                    >
                      <Trash2Icon data-icon="inline-start" />
                      Remove
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor={`profile-link-label-${field.id}`}>Label</FieldLabel>
                      <Controller
                        control={control}
                        name={`extraLinks.${index}.label`}
                        render={({ field: nextField }) => (
                          <Input
                            id={`profile-link-label-${field.id}`}
                            value={nextField.value}
                            onChange={nextField.onChange}
                          />
                        )}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`profile-link-url-${field.id}`}>URL</FieldLabel>
                      <Controller
                        control={control}
                        name={`extraLinks.${index}.url`}
                        render={({ field: nextField }) => (
                          <InputGroup>
                            <InputGroupInput
                              id={`profile-link-url-${field.id}`}
                              value={nextField.value}
                              onChange={nextField.onChange}
                            />
                            <InputGroupAddon align="inline-end">
                              <LinkIcon />
                            </InputGroupAddon>
                          </InputGroup>
                        )}
                      />
                    </Field>
                  </FieldGroup>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </EditorCard>
  );
}

type SummaryPanelProps = {
  draft: ResumeDraft;
  isActive: boolean;
  isDirty: boolean;
  onRequestOpen: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  onSave: (summary: SummarySection) => void;
};

function SummaryPanel({
  draft,
  isActive,
  isDirty,
  onRequestOpen,
  onDirtyChange,
  onSave,
}: SummaryPanelProps) {
  const summaryForm = useForm<SummarySection>({
    resolver: createSchemaResolver<SummarySection>(summarySectionSchema),
    defaultValues: draft.sections.summary,
  });
  const { control, handleSubmit, reset, formState, setValue } = summaryForm;
  const lastDirtyRef = useRef(formState.isDirty);
  const currentOrder = useWatch({
    control,
    name: "order",
  });

  useEffect(() => {
    reset(draft.sections.summary);
  }, [draft.sections.summary, reset]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    if (lastDirtyRef.current === formState.isDirty) {
      return;
    }

    lastDirtyRef.current = formState.isDirty;
    onDirtyChange(formState.isDirty);
  }, [formState.isDirty, isActive, onDirtyChange]);

  return (
    <EditorCard
      isActive={isActive}
      isDirty={isDirty}
      icon={<FileTextIcon data-icon="inline-start" />}
      title="Summary"
      description="A concise, recruiter-first introduction below the header."
      onRequestOpen={onRequestOpen}
      footerActions={
        <>
          <Button type="button" variant="outline" onClick={() => reset(draft.sections.summary)}>
            <SquareXIcon data-icon="inline-start" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit((values) => {
              onSave(values);
              reset(values);
              toast.success("Summary saved.");
            })}
          >
            <SaveIcon data-icon="inline-start" />
            Save Section
          </Button>
        </>
      }
    >
      <FieldGroup>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="summary-visible">Show summary</FieldLabel>
          <Controller
            control={control}
            name="visible"
            render={({ field }) => (
              <Switch
                id="summary-visible"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </Field>
        <Field>
          <FieldLabel>Section order</FieldLabel>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setValue(
                  "order",
                  nextOrderValue(currentOrder ?? 0, -1, Object.keys(draft.sections).length - 1),
                  { shouldDirty: true }
                )
              }
            >
              Move up
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setValue(
                  "order",
                  nextOrderValue(currentOrder ?? 0, 1, Object.keys(draft.sections).length - 1),
                  { shouldDirty: true }
                )
              }
            >
              Move down
            </Button>
            <Badge variant="secondary">Order {(currentOrder ?? 0) + 1}</Badge>
          </div>
        </Field>
        <Field>
          <FieldLabel>Summary content</FieldLabel>
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>
      </FieldGroup>
    </EditorCard>
  );
}

type CollectionSectionPanelProps = {
  draft: ResumeDraft;
  sectionKey: CollectionSectionKey;
  isActive: boolean;
  isDirty: boolean;
  onRequestOpen: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  onSave: (
    sectionValue: ResumeDraft["sections"][CollectionSectionKey]
  ) => void;
};

function CollectionSectionPanel({
  draft,
  sectionKey,
  isActive,
  isDirty,
  onRequestOpen,
  onDirtyChange,
  onSave,
}: CollectionSectionPanelProps) {
  const config = collectionSectionConfigs[sectionKey];
  const sectionValue = draft.sections[sectionKey];
  const form = useForm<ResumeDraft["sections"][CollectionSectionKey]>({
    resolver: createSchemaResolver<ResumeDraft["sections"][CollectionSectionKey]>(
      sectionSchemaMap[sectionKey]
    ),
    defaultValues: sectionValue,
  });
  const { control, handleSubmit, register, reset, formState, watch, setValue } = form;
  const lastDirtyRef = useRef(formState.isDirty);
  const currentOrder = useWatch({
    control,
    name: "order",
  });
  const currentItems = useWatch({
    control,
    name: "items",
  });
  const items = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    reset(sectionValue);
  }, [reset, sectionValue]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    if (lastDirtyRef.current === formState.isDirty) {
      return;
    }

    lastDirtyRef.current = formState.isDirty;
    onDirtyChange(formState.isDirty);
  }, [formState.isDirty, isActive, onDirtyChange]);

  return (
    <EditorCard
      isActive={isActive}
      isDirty={isDirty}
      icon={createCollectionSectionIcon(sectionKey)}
      title={config.title}
      description={config.description}
      onRequestOpen={onRequestOpen}
      footerActions={
        <>
          <Button type="button" variant="outline" onClick={() => reset(sectionValue)}>
            <SquareXIcon data-icon="inline-start" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit((values) => {
              onSave(values);
              reset(values);
              toast.success(`${config.title} saved.`);
            })}
          >
            <SaveIcon data-icon="inline-start" />
            Save Section
          </Button>
        </>
      }
    >
      <FieldGroup>
        <Field orientation="horizontal">
          <FieldLabel htmlFor={`${sectionKey}-visible`}>Show section</FieldLabel>
          <Controller
            control={control}
            name="visible"
            render={({ field }) => (
              <Switch
                id={`${sectionKey}-visible`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </Field>
        <Field>
          <FieldLabel>Section order</FieldLabel>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setValue(
                  "order",
                  nextOrderValue(currentOrder ?? 0, -1, Object.keys(draft.sections).length - 1),
                  { shouldDirty: true }
                )
              }
            >
              Move up
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setValue(
                  "order",
                  nextOrderValue(currentOrder ?? 0, 1, Object.keys(draft.sections).length - 1),
                  { shouldDirty: true }
                )
              }
            >
              Move down
            </Button>
            <Badge variant="secondary">Order {(currentOrder ?? 0) + 1}</Badge>
          </div>
        </Field>
      </FieldGroup>

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {(currentItems?.length ?? 0)} item{(currentItems?.length ?? 0) === 1 ? "" : "s"}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              items.append(
                cloneDraft(config.createItem()) as ResumeDraft["sections"][CollectionSectionKey]["items"][number]
              )
            }
          >
            <PlusIcon data-icon="inline-start" />
            {config.addLabel}
          </Button>
        </div>

        {items.fields.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                {createCollectionSectionIcon(sectionKey)}
              </EmptyMedia>
              <EmptyTitle>{config.emptyTitle}</EmptyTitle>
              <EmptyDescription>{config.emptyDescription}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  items.append(
                    cloneDraft(config.createItem()) as ResumeDraft["sections"][CollectionSectionKey]["items"][number]
                  )
                }
              >
                <PlusIcon data-icon="inline-start" />
                {config.addLabel}
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="flex flex-col gap-4">
            {items.fields.map((field, index) => (
              <Card key={field.id} size="sm">
                <CardHeader>
                  <CardTitle>{config.addLabel.replace("Add ", "")} {index + 1}</CardTitle>
                  <CardAction className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => index > 0 && items.move(index, index - 1)}
                    >
                      Move up
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        index < items.fields.length - 1 && items.move(index, index + 1)
                      }
                    >
                      Move down
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => items.remove(index)}
                    >
                      <Trash2Icon data-icon="inline-start" />
                      Remove
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <RenderCollectionItemFields
                    config={config}
                    control={control}
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    index={index}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </EditorCard>
  );
}

type EditorCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  isDirty: boolean;
  onRequestOpen: () => void;
  footerActions: React.ReactNode;
  children: React.ReactNode;
};

function EditorCard({
  icon,
  title,
  description,
  isActive,
  isDirty,
  onRequestOpen,
  footerActions,
  children,
}: EditorCardProps) {
  return (
    <Collapsible open={isActive}>
      <Card className={cn(isActive ? "ring-primary/25" : undefined)}>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2 text-muted-foreground">{icon}</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{title}</CardTitle>
                {isDirty ? <Badge>Unsaved</Badge> : null}
              </div>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <CardAction>
            <CollapsibleTrigger
              className="inline-flex rounded-lg border border-input px-3 py-2 text-sm font-medium"
              onClick={onRequestOpen}
            >
              {isActive ? "Editing" : "Open"}
            </CollapsibleTrigger>
          </CardAction>
        </CardHeader>

        {isActive ? (
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-5">{children}</CardContent>
            <div className="flex flex-wrap items-center justify-end gap-2 border-t bg-muted/30 px-4 py-3">
              {footerActions}
            </div>
          </CollapsibleContent>
        ) : null}
      </Card>
    </Collapsible>
  );
}

type RenderCollectionItemFieldsProps = {
  config: (typeof collectionSectionConfigs)[CollectionSectionKey];
  control: UseFormReturn<ResumeDraft["sections"][CollectionSectionKey]>["control"];
  register: UseFormReturn<ResumeDraft["sections"][CollectionSectionKey]>["register"];
  watch: UseFormReturn<ResumeDraft["sections"][CollectionSectionKey]>["watch"];
  setValue: UseFormReturn<ResumeDraft["sections"][CollectionSectionKey]>["setValue"];
  index: number;
};

function RenderCollectionItemFields({
  config,
  control,
  register,
  watch,
  setValue,
  index,
}: RenderCollectionItemFieldsProps) {
  return (
    <FieldGroup>
      {config.fields.map((fieldConfig) => {
        if (fieldConfig.kind === "text" || fieldConfig.kind === "email" || fieldConfig.kind === "url" || fieldConfig.kind === "monthYear") {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;
          return (
            <Field key={fieldName}>
              <FieldLabel htmlFor={fieldName}>{fieldConfig.label}</FieldLabel>
              <Input
                id={fieldName}
                type={fieldConfig.kind === "monthYear" ? "text" : fieldConfig.kind}
                placeholder={fieldConfig.placeholder ?? (fieldConfig.kind === "monthYear" ? "Apr 2025" : undefined)}
                {...register(fieldName as never)}
              />
            </Field>
          );
        }

        if (fieldConfig.kind === "textarea") {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;
          return (
            <Field key={fieldName}>
              <FieldLabel htmlFor={fieldName}>{fieldConfig.label}</FieldLabel>
              <Textarea
                id={fieldName}
                rows={3}
                placeholder={fieldConfig.placeholder}
                {...register(fieldName as never)}
              />
            </Field>
          );
        }

        if (fieldConfig.kind === "richText") {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;
          return (
            <Field key={fieldName}>
              <FieldLabel>{fieldConfig.label}</FieldLabel>
              <Controller
                control={control}
                name={fieldName as never}
                render={({ field }) => (
                  <RichTextEditor value={field.value} onChange={field.onChange} />
                )}
              />
            </Field>
          );
        }

        if (fieldConfig.kind === "stringArray") {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;
          return (
            <Field key={fieldName}>
              <FieldLabel htmlFor={fieldName}>{fieldConfig.label}</FieldLabel>
              <Controller
                control={control}
                name={fieldName as never}
                render={({ field }) => (
                  <Textarea
                    id={fieldName}
                    rows={3}
                    placeholder={fieldConfig.placeholder}
                    value={
                      Array.isArray(field.value)
                        ? (field.value as string[]).join(", ")
                        : ""
                    }
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          .split(",")
                          .map((value) => value.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                )}
              />
              <FieldDescription>Separate each item with a comma.</FieldDescription>
            </Field>
          );
        }

        if (fieldConfig.kind === "dateRange") {
          const startName = `items.${index}.${fieldConfig.startName}` as const;
          const endName = `items.${index}.${fieldConfig.endName}` as const;
          const endValue = watch(endName as never) as unknown as string;
          const isCurrent = endValue === "current";

          return (
            <div key={`${startName}-${endName}`} className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={startName}>{fieldConfig.label} start</FieldLabel>
                <Input id={startName} placeholder="Apr 2025" {...register(startName as never)} />
              </Field>
              <Field>
                <FieldLabel htmlFor={endName}>{fieldConfig.label} end</FieldLabel>
                <Input
                  id={endName}
                  placeholder="Apr 2026"
                  disabled={isCurrent}
                  {...register(endName as never)}
                />
                <div className="mt-2 flex items-center gap-2">
                  <Switch
                    checked={isCurrent}
                    onCheckedChange={(checked) =>
                      setValue(endName as never, (checked ? "current" : "") as never, {
                        shouldDirty: true,
                      })
                    }
                  />
                  <span className="text-sm text-muted-foreground">Current</span>
                </div>
              </Field>
            </div>
          );
        }

        if (fieldConfig.kind === "proficiency") {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;
          return (
            <Field key={fieldName}>
              <FieldLabel>{fieldConfig.label}</FieldLabel>
              <Controller
                control={control}
                name={fieldName as never}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {languageProficiencyOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          );
        }

        return null;
      })}
    </FieldGroup>
  );
}
