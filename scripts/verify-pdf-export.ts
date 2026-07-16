/**
 * Ad-hoc verification: exports PDFs through the running dev server for the
 * full-bleed layouts (1-page and multi-page variants). Not part of the build.
 *
 *   pnpm exec tsx scripts/verify-pdf-export.ts <outDir> [baseUrl]
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";

const outDir = process.argv[2] ?? ".pdf-verify";
const baseUrl = process.argv[3] ?? "http://localhost:3199";

const LAYOUTS: PdfLayoutId[] = ["split", "sidebar", "banner", "tinted", "classic"];

async function exportPdf(layoutId: PdfLayoutId, long: boolean) {
  const draft = createDefaultResumeDraft();
  draft.pdfPresentation.layoutId = layoutId;
  if (long) {
    const work = draft.sections.workExperience;
    const items = work.items;
    for (let i = 0; i < 3; i++) {
      for (const item of [...items]) {
        work.items.push({ ...item, id: `${item.id}-dup-${i}-${Math.random().toString(36).slice(2, 8)}` });
      }
    }
  }
  const res = await fetch(`${baseUrl}/api/export-pdf`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ draft }),
  });
  if (!res.ok) {
    throw new Error(`${layoutId}${long ? "-long" : ""}: HTTP ${res.status} ${await res.text()}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const file = path.join(outDir, `${layoutId}${long ? "-long" : ""}.pdf`);
  await writeFile(file, buf);
  console.log(`ok ${file} (${(buf.length / 1024).toFixed(0)} KB)`);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  for (const layoutId of LAYOUTS) {
    await exportPdf(layoutId, false);
  }
  await exportPdf("split", true);
  await exportPdf("sidebar", true);
  await exportPdf("classic", true);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
