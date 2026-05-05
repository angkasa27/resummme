import type { CSSProperties, ReactNode } from "react";

import type { ResolvedPdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";

export type SidebarItemStyles = {
  item: CSSProperties;
  itemHeader: CSSProperties;
  itemTitle: CSSProperties;
  itemMeta: CSSProperties;
  itemDate: CSSProperties;
  richText: CSSProperties;
  splitRow: CSSProperties;
};

export function createSidebarItemStyles(
  presentation: ResolvedPdfPresentation,
): SidebarItemStyles {
  return {
    item: {
      display: "flex",
      flexDirection: "column",
      gap: `${presentation.sectionBodyGapPx}px`,
      paddingBottom: `${presentation.itemPaddingBottomPx}px`,
      borderBottom: `1px solid ${presentation.itemBorderColor}`,
    },
    itemHeader: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
      alignItems: "start",
      gap: "12px",
    },
    itemTitle: {
      fontFamily: presentation.headingFontFamily,
      fontSize: `${presentation.titleFontSizePx}px`,
      fontWeight: presentation.headingWeight,
      lineHeight: String(presentation.titleLineHeight),
      color: presentation.bodyTextColor,
    },
    itemMeta: {
      fontSize: `${presentation.metaFontSizePx}px`,
      lineHeight: String(presentation.bodyLineHeight),
      color: presentation.mutedTextColor,
    },
    itemDate: {
      textAlign: "right",
      fontSize: `${presentation.dateFontSizePx}px`,
      fontWeight: 600,
      lineHeight: String(presentation.bodyLineHeight),
      color: presentation.mutedTextColor,
    },
    richText: {
      fontSize: `${presentation.metaFontSizePx}px`,
      lineHeight: String(presentation.bodyLineHeight),
      color: presentation.bodyTextColor,
      textAlign: "justify",
    },
    splitRow: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: "12px",
      paddingBottom: `${Math.max(12, presentation.itemPaddingBottomPx - 4)}px`,
      borderBottom: `1px solid ${presentation.itemBorderColor}`,
    },
  };
}

export function itemContainer(
  key: string,
  style: CSSProperties,
  children: ReactNode,
) {
  return (
    <div
      key={key}
      className="flex flex-col last:border-b-0 last:pb-0"
      style={style}
    >
      {children}
    </div>
  );
}