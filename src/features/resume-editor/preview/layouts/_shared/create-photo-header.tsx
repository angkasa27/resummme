import {
  PreviewContactLine,
  type ContactPresentation,
} from "@/features/resume-editor/preview/kit/contact-line";
import type { LayoutHeaderProps } from "@/features/resume-editor/preview/layout-types";

/**
 * The photo-left header shared by classic/inset/minimal/timeline/sidebar:
 * optional photo frame, then name + contact line. Each layout passes its own
 * `styles` module and `data-layout` value, and may tune how its contacts read.
 */
export function createPhotoHeader({
  dataLayout,
  styles,
  contact,
}: {
  dataLayout: string;
  styles: Readonly<Record<string, string>>;
  contact?: ContactPresentation;
}) {
  return function PhotoHeader({ context }: LayoutHeaderProps) {
    const { draft } = context;
    return (
      <header
        className={`${styles.header} layout-header`}
        data-layout={dataLayout}
      >
        {draft.profile.photo ? (
          <div className="header-photo" data-slot="photo-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={draft.profile.photo} alt={draft.profile.fullName} />
          </div>
        ) : null}
        <div className="header-body">
          <h1 className="name" data-testid="resume-preview-full-name">
            {draft.profile.fullName}
          </h1>
          <PreviewContactLine context={context} presentation={contact} />
        </div>
      </header>
    );
  };
}
