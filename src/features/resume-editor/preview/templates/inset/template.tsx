import type { TemplateSectionEntry } from "@/features/resume-editor/preview/template-types";
import { createSingleColumnTemplate } from "@/features/resume-editor/preview/templates/_shared/create-single-column-template";

import { InsetHeader } from "./header";
import { insetItemViews } from "./items";
import styles from "./styles.module.css";

// Inset merges the whole skills section into one inline "·"-joined line instead
// of rendering per-item nodes. `entry.key === "skills"` narrows `entry.section`
// to the skills section, so `.items` is typed — no cast needed.
function renderInsetSection(entry: TemplateSectionEntry) {
  const { key, node } = entry;
  if (entry.key === "skills" && entry.section) {
    const allSkills = entry.section.items
      .flatMap((item) => item.skills)
      .filter(Boolean)
      .join("  ·  ");
    if (!allSkills) return <div key={key}>{node}</div>;
    return (
      <section className="section" data-section="skills" key={key}>
        <h2 className="section-heading">{entry.section.heading}</h2>
        <div className={styles.skillsLine}>{allSkills}</div>
      </section>
    );
  }
  return <div key={key}>{node}</div>;
}

export const insetTemplate = createSingleColumnTemplate({
  id: "inset",
  label: "Inset",
  description:
    "Compact inline layout with two-row item headers and merged inline skills.",
  styles,
  Header: InsetHeader,
  itemViews: insetItemViews,
  renderSection: renderInsetSection,
});
