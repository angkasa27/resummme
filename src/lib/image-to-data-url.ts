export const PROFILE_PHOTO_MAX_DIMENSION = 512;
export const PROFILE_PHOTO_QUALITY = 0.85;
export const PROFILE_PHOTO_MAX_BYTES = 8 * 1024 * 1024;

export type ReadProfilePhotoError =
  | "unsupported-type"
  | "too-large"
  | "decode-failed"
  | "encode-failed";

export class ProfilePhotoError extends Error {
  readonly kind: ReadProfilePhotoError;

  constructor(kind: ReadProfilePhotoError, message: string) {
    super(message);
    this.kind = kind;
  }
}

export async function readProfilePhotoAsDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new ProfilePhotoError(
      "unsupported-type",
      "Please choose an image file (PNG, JPG, WEBP).",
    );
  }
  if (file.size > PROFILE_PHOTO_MAX_BYTES) {
    throw new ProfilePhotoError(
      "too-large",
      "Image is too large. Choose a file under 8 MB.",
    );
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadHtmlImage(objectUrl);
    const { width, height } = fitWithin(
      image.naturalWidth || image.width,
      image.naturalHeight || image.height,
      PROFILE_PHOTO_MAX_DIMENSION,
    );
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new ProfilePhotoError(
        "encode-failed",
        "Could not process the image. Try a different file.",
      );
    }
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", PROFILE_PHOTO_QUALITY);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(
        new ProfilePhotoError(
          "decode-failed",
          "Could not read the image. Try a different file.",
        ),
      );
    image.src = src;
  });
}

function fitWithin(width: number, height: number, max: number) {
  if (width <= max && height <= max) {
    return { width, height };
  }
  const scale = width >= height ? max / width : max / height;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}
