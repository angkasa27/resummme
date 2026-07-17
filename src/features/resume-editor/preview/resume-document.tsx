import type { ReactNode } from "react";

import { createPreviewRenderContext } from "@/features/resume-editor/preview/engine";
import { PreviewDocumentRoot } from "@/features/resume-editor/preview/kit/document-root";
import { PreviewSectionTarget } from "@/features/resume-editor/preview/kit/section-target";
import {
  getLayout,
  renderLayoutHeader,
  shouldHideSummaryHeading,
} from "@/features/resume-editor/preview/layout-registry";
import { LayoutSection } from "@/features/resume-editor/preview/layout-section";
import { SummaryView } from "@/features/resume-editor/preview/sections/summary";
import type { PreviewRendererProps } from "@/features/resume-editor/preview/types";
import type { LayoutSlots } from "@/features/resume-editor/preview/layout-types";
import {
  sectionLabels,
  type EditorPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";

type ResumeDocumentProps = PreviewRendererProps & {
  /**
   * Turns each slot into a click target that opens its section in the editor.
   * Omitted by the read-only surfaces (mobile preview, template cards, PDF), so
   * they render exactly the printed document and nothing more.
   */
  onSelectSection?: (panel: EditorPanelKey) => void;
  /** The section currently open in the editor, marked on the paper. */
  activeSection?: EditorPanelKey | null;
};

export function ResumeDocument({
  draft,
  className,
  mode = "preview",
  onSelectSection,
  activeSection,
}: ResumeDocumentProps) {
  const context = createPreviewRenderContext(draft, mode);
  const layout = getLayout(context.presentation.layoutId);

  const hideSummaryHeading = shouldHideSummaryHeading(
    context.presentation.layoutId,
  );

  // Read-only surfaces pass no handler and get the bare document back.
  function target(panel: EditorPanelKey, label: string, node: ReactNode) {
    if (!onSelectSection) return node;
    return (
      <PreviewSectionTarget
        panel={panel}
        label={label}
        isActive={activeSection === panel}
        onSelect={onSelectSection}
      >
        {node}
      </PreviewSectionTarget>
    );
  }

  const slots: LayoutSlots = {
    header: target("profile", "Profile", renderLayoutHeader(context)),
    summary: context.summaryContent
      ? target(
          "summary",
          sectionLabels.summary,
          <SummaryView
            content={context.summaryContent}
            showHeading={!hideSummaryHeading}
          />,
        )
      : null,
    // `section.key` and `section` co-vary at runtime, but TS can't prove that
    // across the union element, so assert the entry type once here (the single
    // central place slots are built) rather than casting in every layout.
    sections: context.sections.map(
      (section) =>
        ({
          key: section.key,
          section,
          node: target(
            section.key,
            section.label,
            <LayoutSection layout={layout} section={section} />,
          ),
        }) as LayoutSlots["sections"][number],
    ),
  };

  return (
    <PreviewDocumentRoot context={context} className={className}>
      <layout.Component context={context} slots={slots} />
    </PreviewDocumentRoot>
  );
}
