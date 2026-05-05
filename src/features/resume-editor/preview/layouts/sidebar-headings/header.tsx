import {
  PreviewContactLine,
} from "@/features/resume-editor/preview/kit/contact-line";
import { PreviewHeaderPhoto } from "@/features/resume-editor/preview/kit/header-photo";
import type { PreviewRenderContext } from "@/features/resume-editor/preview/types";

export function sidebarHeader(context: PreviewRenderContext) {
  const { draft, presentation } = context;

  return (
    <header
      data-layout={presentation.layoutId}
      className="flex items-start justify-between gap-6 border-b pb-5"
    >
      <div className="flex flex-1 items-center gap-6">
        <PreviewHeaderPhoto
          src={draft.profile.photo}
          alt={draft.profile.fullName}
          className="h-24 w-18 shrink-0"
        />
        <div className="flex-1">
          <h1
            data-testid="resume-preview-full-name"
            className="tracking-[-0.03em]"
            style={{
              fontFamily: presentation.headingFontFamily,
              fontSize: `${presentation.nameFontSizePx}px`,
              fontWeight: presentation.headingWeight,
              lineHeight: "1.1",
              color: presentation.accentColor,
            }}
          >
            {draft.profile.fullName}
          </h1>
          <PreviewContactLine context={context} />
        </div>
      </div>
    </header>
  );
}
