import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type { TemplateHeaderProps } from "@/features/resume-editor/preview/template-types";

/**
 * The photo-left header shared byte-for-byte by classic/inset/minimal/timeline:
 * optional photo frame, then name + contact line. Each template passes its own
 * `styles` module and `data-template` value; emitted markup is unchanged.
 */
export function createPhotoHeader({
  dataTemplate,
  styles,
}: {
  dataTemplate: string;
  styles: Readonly<Record<string, string>>;
}) {
  return function PhotoHeader({ context }: TemplateHeaderProps) {
    const { draft } = context;
    return (
      <header
        className={`${styles.header} layout-header`}
        data-template={dataTemplate}
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
          <PreviewContactLine context={context} />
        </div>
      </header>
    );
  };
}
