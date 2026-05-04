import { cn } from "@/lib/utils";

export function PreviewHeaderPhoto({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return null;
  }

  return (
    <div
      data-slot="photo-frame"
      className={cn("overflow-hidden rounded-md", className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}