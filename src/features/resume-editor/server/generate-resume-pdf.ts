import type { Browser, Page } from "puppeteer-core";

import { exportResumeDraft } from "@/features/resume-editor/domain/draft/resume-draft-storage";
import {
  getPageMarginMm,
  normalizePdfPresentation,
  type PdfPaperSize,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { RESUME_PDF_SESSION_STORAGE_KEY } from "@/features/resume-editor/server/resume-pdf-session";

type PdfRenderOptions = {
  format: PdfPaperSize;
  marginMm: number;
};

export type PdfExportProvider =
  | "auto"
  | "local-puppeteer"
  | "cloudflare-browser-run";

type GenerateResumePdfOptions = {
  draft: ResumeDraft;
  origin: string;
  timeoutMs?: number;
};

type PdfPageAdapter = {
  addDraftInitScript: (serializedDraft: string) => Promise<void>;
  goto: (url: string, timeoutMs: number) => Promise<void>;
  emulateScreenMedia: () => Promise<void>;
  waitForReady: (timeoutMs: number) => Promise<void>;
  pdf: (options: PdfRenderOptions) => Promise<Uint8Array>;
  close: () => Promise<void>;
};

type PdfBrowserSession = {
  newPage: () => Promise<PdfPageAdapter>;
  close: () => Promise<void>;
};

type CloudflareBrowserRunConfig = {
  accountId: string;
  apiToken: string;
  keepAliveMs: number;
};

let localBrowserPromise: Promise<Browser> | null = null;

export function parsePdfExportProvider(
  value: string | undefined,
): PdfExportProvider {
  if (
    value === "local-puppeteer" ||
    value === "cloudflare-browser-run" ||
    value === "auto"
  ) {
    return value;
  }

  return "auto";
}

export function getCloudflareBrowserRunConfig(
  env: NodeJS.ProcessEnv = process.env,
): CloudflareBrowserRunConfig | null {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const apiToken = env.CLOUDFLARE_BROWSER_RUN_API_TOKEN?.trim();

  if (!accountId || !apiToken) {
    return null;
  }

  const parsedKeepAliveMs = Number.parseInt(
    env.CLOUDFLARE_BROWSER_RUN_KEEP_ALIVE_MS ?? "60000",
    10,
  );

  return {
    accountId,
    apiToken,
    keepAliveMs:
      Number.isFinite(parsedKeepAliveMs) && parsedKeepAliveMs > 0
        ? parsedKeepAliveMs
        : 60_000,
  };
}

export function resolvePdfExportProvider(
  env: NodeJS.ProcessEnv = process.env,
): Exclude<PdfExportProvider, "auto"> {
  const provider = parsePdfExportProvider(env.PDF_EXPORT_PROVIDER);

  if (provider === "local-puppeteer" || provider === "cloudflare-browser-run") {
    return provider;
  }

  if (env.NODE_ENV === "development") {
    return "local-puppeteer";
  }

  if (getCloudflareBrowserRunConfig(env)) {
    return "cloudflare-browser-run";
  }

  throw new Error(
    "PDF export is not configured for production. Set PDF_EXPORT_PROVIDER=cloudflare-browser-run and provide CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_BROWSER_RUN_API_TOKEN.",
  );
}

export function createCloudflareBrowserRunWSEndpoint(
  config: CloudflareBrowserRunConfig,
) {
  const url = new URL(
    `/client/v4/accounts/${config.accountId}/browser-rendering/devtools/browser`,
    "https://api.cloudflare.com",
  );

  url.protocol = "wss:";
  url.searchParams.set("keep_alive", String(config.keepAliveMs));

  return url.toString();
}

async function getLocalBrowser() {
  localBrowserPromise ??= import("puppeteer").then(({ launch }) =>
    launch({
      headless: true,
    }),
  );

  return localBrowserPromise;
}

function createPuppeteerPageAdapter(page: Page): PdfPageAdapter {
  return {
    async addDraftInitScript(serializedDraft) {
      await page.evaluateOnNewDocument(
        ({ nextSerializedDraft, storageKey }) => {
          window.sessionStorage.setItem(storageKey, nextSerializedDraft);
        },
        {
          nextSerializedDraft: serializedDraft,
          storageKey: RESUME_PDF_SESSION_STORAGE_KEY,
        },
      );
    },
    async goto(url, timeoutMs) {
      await page.goto(url, {
        waitUntil: "networkidle0",
        timeout: timeoutMs,
      });
    },
    async emulateScreenMedia() {
      await page.emulateMediaType("screen");
    },
    async waitForReady(timeoutMs) {
      await page.waitForSelector('[data-pdf-ready="true"]', {
        timeout: timeoutMs,
      });
    },
    async pdf({ format, marginMm }) {
      const margin = `${marginMm}mm`;
      return new Uint8Array(
        await page.pdf({
          format,
          margin: {
            top: margin,
            right: margin,
            bottom: margin,
            left: margin,
          },
          printBackground: true,
        }),
      );
    },
    async close() {
      await page.close();
    },
  };
}

async function createLocalPuppeteerSession(): Promise<PdfBrowserSession> {
  const browser = await getLocalBrowser();

  return {
    async newPage() {
      const page = await browser.newPage();
      await page.setViewport({
        width: 1280,
        height: 1800,
        deviceScaleFactor: 1,
      });
      return createPuppeteerPageAdapter(page);
    },
    async close() {
      // Keep the shared local browser instance alive between exports.
    },
  };
}

async function createCloudflareBrowserRunSession(
  env: NodeJS.ProcessEnv = process.env,
): Promise<PdfBrowserSession> {
  const config = getCloudflareBrowserRunConfig(env);

  if (!config) {
    throw new Error(
      "Cloudflare Browser Run is not configured. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_BROWSER_RUN_API_TOKEN.",
    );
  }

  const { connect } = await import("puppeteer-core");
  const browser = await connect({
    browserWSEndpoint: createCloudflareBrowserRunWSEndpoint(config),
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
    },
  });

  return {
    async newPage() {
      const page = await browser.newPage();
      await page.setViewport({
        width: 1280,
        height: 1800,
        deviceScaleFactor: 1,
      });
      return createPuppeteerPageAdapter(page);
    },
    async close() {
      await browser.close();
    },
  };
}

async function createPdfBrowserSession(
  env: NodeJS.ProcessEnv = process.env,
): Promise<PdfBrowserSession> {
  const provider = resolvePdfExportProvider(env);

  console.log(`Using PDF export provider: ${provider}`);

  if (provider === "cloudflare-browser-run") {
    return createCloudflareBrowserRunSession(env);
  }

  return createLocalPuppeteerSession();
}

export async function generateResumePdf({
  draft,
  origin,
  timeoutMs = 20_000,
}: GenerateResumePdfOptions) {
  const serializedDraft = exportResumeDraft(draft);
  const presentation = normalizePdfPresentation(draft.pdfPresentation);
  const renderOptions: PdfRenderOptions = {
    format: presentation.paperSize,
    marginMm: getPageMarginMm(presentation.pageMargin),
  };
  const session = await createPdfBrowserSession();

  let page: PdfPageAdapter | null = null;

  try {
    page = await session.newPage();
    await page.addDraftInitScript(serializedDraft);
    await page.goto(new URL("/resume-pdf", origin).toString(), timeoutMs);
    await page.emulateScreenMedia();
    await page.waitForReady(timeoutMs);

    return await page.pdf(renderOptions);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown PDF generation error";
    throw new Error(`PDF generation failed: ${message}`);
  } finally {
    if (page) {
      await page.close();
    }
    await session.close();
  }
}
