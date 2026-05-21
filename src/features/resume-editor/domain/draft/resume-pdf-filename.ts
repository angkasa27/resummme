import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

function slugifyName(value: string) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "resume";
}

function formatTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "undated";
  }

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

export function createResumePdfFilename(draft: ResumeDraft) {
  const fullName = draft.profile.fullName?.trim() || "resume";
  const slug = slugifyName(fullName);
  const timestamp = formatTimestamp(draft.updatedAt);

  return `resume-${slug}-${timestamp}.pdf`;
}
