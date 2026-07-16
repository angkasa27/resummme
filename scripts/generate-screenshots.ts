/**
 * Generates landing-page screenshots:
 *   - public/templates/<id>.webp — each resume template, a different persona
 *   - public/builder.webp        — the editor (desktop canvas view)
 *
 * Reuses the PDF render path: it seeds a résumé draft into sessionStorage (the
 * same key the /resume-pdf page reads), navigates there, waits for
 * `data-pdf-ready`, restores page margins + forces an A4 page, and clips to the
 * `.resume-document` article.
 *
 * Requires the app to be running (dev or prod):
 *   pnpm dev          # in one terminal
 *   pnpm screenshots  # in another
 *
 * Override the target with SCREENSHOT_BASE_URL (default http://localhost:3000).
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

import puppeteer, { type Browser } from "puppeteer";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { exportResumeDraft } from "@/features/resume-editor/domain/draft/resume-draft-storage";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { RESUME_PDF_SESSION_STORAGE_KEY } from "@/features/resume-editor/server/resume-pdf-session";
import { PERSONAS, type Persona } from "./personas";

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";
const PUBLIC_DIR = path.join(process.cwd(), "public");
const TEMPLATES_DIR = path.join(PUBLIC_DIR, "templates");
const TIMEOUT = 30_000;

const ul = (bullets: string[]) =>
  `<ul>${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`;

function buildDraft(p: Persona): ResumeDraft {
  const draft = createDefaultResumeDraft();
  draft.pdfPresentation = {
    ...draft.pdfPresentation,
    layoutId: p.layoutId,
    accent: p.accent,
    secondary: p.secondary,
  };
  draft.profile = {
    ...draft.profile,
    fullName: p.fullName,
    location: p.location,
    phone: p.phone,
    email: p.email,
    photo: p.photo,
    extraLinks: p.links.map((url, i) => ({
      id: `link-${p.screenshotId}-${i}`,
      url,
    })),
  };

  const s = draft.sections;
  const workBase = s.workExperience.items[0];
  const projectBase = s.projects.items[0];
  const certBase = s.certifications.items[0];

  s.summary = { ...s.summary, content: p.summary };
  s.workExperience = {
    ...s.workExperience,
    items: p.work.map((w, i) => ({
      ...workBase,
      id: `work-${p.screenshotId}-${i}`,
      companyName: w.company,
      position: w.position,
      location: w.location,
      startDate: w.start,
      endDate: w.end,
      description: ul(w.bullets),
    })),
  };
  s.skills = {
    ...s.skills,
    items: [
      {
        ...s.skills.items[0],
        categoryName: p.skills.category,
        skills: p.skills.items,
      },
    ],
  };
  s.projects = {
    ...s.projects,
    items: p.projects.map((pr, i) => ({
      ...projectBase,
      id: `project-${p.screenshotId}-${i}`,
      projectName: pr.name,
      startDate: pr.start,
      endDate: pr.end,
      description: ul(pr.bullets),
    })),
  };
  s.certifications = {
    ...s.certifications,
    visible: true,
    items: p.certs.map((c, i) => ({
      ...certBase,
      id: `cert-${p.screenshotId}-${i}`,
      certificationName: c.name,
      issuingOrganization: c.org,
      issuedDate: c.date,
    })),
  };
  s.education = {
    ...s.education,
    items: [
      {
        ...s.education.items[0],
        name: p.education.name,
        location: p.education.location,
        startDate: p.education.start,
        endDate: p.education.end,
        degree: p.education.degree,
        gpa: p.education.gpa,
        description: ul([p.education.note]),
      },
    ],
  };
  return draft;
}

/**
 * Re-applies page margins and forces a single A4 page so the clipped screenshot
 * is portrait-proportioned with no flush edges (runs in the browser).
 */
function shapeAsA4Page() {
  const el = document.querySelector<HTMLElement>(".resume-document");
  if (!el) return;
  const cs = getComputedStyle(el);
  const paper = cs.getPropertyValue("--resume-paper-width").trim();
  const margin = cs.getPropertyValue("--resume-page-margin").trim();
  el.style.boxSizing = "border-box";
  el.style.alignSelf = "flex-start";
  if (paper) el.style.width = paper;
  el.style.padding = margin || "10mm";
  // Exactly one A4 page tall (210:297). Overflowing content is cropped so
  // every screenshot is the same height.
  el.style.height = `${el.offsetWidth * 1.41421}px`;
  el.style.overflow = "hidden";
}

async function captureTemplates(browser: Browser) {
  for (const persona of PERSONAS) {
    const serialized = exportResumeDraft(buildDraft(persona));

    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 1800, deviceScaleFactor: 2 });
    await page.evaluateOnNewDocument(
      ({ key, value }) => window.sessionStorage.setItem(key, value),
      { key: RESUME_PDF_SESSION_STORAGE_KEY, value: serialized },
    );

    await page.goto(new URL("/resume-pdf", BASE_URL).toString(), {
      waitUntil: "networkidle0",
      timeout: TIMEOUT,
    });
    await page.waitForSelector('[data-pdf-ready="true"]', { timeout: TIMEOUT });
    await page.evaluate(shapeAsA4Page);

    const article = await page.$(".resume-document");
    if (!article)
      throw new Error(
        `No .resume-document rendered for ${persona.screenshotId}`,
      );

    const out = path.join(TEMPLATES_DIR, `${persona.screenshotId}.webp`);
    await article.screenshot({
      path: out as `${string}.webp`,
      type: "webp",
      quality: 90,
    });
    console.log(
      `✓ template  ${persona.screenshotId.padEnd(16)} ${persona.fullName}`,
    );
    await page.close();
  }
}

async function captureBuilder(browser: Browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(new URL("/editor", BASE_URL).toString(), {
    waitUntil: "networkidle0",
    timeout: TIMEOUT,
  });
  await page
    .waitForSelector(".resume-document", { timeout: TIMEOUT })
    .catch(() => undefined);
  await new Promise((resolve) => setTimeout(resolve, 1_500));

  const out = path.join(PUBLIC_DIR, "builder.webp");
  await page.screenshot({
    path: out as `${string}.webp`,
    type: "webp",
    quality: 92,
  });
  console.log(`✓ builder   ${"editor".padEnd(16)} → public/builder.webp`);
  await page.close();
}

async function assertServerUp() {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(5_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Cannot reach ${BASE_URL} (${reason}). Start the app first: \`pnpm dev\` (or \`pnpm build && pnpm start\`).`,
    );
  }
}

async function main() {
  await assertServerUp();
  await mkdir(TEMPLATES_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  try {
    await captureTemplates(browser);
    await captureBuilder(browser);
  } finally {
    await browser.close();
  }
  console.log("✓ Screenshots generated.");
}

main().catch((error) => {
  console.error(`✖ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
