import { Reveal } from "@/components/landing/reveal";

import { layoutsInCategory, type CategoryFilter } from "./categories";
import { TemplateCard } from "./template-card";

const COLUMNS = 4;

export function TemplatesGrid({ category }: { category: CategoryFilter }) {
  const layouts = layoutsInCategory(category);
  return (
    <section className="px-6 pb-24 sm:pb-32">
      {/* Keyed on the category so a filter re-deals the whole grid in one
          cascade. Without it, cards that survive the filter keep their identity
          and stay put while only the new ones animate in. */}
      <div
        key={category}
        className="mx-auto grid max-w-[80rem] grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4"
      >
        {layouts.map(({ layoutId, presets }, i) => (
          // Each card reveals on its own scroll-in, offset by its column so a
          // row cascades left to right. One <RevealStagger> over all of them
          // would run a single 4s cascade from the top of the page and be over
          // long before most are scrolled to.
          <Reveal key={layoutId} delay={(i % COLUMNS) * 0.08}>
            <TemplateCard layoutId={layoutId} presets={presets} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
