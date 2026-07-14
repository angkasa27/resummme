"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";

type UsePreviewScaleOptions = {
  sheetRef: RefObject<HTMLDivElement | null>;
  viewportRef: RefObject<HTMLDivElement | null>;
  watchValues: unknown[];
};

function computePreviewScale(
  viewport: HTMLDivElement,
  sheet: HTMLDivElement,
): { scale: number; width: number; height: number } | null {
  const computedStyles = window.getComputedStyle(viewport);
  const horizontalPadding =
    Number.parseFloat(computedStyles.paddingLeft || "0") +
    Number.parseFloat(computedStyles.paddingRight || "0");
  const viewportWidth = Math.max(0, viewport.clientWidth - horizontalPadding);
  const sheetWidth = sheet.offsetWidth;
  const sheetHeight = sheet.offsetHeight;

  if (!viewportWidth || !sheetWidth || !sheetHeight) return null;

  const scale = Math.min(1, viewportWidth / sheetWidth);
  return { scale, width: sheetWidth * scale, height: sheetHeight * scale };
}

export function usePreviewScale({
  sheetRef,
  viewportRef,
  watchValues,
}: UsePreviewScaleOptions) {
  const watchKey = JSON.stringify(watchValues);
  const [previewScale, setPreviewScale] = useState(1);
  const [previewShellSize, setPreviewShellSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updatePreviewScale = () => {
      const viewport = viewportRef.current;
      const sheet = sheetRef.current;

      if (!viewport || !sheet) {
        return;
      }

      const result = computePreviewScale(viewport, sheet);
      if (!result) return;

      setPreviewScale(result.scale);
      setPreviewShellSize({ width: result.width, height: result.height });
    };

    updatePreviewScale();

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(updatePreviewScale);

      if (viewportRef.current) {
        resizeObserver.observe(viewportRef.current);
      }

      if (sheetRef.current) {
        resizeObserver.observe(sheetRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }

    window.addEventListener("resize", updatePreviewScale);
    return () => {
      window.removeEventListener("resize", updatePreviewScale);
    };
  }, [sheetRef, viewportRef, watchKey]);

  return {
    previewScale,
    previewShellSize,
  };
}
