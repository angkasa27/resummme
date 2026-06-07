import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { createResumePdfFilename } from "@/features/resume-editor/domain/draft/resume-pdf-filename";

describe("createResumePdfFilename", () => {
  it("generates a filename from the draft profile name and timestamp", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.fullName = "Dimas Angkasa";
    draft.updatedAt = "2026-05-21T14:23:55.000Z";

    const filename = createResumePdfFilename(draft);

    expect(filename).toMatch(/^resume-dimas-angkasa-/);
    expect(filename).toMatch(/\.pdf$/);
  });

  it("slugifes the name to lowercase with hyphens", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.fullName = "John A. Doe";
    draft.updatedAt = "2026-01-01T00:00:00.000Z";

    const filename = createResumePdfFilename(draft);

    expect(filename).toMatch(/^resume-john-a-doe-/);
  });

  it("uses 'resume' when the name is empty", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.fullName = "";
    draft.updatedAt = "2026-05-21T14:23:55.000Z";

    const filename = createResumePdfFilename(draft);

    expect(filename).toMatch(/^resume-resume-/);
  });

  it("formats the timestamp as YYYYMMDD-HHmmss in local time", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.fullName = "Test";
    const ts = new Date(2026, 4, 21, 14, 23, 55);
    draft.updatedAt = ts.toISOString();

    const filename = createResumePdfFilename(draft);

    const localYear = String(ts.getFullYear());
    const localMonth = String(ts.getMonth() + 1).padStart(2, "0");
    const localDay = String(ts.getDate()).padStart(2, "0");
    const localHours = String(ts.getHours()).padStart(2, "0");
    const localMinutes = String(ts.getMinutes()).padStart(2, "0");
    const localSeconds = String(ts.getSeconds()).padStart(2, "0");
    expect(filename).toContain(
      `${localYear}${localMonth}${localDay}-${localHours}${localMinutes}${localSeconds}`,
    );
  });

  it("uses 'undated' when updatedAt is not a valid date", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.fullName = "Test";
    draft.updatedAt = "garbage";

    const filename = createResumePdfFilename(draft);

    expect(filename).toContain("undated");
  });
});
