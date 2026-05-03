"use client";

import { useEffect, useRef, useState } from "react";
import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import type { ResumeDraft } from "@/lib/resume/schema";

type PreviewPaneProps = {
  draft: ResumeDraft;
};

export function PreviewPane({ draft }: PreviewPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      // 210mm is roughly 794px at 96 DPI.
      const A4_WIDTH_PX = 794;
      const PADDING = 32; 
      const availableWidth = width - PADDING;
      
      if (availableWidth < A4_WIDTH_PX) {
        setScale(availableWidth / A4_WIDTH_PX);
      } else {
        setScale(1);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="h-full min-h-0 overflow-y-auto overflow-x-hidden print:h-auto print:overflow-visible print:bg-transparent"
    >
      <div 
        className="flex justify-center py-4 sm:py-6"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          // Provide an approximation of the scaled height to prevent huge scrollable empty space
          marginBottom: `calc(-100% * ${1 - scale})`
        }}
      >
        <ResumeDocument 
          draft={draft} 
          className="w-[210mm] min-w-[210mm] max-w-[210mm]" 
        />
      </div>
    </div>
  );
}
