import {
  PreviewContactLine,
} from "@/features/resume-editor/preview/kit/contact-line";
import { PreviewHeaderPhoto } from "@/features/resume-editor/preview/kit/header-photo";
import type { PreviewProfileLayoutDefinition } from "@/features/resume-editor/preview/types";

export const centeredPortraitProfileLayout: PreviewProfileLayoutDefinition = {
  id: "centered-portrait-profile",
  Header: ({ context }) => {
    const { draft, presentation } = context;

    return (
      <header
        data-layout={presentation.layoutId}
        data-profile-layout="centered-portrait-profile"
        className="flex flex-col items-center gap-3 text-center"
      >
        <PreviewHeaderPhoto
          src={draft.profile.photo}
          alt={draft.profile.fullName}
          className="h-24 w-18"
        />
        <div className="w-full">
          <h1
            data-testid="resume-preview-full-name"
            className="text-balance tracking-[-0.03em]"
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
          <PreviewContactLine context={context} centered />
        </div>
      </header>
    );
  },
};
