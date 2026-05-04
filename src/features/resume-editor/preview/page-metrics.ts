export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
export const PAGE_PADDING_MM = 12;
export const SCREEN_PAGE_GAP_PX = 24;
export const PREVIEW_HORIZONTAL_PADDING_PX = 32;
export const PX_PER_MM = 96 / 25.4;

export function mmToPx(value: number) {
  return value * PX_PER_MM;
}

export const A4_WIDTH_PX = mmToPx(A4_WIDTH_MM);
export const A4_HEIGHT_PX = mmToPx(A4_HEIGHT_MM);
export const PAGE_CONTENT_WIDTH_PX = mmToPx(A4_WIDTH_MM - PAGE_PADDING_MM * 2);
export const PAGE_CONTENT_HEIGHT_PX = mmToPx(
  A4_HEIGHT_MM - PAGE_PADDING_MM * 2
);
