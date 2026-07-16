import Image from "next/image";

import { CAROUSEL_SCREENSHOTS } from "./carousel-screenshots";
import { Marquee } from "./marquee";
import { Reveal, RevealItem, RevealStagger } from "./reveal";

type Card = {
  id: string;
  label: string;
  src: string;
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SHUFFLED = shuffleArray(CAROUSEL_SCREENSHOTS);
const MID = Math.ceil(SHUFFLED.length / 2);
const ROWS: Card[][] = [
  SHUFFLED.slice(0, MID),
  SHUFFLED.slice(MID),
].map((row) => row.map((t) => ({ ...t, src: `/templates/${t.id}.webp` })));

function TemplateCard({ template }: { template: Card }) {
  return (
    <div className="group relative aspect-[1/1.414] w-60 shrink-0 overflow-hidden rounded-xl border bg-background">
      <Image
        src={template.src}
        alt={`${template.label} resume template`}
        fill
        sizes="(max-width: 640px) 50vw, 240px"
        className="object-cover object-top"
        loading="lazy"
        quality={80}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-linear-to-t from-black/65 via-black/20 to-transparent px-3 pt-10 pb-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="text-sm font-semibold text-white">
          {template.label}
        </span>
      </div>
    </div>
  );
}

export function TemplateCarousel() {
  const cards = ROWS.map((row) =>
    row.map((template) => (
      <TemplateCard key={template.id} template={template} />
    )),
  );

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 560px at 50% 40%, rgba(139, 92, 246, 0.16), transparent 70%)",
        }}
      />

      <RevealStagger className="relative mx-auto max-w-2xl px-6 text-center">
        <RevealItem>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Customize your{" "}
            <span className="bg-linear-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent">
              resume
            </span>
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="mt-4 text-muted-foreground">
            Pick a template, tweak the colors and fonts, and make it
            unmistakably yours.
          </p>
        </RevealItem>
      </RevealStagger>

      <Reveal className="relative mx-auto mt-14 max-w-[110rem]">
        <div className="flex flex-col gap-6">
          <Marquee direction="left" speed={28}>
            {cards[0]}
          </Marquee>
          <Marquee direction="right" speed={28}>
            {cards[1]}
          </Marquee>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent sm:w-64" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent sm:w-64" />
      </Reveal>
    </section>
  );
}
