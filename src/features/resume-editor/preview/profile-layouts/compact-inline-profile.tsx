import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type { PreviewProfileLayoutDefinition } from "@/features/resume-editor/preview/types";

export const compactInlineProfileLayout: PreviewProfileLayoutDefinition = {
  id: "compact-inline-profile",
  Header: ({ context }) => {
    const { draft, presentation } = context;

    return (
      <header
        data-layout={presentation.layoutId}
        data-profile-layout="compact-inline-profile"
        className="flex flex-col gap-1 pb-3"
        style={{ borderBottom: `1px solid ${presentation.itemBorderColor}` }}
      >
        <h1
          data-testid="resume-preview-full-name"
          className="tracking-[-0.02em]"
          style={{
            fontFamily: presentation.headingFontFamily,
            fontSize: `${Number((presentation.nameFontSizePx * 0.85).toFixed(2))}px`,
            fontWeight: presentation.headingWeight,
            lineHeight: "1.1",
            color: presentation.bodyTextColor,
          }}
        >
          {draft.profile.fullName}
        </h1>
        <PreviewContactLine context={context} />
      </header>
    );
  },
};
