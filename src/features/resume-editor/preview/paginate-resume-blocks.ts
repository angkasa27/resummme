export type ResumeLayoutBlock = {
  key: string;
  height: number;
  splittable: boolean;
};

export function paginateResumeBlocks(
  blocks: ResumeLayoutBlock[],
  pageHeight: number
) {
  const pages: string[][] = [];
  let currentPage: string[] = [];
  let remainingHeight = pageHeight;

  for (const block of blocks) {
    if (currentPage.length === 0) {
      currentPage.push(block.key);
      remainingHeight = pageHeight - block.height;
      continue;
    }

    if (block.height <= remainingHeight) {
      currentPage.push(block.key);
      remainingHeight -= block.height;
      continue;
    }

    pages.push(currentPage);
    currentPage = [block.key];
    remainingHeight = pageHeight - block.height;
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}
