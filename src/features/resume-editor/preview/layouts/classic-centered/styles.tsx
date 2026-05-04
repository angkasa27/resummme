import type { CSSProperties, ReactNode } from "react";

import type { ResolvedPdfPresentation } from "@/lib/resume/pdf-presentation";

export type ClassicItemStyles = {
  item: CSSProperties;
  header: CSSProperties;
  itemTitle: CSSProperties;
  itemSubTitle: CSSProperties;
  itemMeta: CSSProperties;
  itemDate: CSSProperties;
  itemDateMuted: CSSProperties;
  richText: CSSProperties;
  classicBody: CSSProperties;
  classicSectionInset: CSSProperties;
  splitRow: CSSProperties;
};

export function createClassicItemStyles(
  presentation: ResolvedPdfPresentation,
): ClassicItemStyles {
  return {
    item: {
      display: "flex",
      flexDirection: "column",
      gap: `${presentation.sectionBodyGapPx}px`,
    },
    header: {
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
    itemSubTitle: {
      fontFamily: presentation.headingFontFamily,
      fontSize: `${presentation.metaFontSizePx}px`,
      fontWeight: 700,
      lineHeight: String(presentation.bodyLineHeight),
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
      fontWeight: 700,
      lineHeight: String(presentation.bodyLineHeight),
      color: presentation.bodyTextColor,
    },
    itemDateMuted: {
      textAlign: "right",
      fontSize: `${presentation.metaFontSizePx}px`,
      fontWeight: 700,
      lineHeight: String(presentation.bodyLineHeight),
      color: presentation.bodyTextColor,
    },
    richText: {
      fontSize: `${presentation.metaFontSizePx}px`,
      lineHeight: String(presentation.bodyLineHeight),
      color: presentation.bodyTextColor,
      textAlign: "justify",
    },
    classicBody: {
      paddingLeft: "18px",
      paddingRight: "12px",
    },
    classicSectionInset: {
      paddingLeft: "8px",
    },
    splitRow: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: "12px",
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