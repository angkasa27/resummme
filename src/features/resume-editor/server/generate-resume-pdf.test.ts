import { beforeEach, describe, expect, it, vi } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import {
  createCloudflareBrowserRunWSEndpoint,
  getCloudflareBrowserRunConfig,
  parsePdfExportProvider,
  resolvePdfExportProvider,
} from "@/features/resume-editor/server/generate-resume-pdf";

const mockLocalPuppeteerPage = {
  evaluateOnNewDocument: vi.fn(),
  goto: vi.fn(),
  emulateMediaType: vi.fn(),
  waitForSelector: vi.fn(),
  pdf: vi.fn(),
  setViewport: vi.fn(),
  close: vi.fn(),
};

const mockLocalPuppeteerBrowser = {
  newPage: vi.fn(),
};

const mockCloudflarePage = {
  setViewport: vi.fn(),
  evaluateOnNewDocument: vi.fn(),
  goto: vi.fn(),
  emulateMediaType: vi.fn(),
  waitForSelector: vi.fn(),
  pdf: vi.fn(),
  close: vi.fn(),
};

const mockCloudflareBrowser = {
  newPage: vi.fn(),
  close: vi.fn(),
};

const mockLocalPuppeteerLaunch = vi.fn();
const mockPuppeteerConnect = vi.fn();

vi.mock("puppeteer", () => ({
  launch: mockLocalPuppeteerLaunch,
}));

vi.mock("puppeteer-core", () => ({
  connect: mockPuppeteerConnect,
}));

describe("generate-resume-pdf provider config", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("parses supported provider values", () => {
    expect(parsePdfExportProvider("local-puppeteer")).toBe("local-puppeteer");
    expect(parsePdfExportProvider("cloudflare-browser-run")).toBe(
      "cloudflare-browser-run"
    );
    expect(parsePdfExportProvider("auto")).toBe("auto");
    expect(parsePdfExportProvider("nope")).toBe("auto");
  });

  it("returns Browser Run config with default keep-alive", () => {
    const config = getCloudflareBrowserRunConfig({
      NODE_ENV: "test",
      CLOUDFLARE_ACCOUNT_ID: "acc_123",
      CLOUDFLARE_BROWSER_RUN_API_TOKEN: "token_123",
    });

    expect(config).toEqual({
      accountId: "acc_123",
      apiToken: "token_123",
      keepAliveMs: 60_000,
    });
  });

  it("builds the expected Browser Run websocket endpoint", () => {
    const wsEndpoint = createCloudflareBrowserRunWSEndpoint({
      accountId: "acc_123",
      apiToken: "token_123",
      keepAliveMs: 90_000,
    });

    expect(wsEndpoint).toBe(
      "wss://api.cloudflare.com/client/v4/accounts/acc_123/browser-rendering/devtools/browser?keep_alive=90000"
    );
  });

  it("uses local Puppeteer in development when provider is auto", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("PDF_EXPORT_PROVIDER", "auto");

    expect(resolvePdfExportProvider()).toBe("local-puppeteer");
  });

  it("uses Cloudflare Browser Run in production when configured", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("PDF_EXPORT_PROVIDER", "auto");
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "acc_123");
    vi.stubEnv("CLOUDFLARE_BROWSER_RUN_API_TOKEN", "token_123");

    expect(resolvePdfExportProvider()).toBe("cloudflare-browser-run");
  });

  it("respects explicit provider values", () => {
    vi.stubEnv("PDF_EXPORT_PROVIDER", "local-puppeteer");
    expect(resolvePdfExportProvider()).toBe("local-puppeteer");

    vi.stubEnv("PDF_EXPORT_PROVIDER", "cloudflare-browser-run");
    expect(resolvePdfExportProvider()).toBe("cloudflare-browser-run");
  });

  it("fails fast in production when auto has no Browser Run config", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("PDF_EXPORT_PROVIDER", "auto");

    expect(() => resolvePdfExportProvider()).toThrow(
      /PDF export is not configured for production/
    );
  });
});

describe("generateResumePdf", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();

    mockLocalPuppeteerPage.evaluateOnNewDocument.mockResolvedValue(undefined);
    mockLocalPuppeteerPage.goto.mockResolvedValue(undefined);
    mockLocalPuppeteerPage.emulateMediaType.mockResolvedValue(undefined);
    mockLocalPuppeteerPage.waitForSelector.mockResolvedValue(undefined);
    mockLocalPuppeteerPage.pdf.mockResolvedValue(new Uint8Array([1, 2, 3]));
    mockLocalPuppeteerPage.setViewport.mockResolvedValue(undefined);
    mockLocalPuppeteerPage.close.mockResolvedValue(undefined);

    mockLocalPuppeteerBrowser.newPage.mockResolvedValue(mockLocalPuppeteerPage);
    mockLocalPuppeteerLaunch.mockResolvedValue(mockLocalPuppeteerBrowser);

    mockCloudflarePage.setViewport.mockResolvedValue(undefined);
    mockCloudflarePage.evaluateOnNewDocument.mockResolvedValue(undefined);
    mockCloudflarePage.goto.mockResolvedValue(undefined);
    mockCloudflarePage.emulateMediaType.mockResolvedValue(undefined);
    mockCloudflarePage.waitForSelector.mockResolvedValue(undefined);
    mockCloudflarePage.pdf.mockResolvedValue(new Uint8Array([4, 5, 6]));
    mockCloudflarePage.close.mockResolvedValue(undefined);

    mockCloudflareBrowser.newPage.mockResolvedValue(mockCloudflarePage);
    mockCloudflareBrowser.close.mockResolvedValue(undefined);
    mockPuppeteerConnect.mockResolvedValue(mockCloudflareBrowser);
  });

  it("renders with local Puppeteer when configured", async () => {
    vi.stubEnv("PDF_EXPORT_PROVIDER", "local-puppeteer");

    const { generateResumePdf } = await import(
      "@/features/resume-editor/server/generate-resume-pdf"
    );
    const pdf = await generateResumePdf({
      draft: createDefaultResumeDraft(),
      origin: "https://resume.example.com",
    });

    expect(pdf).toEqual(new Uint8Array([1, 2, 3]));
    expect(mockLocalPuppeteerLaunch).toHaveBeenCalledWith({ headless: true });
    expect(mockLocalPuppeteerBrowser.newPage).toHaveBeenCalled();
    expect(mockLocalPuppeteerPage.setViewport).toHaveBeenCalledWith({
      width: 1280,
      height: 1800,
      deviceScaleFactor: 1,
    });
    expect(mockLocalPuppeteerPage.goto).toHaveBeenCalledWith(
      "https://resume.example.com/resume-pdf",
      expect.objectContaining({ waitUntil: "networkidle0" })
    );
    expect(mockLocalPuppeteerPage.pdf).toHaveBeenCalledWith(
      expect.objectContaining({
        format: "a4",
        printBackground: true,
        margin: {
          top: "12.7mm",
          right: "12.7mm",
          bottom: "12.7mm",
          left: "12.7mm",
        },
      })
    );
    expect(mockLocalPuppeteerPage.close).toHaveBeenCalled();
  });

  it("passes the draft's paperSize and pageMargin into the PDF call", async () => {
    vi.stubEnv("PDF_EXPORT_PROVIDER", "local-puppeteer");

    const { generateResumePdf } = await import(
      "@/features/resume-editor/server/generate-resume-pdf"
    );
    const draft = createDefaultResumeDraft();
    draft.pdfPresentation.paperSize = "letter";
    draft.pdfPresentation.pageMargin = "moderate";

    await generateResumePdf({
      draft,
      origin: "https://resume.example.com",
    });

    expect(mockLocalPuppeteerPage.pdf).toHaveBeenCalledWith(
      expect.objectContaining({
        format: "letter",
        margin: {
          top: "19.05mm",
          right: "19.05mm",
          bottom: "19.05mm",
          left: "19.05mm",
        },
      })
    );
  });

  it("connects to Cloudflare Browser Run and preserves PDF rendering behavior", async () => {
    vi.stubEnv("PDF_EXPORT_PROVIDER", "cloudflare-browser-run");
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "acc_123");
    vi.stubEnv("CLOUDFLARE_BROWSER_RUN_API_TOKEN", "token_123");
    vi.stubEnv("CLOUDFLARE_BROWSER_RUN_KEEP_ALIVE_MS", "90000");

    const { generateResumePdf } = await import(
      "@/features/resume-editor/server/generate-resume-pdf"
    );
    const pdf = await generateResumePdf({
      draft: createDefaultResumeDraft(),
      origin: "https://resume.example.com",
    });

    expect(pdf).toEqual(new Uint8Array([4, 5, 6]));
    expect(mockPuppeteerConnect).toHaveBeenCalledWith({
      browserWSEndpoint:
        "wss://api.cloudflare.com/client/v4/accounts/acc_123/browser-rendering/devtools/browser?keep_alive=90000",
      headers: {
        Authorization: "Bearer token_123",
      },
    });
    expect(mockCloudflarePage.goto).toHaveBeenCalledWith(
      "https://resume.example.com/resume-pdf",
      expect.objectContaining({ waitUntil: "networkidle0" })
    );
    expect(mockCloudflarePage.pdf).toHaveBeenCalledWith(
      expect.objectContaining({
        format: "a4",
        printBackground: true,
      })
    );
    expect(mockCloudflareBrowser.close).toHaveBeenCalled();
  });
});
