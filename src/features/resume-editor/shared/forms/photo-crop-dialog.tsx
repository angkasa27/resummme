"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  cropImageToDataUrl,
  ProfilePhotoError,
  type CropArea,
} from "@/lib/image-to-data-url";

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;

type PhotoCropDialogProps = {
  open: boolean;
  /** Object URL of the picked file, shown in the cropper. */
  imageUrl: string | null;
  /** The decoded image, cropped on apply (avoids reloading). */
  image: HTMLImageElement | null;
  /** Crop aspect ratio; 1 = square (default, works with every template frame). */
  aspect?: number;
  onApply: (dataUrl: string) => void;
  onCancel: () => void;
};

/**
 * Square crop + zoom editor for the profile photo. The cropped region is
 * downscaled and JPEG-encoded by `cropImageToDataUrl`.
 */
export function PhotoCropDialog({
  open,
  imageUrl,
  image,
  aspect = 1,
  onApply,
  onCancel,
}: PhotoCropDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust photo</DialogTitle>
          <DialogDescription>
            Drag to reposition and use the slider to zoom.
          </DialogDescription>
        </DialogHeader>

        {imageUrl && image ? (
          // Keyed by the source image so crop/zoom reset cleanly per upload.
          <CropEditor
            key={imageUrl}
            imageUrl={imageUrl}
            image={image}
            aspect={aspect}
            onApply={onApply}
            onCancel={onCancel}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function CropEditor({
  imageUrl,
  image,
  aspect,
  onApply,
  onCancel,
}: {
  imageUrl: string;
  image: HTMLImageElement;
  aspect: number;
  onApply: (dataUrl: string) => void;
  onCancel: () => void;
}) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(ZOOM_MIN);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);

  const handleCropComplete = useCallback((_area: Area, pixels: Area) => {
    setAreaPixels(pixels);
  }, []);

  function handleApply() {
    if (!areaPixels) return;
    try {
      onApply(cropImageToDataUrl(image, areaPixels as CropArea));
    } catch (error) {
      toast.error(
        error instanceof ProfilePhotoError
          ? error.message
          : "Could not process the image. Try a different file.",
      );
    }
  }

  return (
    <>
      <div className="relative h-64 w-full overflow-hidden rounded-md bg-muted">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape="rect"
          showGrid={false}
          minZoom={ZOOM_MIN}
          maxZoom={ZOOM_MAX}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-muted-foreground">Zoom</span>
        <Slider
          aria-label="Zoom"
          value={zoom}
          min={ZOOM_MIN}
          max={ZOOM_MAX}
          step={0.01}
          onValueChange={(value) =>
            setZoom(Array.isArray(value) ? value[0] : value)
          }
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleApply} disabled={!areaPixels}>
          Apply
        </Button>
      </DialogFooter>
    </>
  );
}
