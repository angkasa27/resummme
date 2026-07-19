"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { createLocalId } from "@/features/resume-editor/domain/create-local-id";
import { profileSchema } from "@/features/resume-editor/domain/schema";
import { createFormSchemaResolver } from "@/features/resume-editor/forms/schemas/create-form-schema-resolver";
import { useSyncedFormValues } from "@/features/resume-editor/forms/use-synced-form-values";
import { loadImageFile, ProfilePhotoError } from "@/lib/image-to-data-url";
import type { Profile, ResumeDraft } from "@/features/resume-editor/domain/schema";

type CropState = {
  open: boolean;
  imageUrl: string | null;
  image: HTMLImageElement | null;
};

const CLOSED_CROP: CropState = { open: false, imageUrl: null, image: null };

/**
 * Owns all profile-form state shared between the classic and canvas editors:
 * the RHF form, the links field-array, the photo upload→crop flow, and the
 * delete-link confirmation. The presentational `ProfileFields` renders from it;
 * each editor supplies its own shell + save lifecycle (auto-save vs submit).
 */
export function useProfileForm(draft: ResumeDraft) {
  const form = useForm<Profile>({
    resolver: createFormSchemaResolver<Profile>(profileSchema),
    defaultValues: draft.profile,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { control, setValue } = form;

  useSyncedFormValues(form, draft.profile);

  const extraLinks = useFieldArray({
    control,
    name: "extraLinks",
    keyName: "fieldKey",
  });
  const photoUrl = useWatch({ control, name: "photo" });

  const [crop, setCrop] = useState<CropState>(CLOSED_CROP);
  const [pendingDeleteLinkIndex, setPendingDeleteLinkIndex] = useState<
    number | null
  >(null);

  function closeCrop() {
    setCrop((current) => {
      if (current.imageUrl) URL.revokeObjectURL(current.imageUrl);
      return CLOSED_CROP;
    });
  }

  async function handlePhotoFile(file: File | null | undefined) {
    if (!file) return;
    try {
      const { objectUrl, image } = await loadImageFile(file);
      setCrop({ open: true, imageUrl: objectUrl, image });
    } catch (error) {
      toast.error(
        error instanceof ProfilePhotoError
          ? error.message
          : "Could not read that image.",
      );
    }
  }

  // Programmatic picker (no persistent ref) — opens the OS file dialog and
  // routes the chosen file into the crop flow.
  function openPhotoPicker() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp,image/gif";
    input.addEventListener("change", () => {
      void handlePhotoFile(input.files?.[0]);
    });
    input.click();
  }

  function applyCrop(dataUrl: string) {
    setValue("photo", dataUrl, { shouldDirty: true, shouldValidate: true });
    closeCrop();
  }

  function removePhoto() {
    setValue("photo", "", { shouldDirty: true, shouldValidate: true });
  }

  function addLink() {
    extraLinks.append({ id: createLocalId("extra-link"), url: "" });
  }

  function confirmDeleteLink() {
    if (pendingDeleteLinkIndex !== null)
      extraLinks.remove(pendingDeleteLinkIndex);
    setPendingDeleteLinkIndex(null);
  }

  return {
    form,
    extraLinks,
    photo: {
      url: photoUrl,
      openPicker: openPhotoPicker,
      handleFile: handlePhotoFile,
      remove: removePhoto,
      crop,
      applyCrop,
      cancelCrop: closeCrop,
    },
    links: {
      add: addLink,
      pendingDeleteIndex: pendingDeleteLinkIndex,
      requestDelete: setPendingDeleteLinkIndex,
      confirmDelete: confirmDeleteLink,
      cancelDelete: () => setPendingDeleteLinkIndex(null),
    },
  };
}

export type ProfileFormContext = ReturnType<typeof useProfileForm>;
