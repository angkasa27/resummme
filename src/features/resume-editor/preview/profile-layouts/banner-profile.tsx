import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import { PreviewHeaderPhoto } from "@/features/resume-editor/preview/kit/header-photo";
import type { PreviewProfileLayoutDefinition } from "@/features/resume-editor/preview/types";

export const bannerProfileLayout: PreviewProfileLayoutDefinition = {
  id: "banner-profile",
  Header: ({ context }) => {
    const { draft, presentation } = context;
    const bannerContext = {
      ...context,
      presentation: {
        ...presentation,
        mutedTextColor: "rgba(255, 255, 255, 0.85)",
      },
    };

    return (
      <header
        data-layout={presentation.layoutId}
        data-profile-layout="banner-profile"
        className="flex items-center justify-between gap-6 rounded-md"
        style={{
          backgroundColor: presentation.accentColor,
          color: "#ffffff",
          padding: "20px 24px",
        }}
      >
        <div className="flex flex-1 flex-col">
          <h1
            data-testid="resume-preview-full-name"
            className="tracking-[-0.03em]"
            style={{
              fontFamily: presentation.headingFontFamily,
              fontSize: `${presentation.nameFontSizePx}px`,
              fontWeight: presentation.headingWeight,
              lineHeight: "1.1",
              color: "#ffffff",
            }}
          >
            {draft.profile.fullName}
          </h1>
          <PreviewContactLine context={bannerContext} />
        </div>
        {draft.profile.photo ? (
          <PreviewHeaderPhoto
            src={draft.profile.photo}
            alt={draft.profile.fullName}
            className="h-20 w-20 shrink-0 overflow-hidden rounded-full"
          />
        ) : null}
      </header>
    );
  },
};
