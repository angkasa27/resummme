import { createPreviewRenderContext } from "@/features/resume-editor/preview/engine";
import { PreviewDocumentRoot } from "@/features/resume-editor/preview/kit/document-root";
import { getPreviewLayoutDefinition } from "@/features/resume-editor/preview/layout-registry";
import { getPreviewProfileLayoutDefinition } from "@/features/resume-editor/preview/profile-layout-registry";
import type {
  PreviewRendererProps,
} from "@/features/resume-editor/preview/types";
import { cn } from "@/lib/utils";

export function ResumeDocument({
  draft,
  className,
  mode = "preview",
}: PreviewRendererProps) {
  const context = createPreviewRenderContext(draft, mode);
  const layout = getPreviewLayoutDefinition(context.presentation.layoutId);
  const profileLayout = getPreviewProfileLayoutDefinition(
    context.presentation.profileLayoutId,
  );
  const itemRenderers = layout.createSectionItemRenderers(context);

  return (
    <PreviewDocumentRoot context={context} className={cn(className)}>
      <profileLayout.Header context={context} />
      <layout.Body
        context={context}
        summaryContent={context.summaryContent}
        sections={context.sections}
        itemRenderers={itemRenderers}
      />
    </PreviewDocumentRoot>
  );
}
