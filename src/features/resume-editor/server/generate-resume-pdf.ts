import { chromium, type Browser } from "playwright";

import { exportResumeDraft } from "@/lib/resume/storage";
import type { ResumeDraft } from "@/lib/resume/schema";
import { RESUME_PDF_SESSION_STORAGE_KEY } from "@/features/resume-editor/server/resume-pdf-session";

type GenerateResumePdfOptions = {
  draft: ResumeDraft;
  origin: string;
  timeoutMs?: number;
};

let browserPromise: Promise<Browser> | null = null;

async function getBrowser() {
  browserPromise ??= chromium.launch({
    headless: true,
  });

  return browserPromise;
}

export async function generateResumePdf({
  draft,
  origin,
  timeoutMs = 20_000,
}: GenerateResumePdfOptions) {
  const browser = await getBrowser();
  const context = await browser.newContext({
    viewport: {
      width: 1280,
      height: 1800,
    },
  });

  let page;
  try {
    page = await context.newPage();

    await page.addInitScript(
      ({ serializedDraft, storageKey }) => {
        window.sessionStorage.setItem(storageKey, serializedDraft);
      },
      {
        serializedDraft: exportResumeDraft(draft),
        storageKey: RESUME_PDF_SESSION_STORAGE_KEY,
      }
    );

    await page.goto(new URL("/resume-pdf", origin).toString(), {
      waitUntil: "networkidle",
      timeout: timeoutMs,
    });
    await page.emulateMedia({
      media: "screen",
    });
    await page.waitForSelector('[data-pdf-ready="true"]', {
      timeout: timeoutMs,
    });

    return new Uint8Array(
      await page.pdf({
        format: "A4",
        margin: {
          top: "12mm",
          right: "12mm",
          bottom: "12mm",
          left: "12mm",
        },
        printBackground: true,
      })
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown PDF generation error";
    throw new Error(`PDF generation failed: ${message}`);
  } finally {
    await context.close();
  }
}
